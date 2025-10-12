// ===== ÁRBOL INTERACTIVO DE DECISIONES =====
// Implementación principal usando D3.js

class DecisionTree {
    constructor() {
        this.svg = null;
        this.g = null;
        this.tree = null;
        this.root = null;
        this.currentActiveNode = null;
        this.tooltip = null;
        this.isEditMode = false;
        this.editingNode = null;
        this.isCreateMode = false;
        this.selectedParentNode = null;
        this.generatedIdeas = [];
        
        this.init();
    }

    init() {
        this.setupSVG();
        this.setupTree();
        this.setupEventListeners();
        this.createTooltip();
        this.render();
    }

    setupSVG() {
        const container = document.getElementById('tree-container');
        const rect = container.getBoundingClientRect();
        
        this.svg = d3.select("#tree-svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${treeConfig.width} ${treeConfig.height}`);

        // Grupo principal con zoom y pan
        this.g = this.svg.append("g");

        // Configurar zoom y pan
        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });

        this.svg.call(zoom);

        // Centrar inicialmente
        const initialTransform = d3.zoomIdentity
            .translate(treeConfig.width / 2, 50)
            .scale(0.8);
        
        this.svg.call(zoom.transform, initialTransform);
    }

    setupTree() {
        // Configurar el layout del árbol
        this.tree = d3.tree()
            .size([treeConfig.width - 200, treeConfig.height - 100])
            .separation((a, b) => {
                return (a.parent === b.parent ? 1 : 2) * 1.2;
            });

        // Procesar los datos
        this.root = d3.hierarchy(treeData);
        this.root.x0 = treeConfig.width / 2;
        this.root.y0 = 0;

        // Colapsar todos los nodos excepto el primero nivel
        this.root.children?.forEach(this.collapse.bind(this));
    }

    collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapse.bind(this));
            d.children = null;
        }
    }

    expand(d) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
    }

    expandAll(d = this.root) {
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        if (d.children) {
            d.children.forEach(this.expandAll.bind(this));
        }
        this.update(d);
    }

    collapseAll(d = this.root) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(this.collapseAll.bind(this));
            d.children = null;
        }
        this.update(d);
    }

    setupEventListeners() {
        // Botones de control
        document.getElementById('expandAll').addEventListener('click', () => {
            this.expandAll();
        });

        document.getElementById('collapseAll').addEventListener('click', () => {
            this.collapseAll();
        });

        document.getElementById('centerTree').addEventListener('click', () => {
            this.centerTree();
        });

        document.getElementById('editMode').addEventListener('click', () => {
            this.toggleEditMode();
        });

        document.getElementById('saveTree').addEventListener('click', () => {
            this.saveTreeData();
        });

        document.getElementById('addNode').addEventListener('click', () => {
            this.startCreateMode();
        });

        document.getElementById('generateIdeas').addEventListener('click', () => {
            this.showGenerateSection();
        });

        // Panel de información
        document.getElementById('close-panel').addEventListener('click', () => {
            this.hideInfoPanel();
        });

        // Botones de edición
        document.getElementById('save-node').addEventListener('click', () => {
            this.saveNodeEdit();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.cancelNodeEdit();
        });

        document.getElementById('delete-node').addEventListener('click', () => {
            this.deleteNode();
        });

        // Botones de creación
        document.getElementById('create-node').addEventListener('click', () => {
            this.createNewNode();
        });

        document.getElementById('cancel-create').addEventListener('click', () => {
            this.cancelCreateMode();
        });

        // Botones de generación
        document.getElementById('generate-ideas').addEventListener('click', () => {
            this.generateIdeas();
        });

        document.getElementById('cancel-generate').addEventListener('click', () => {
            this.hideGenerateSection();
        });
    }

    createTooltip() {
        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");
    }

    render() {
        this.update(this.root);
    }

    update(source) {
        // Calcular nuevo layout
        const treeData = this.tree(this.root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);

        // Normalizar para layout de árbol vertical
        nodes.forEach(d => {
            d.y = d.depth * 180;
        });

        // ===== NODOS =====
        const node = this.g.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++this.nodeId || 0));

        // Entrar nuevos nodos
        const nodeEnter = node.enter().append('g')
            .attr('class', d => `node ${d.data.type}`)
            .attr('transform', d => `translate(${source.x0},${source.y0})`)
            .style('opacity', 0);

        // Círculos de nodos
        nodeEnter.append('circle')
            .attr('r', 1e-6)
            .style('fill', d => this.getNodeColor(d))
            .attr('class', d => {
                let classes = '';
                if (this.isCreateMode) {
                    classes += 'can-add-child ';
                }
                if (this.selectedParentNode === d) {
                    classes += 'selected-parent ';
                }
                return classes;
            })
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());

        // Texto de nodos
        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .text(d => {
                const icon = getNodeIcon(d.data.type, d.data.name);
                const name = d.data.name.replace(/[🎯📊✅❌⚡🤝📋🔍⏸️🚀⚖️]/g, '').trim();
                return name.length > 15 ? name.substring(0, 15) + '...' : name;
            })
            .style('font-size', '10px')
            .style('opacity', 0);

        // Iconos
        nodeEnter.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-35px')
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .text(d => getNodeIcon(d.data.type, d.data.name))
            .style('opacity', 0);

        // TRANSICIÓN DE ENTRADA
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(treeConfig.animation.duration)
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .style('opacity', 1);

        nodeUpdate.select('circle')
            .transition()
            .duration(treeConfig.animation.duration)
            .attr('r', treeConfig.nodeRadius)
            .style('fill', d => this.getNodeColor(d));

        nodeUpdate.select('text')
            .transition()
            .duration(treeConfig.animation.duration)
            .style('opacity', 1);

        nodeUpdate.select('.node-icon')
            .transition()
            .duration(treeConfig.animation.duration)
            .style('opacity', 1);

        // TRANSICIÓN DE SALIDA
        const nodeExit = node.exit().transition()
            .duration(treeConfig.animation.duration)
            .attr('transform', d => `translate(${source.x},${source.y})`)
            .style('opacity', 0)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        // ===== ENLACES =====
        const link = this.g.selectAll('path.link')
            .data(links, d => d.id);

        // Entrar nuevos enlaces
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal(o, o);
            })
            .style('opacity', 0);

        // TRANSICIÓN DE ACTUALIZACIÓN
        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(treeConfig.animation.duration)
            .attr('d', d => this.diagonal(d, d.parent))
            .style('opacity', 1);

        // TRANSICIÓN DE SALIDA
        link.exit().transition()
            .duration(treeConfig.animation.duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .style('opacity', 0)
            .remove();

        // Guardar posiciones para próxima transición
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s, d) {
        return `M ${s.x} ${s.y}
                C ${s.x} ${(s.y + d.y) / 2},
                  ${d.x} ${(s.y + d.y) / 2},
                  ${d.x} ${d.y}`;
    }

    getNodeColor(d) {
        if (d === this.selectedParentNode) return '#28a745'; // Verde para padre seleccionado
        if (d === this.currentActiveNode) return treeConfig.colors.active;
        return treeConfig.colors[d.data.type] || treeConfig.colors.branch;
    }

    handleNodeClick(event, d) {
        if (this.isCreateMode) {
            // En modo creación, seleccionar como padre
            this.selectParentForCreation(d);
        } else if (this.isEditMode) {
            // En modo edición, abrir panel de edición
            this.editNode(d);
        } else {
            // Modo normal: expandir/colapsar
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            // Actualizar nodo activo
            this.currentActiveNode = d;
            
            // Mostrar información
            this.showNodeInfo(d);
            
            // Actualizar vista
            this.update(d);
        }
    }

    showNodeInfo(d) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');

        // Actualizar contenido
        title.textContent = d.data.name;
        description.textContent = d.data.description;

        // Limpiar detalles anteriores
        details.innerHTML = '';

        // Agregar detalles si existen
        if (d.data.details) {
            Object.entries(d.data.details).forEach(([key, value]) => {
                const detailItem = document.createElement('div');
                detailItem.className = 'detail-item';
                
                const label = document.createElement('div');
                label.className = 'detail-label';
                label.textContent = this.formatLabel(key);
                
                const content = document.createElement('div');
                if (Array.isArray(value)) {
                    content.innerHTML = value.map(item => `• ${item}`).join('<br>');
                } else {
                    content.textContent = value;
                }
                
                detailItem.appendChild(label);
                detailItem.appendChild(content);
                details.appendChild(detailItem);
            });
        }

        // Mostrar panel
        panel.classList.add('active');
    }

    hideInfoPanel() {
        const panel = document.getElementById('info-panel');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const editSection = document.getElementById('edit-section');
        const createSection = document.getElementById('create-section');
        const generateSection = document.getElementById('generate-section');
        
        panel.classList.remove('active');
        
        // Restaurar vista normal
        description.style.display = 'block';
        details.style.display = 'block';
        editSection.style.display = 'none';
        createSection.style.display = 'none';
        generateSection.style.display = 'none';
        
        this.currentActiveNode = null;
        this.editingNode = null;
        this.isCreateMode = false;
        this.selectedParentNode = null;
        this.update(this.root);
    }

    formatLabel(key) {
        const labels = {
            objective: '🎯 Objetivo',
            criteria: '📋 Criterios',
            timeline: '⏰ Tiempo',
            risks: '⚠️ Riesgos',
            nextSteps: '➡️ Próximos Pasos',
            confidence: '📊 Confianza',
            resources: '🔧 Recursos',
            methods: '🛠️ Métodos',
            advantages: '✅ Ventajas',
            disadvantages: '❌ Desventajas',
            monitoring: '👁️ Monitoreo',
            participants: '👥 Participantes',
            benefits: '💡 Beneficios'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    showTooltip(event, d) {
        const tooltip = this.tooltip;
        tooltip.style("visibility", "visible")
            .html(`<strong>${d.data.name}</strong><br>${d.data.description}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }

    hideTooltip() {
        this.tooltip.style("visibility", "hidden");
    }

    centerTree() {
        const zoom = d3.zoom();
        const transform = d3.zoomIdentity
            .translate(treeConfig.width / 2, 50)
            .scale(0.8);
        
        this.svg.transition()
            .duration(750)
            .call(zoom.transform, transform);
    }

    resetZoom() {
        const zoom = d3.zoom();
        this.svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    }

    // ===== FUNCIONES DE EDICIÓN =====
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.isCreateMode = false; // Resetear modo creación
        
        const button = document.getElementById('editMode');
        const addButton = document.getElementById('addNode');
        const generateButton = document.getElementById('generateIdeas');
        const body = document.body;
        
        if (this.isEditMode) {
            button.textContent = '👁️ Modo Vista';
            button.style.background = '#FF6B6B';
            addButton.style.display = 'inline-block';
            generateButton.style.display = 'inline-block';
            body.classList.add('edit-mode');
        } else {
            button.textContent = '✏️ Modo Edición';
            button.style.background = '';
            addButton.style.display = 'none';
            generateButton.style.display = 'none';
            body.classList.remove('edit-mode');
            this.hideInfoPanel();
        }
        
        this.update(this.root);
    }

    editNode(d) {
        this.editingNode = d;
        this.currentActiveNode = d;
        
        // Mostrar panel con formulario de edición
        this.showNodeEditForm(d);
        this.update(d);
    }

    showNodeEditForm(d) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const editSection = document.getElementById('edit-section');

        // Ocultar información normal y mostrar formulario
        description.style.display = 'none';
        details.style.display = 'none';
        editSection.style.display = 'block';

        // Actualizar título
        title.textContent = '✏️ Editando: ' + d.data.name;

        // Llenar formulario con datos actuales
        document.getElementById('edit-name').value = d.data.name || '';
        document.getElementById('edit-description').value = d.data.description || '';
        document.getElementById('edit-type').value = d.data.type || 'leaf';

        // Mostrar panel
        panel.classList.add('active');
    }

    saveNodeEdit() {
        if (!this.editingNode) return;

        const name = document.getElementById('edit-name').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const type = document.getElementById('edit-type').value;

        if (!name) {
            alert('El nombre del nodo es obligatorio');
            return;
        }

        // Actualizar datos del nodo
        this.editingNode.data.name = name;
        this.editingNode.data.description = description;
        this.editingNode.data.type = type;

        // Actualizar vista
        this.update(this.editingNode);
        this.hideInfoPanel();
        
        // Mostrar confirmación
        this.showNotification('✅ Nodo actualizado correctamente', 'success');
    }

    cancelNodeEdit() {
        this.hideInfoPanel();
        this.editingNode = null;
    }

    deleteNode() {
        if (!this.editingNode || this.editingNode === this.root) {
            alert('No se puede eliminar el nodo raíz');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar este nodo y todos sus hijos?')) {
            const parent = this.editingNode.parent;
            if (parent) {
                // Remover el nodo del padre
                if (parent.children) {
                    parent.children = parent.children.filter(child => child !== this.editingNode);
                    if (parent.children.length === 0) {
                        parent.children = null;
                    }
                }
                if (parent._children) {
                    parent._children = parent._children.filter(child => child !== this.editingNode);
                    if (parent._children.length === 0) {
                        parent._children = null;
                    }
                }
            }

            this.update(parent || this.root);
            this.hideInfoPanel();
            this.showNotification('🗑️ Nodo eliminado', 'warning');
        }
    }

    saveTreeData() {
        const treeJson = JSON.stringify(this.root.data, null, 2);
        const blob = new Blob([treeJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arbol-proyecto-vida.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('💾 Árbol guardado correctamente', 'success');
    }

    // ===== FUNCIONES DE CREACIÓN =====
    startCreateMode() {
        this.isCreateMode = true;
        this.selectedParentNode = null;
        
        // Mostrar sección de creación
        this.showCreateSection();
        this.showNotification('👆 Haz clic en un nodo para seleccionarlo como padre', 'info');
        this.update(this.root);
    }

    cancelCreateMode() {
        this.isCreateMode = false;
        this.selectedParentNode = null;
        this.hideInfoPanel();
        this.update(this.root);
    }

    selectParentForCreation(d) {
        this.selectedParentNode = d;
        document.getElementById('create-parent').value = d.data.name;
        this.showNotification(`✅ Padre seleccionado: ${d.data.name}`, 'success');
        this.update(this.root);
    }

    showCreateSection() {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const editSection = document.getElementById('edit-section');
        const createSection = document.getElementById('create-section');
        const generateSection = document.getElementById('generate-section');

        // Ocultar otras secciones
        description.style.display = 'none';
        details.style.display = 'none';
        editSection.style.display = 'none';
        generateSection.style.display = 'none';
        
        // Mostrar sección de creación
        createSection.style.display = 'block';
        title.textContent = '➕ Crear Nuevo Nodo';

        // Limpiar formulario
        document.getElementById('create-name').value = '';
        document.getElementById('create-description').value = '';
        document.getElementById('create-type').value = 'leaf';
        document.getElementById('create-parent').value = '';

        panel.classList.add('active');
    }

    createNewNode() {
        if (!this.selectedParentNode) {
            this.showNotification('❌ Selecciona un nodo padre primero', 'error');
            return;
        }

        const name = document.getElementById('create-name').value.trim();
        const description = document.getElementById('create-description').value.trim();
        const type = document.getElementById('create-type').value;

        if (!name) {
            this.showNotification('❌ El nombre del nodo es obligatorio', 'error');
            return;
        }

        // Crear nuevo nodo
        const newNodeData = {
            name: name,
            type: type,
            description: description || `Nuevo nodo de tipo ${type}`,
            details: {
                created: new Date().toLocaleDateString(),
                status: 'En planificación'
            }
        };

        // Agregar al padre seleccionado
        if (!this.selectedParentNode.data.children) {
            this.selectedParentNode.data.children = [];
        }
        this.selectedParentNode.data.children.push(newNodeData);

        // Actualizar estructura D3
        this.root = d3.hierarchy(treeData);
        this.root.x0 = treeConfig.width / 2;
        this.root.y0 = 0;

        // Expandir el padre para mostrar el nuevo nodo
        this.expandNodePath(this.selectedParentNode);

        this.update(this.root);
        this.cancelCreateMode();
        this.showNotification(`✅ Nodo "${name}" creado exitosamente`, 'success');
    }

    expandNodePath(targetNode) {
        let current = this.root;
        const path = [];
        
        // Encontrar el camino al nodo objetivo
        function findPath(node, target) {
            if (node.data.name === target.data.name) {
                return true;
            }
            if (node.children || node._children) {
                const children = node.children || node._children;
                for (let child of children) {
                    if (findPath(child, target)) {
                        if (node._children) {
                            node.children = node._children;
                            node._children = null;
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        
        findPath(current, targetNode);
    }

    // ===== FUNCIONES DE GENERACIÓN DE IDEAS =====
    showGenerateSection() {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const editSection = document.getElementById('edit-section');
        const createSection = document.getElementById('create-section');
        const generateSection = document.getElementById('generate-section');

        // Ocultar otras secciones
        description.style.display = 'none';
        details.style.display = 'none';
        editSection.style.display = 'none';
        createSection.style.display = 'none';
        
        // Mostrar sección de generación
        generateSection.style.display = 'block';
        title.textContent = '💡 Generar Ideas Automáticamente';

        // Limpiar sección anterior
        document.getElementById('generated-ideas').innerHTML = '';

        panel.classList.add('active');
    }

    hideGenerateSection() {
        this.hideInfoPanel();
    }

    generateIdeas() {
        const area = document.getElementById('generate-area').value;
        const context = document.getElementById('generate-context').value.trim();
        
        const ideas = this.getIdeasForArea(area, context);
        this.displayGeneratedIdeas(ideas);
    }

    getIdeasForArea(area, context) {
        const ideasDatabase = {
            valores: [
                { name: "💎 Integridad", description: "Actuar siempre con honestidad y coherencia entre lo que pienso, digo y hago" },
                { name: "🌟 Excelencia", description: "Buscar la mejora continua en todo lo que emprendo" },
                { name: "🤝 Empatía", description: "Comprender y valorar las perspectivas y sentimientos de otros" },
                { name: "💪 Perseverancia", description: "Mantener el esfuerzo y la determinación ante los desafíos" },
                { name: "🙏 Gratitud", description: "Apreciar y reconocer las bendiciones y oportunidades en mi vida" }
            ],
            profesional: [
                { name: "🎓 Certificación Profesional", description: "Obtener certificaciones relevantes en mi campo de especialización" },
                { name: "💼 Liderazgo de Equipos", description: "Desarrollar habilidades para liderar y motivar equipos de trabajo" },
                { name: "🌐 Red de Contactos", description: "Construir una red sólida de contactos profesionales" },
                { name: "📊 Análisis de Datos", description: "Mejorar mis habilidades de análisis y interpretación de datos" },
                { name: "🗣️ Comunicación Efectiva", description: "Perfeccionar mis habilidades de presentación y comunicación" }
            ],
            bienestar: [
                { name: "🏃‍♂️ Rutina de Ejercicio", description: "Establecer y mantener una rutina de ejercicio regular" },
                { name: "🧘 Práctica de Mindfulness", description: "Incorporar la meditación y mindfulness en mi día a día" },
                { name: "🥗 Alimentación Consciente", description: "Adoptar hábitos alimenticios saludables y sostenibles" },
                { name: "😴 Higiene del Sueño", description: "Establecer rutinas para mejorar la calidad del descanso" },
                { name: "🌿 Conexión con la Naturaleza", description: "Pasar tiempo regular en espacios naturales" }
            ],
            financiero: [
                { name: "💰 Fondo de Emergencia", description: "Crear un fondo de emergencia de 6 meses de gastos" },
                { name: "📈 Portafolio de Inversiones", description: "Diversificar inversiones en diferentes instrumentos financieros" },
                { name: "📊 Presupuesto Mensual", description: "Implementar un sistema de presupuesto y seguimiento de gastos" },
                { name: "🏠 Inversión Inmobiliaria", description: "Explorar oportunidades de inversión en bienes raíces" },
                { name: "💡 Ingresos Pasivos", description: "Desarrollar fuentes de ingresos que no requieran tiempo activo" }
            ],
            relaciones: [
                { name: "❤️ Tiempo de Calidad Familiar", description: "Dedicar tiempo exclusivo y significativo con la familia" },
                { name: "🤗 Círculo de Amigos Cercanos", description: "Cultivar amistades profundas y significativas" },
                { name: "💑 Relación de Pareja Sólida", description: "Fortalecer la comunicación y conexión con mi pareja" },
                { name: "🌍 Contribución Comunitaria", description: "Participar activamente en mi comunidad local" },
                { name: "🎭 Actividades Sociales", description: "Participar en actividades que me conecten con otros" }
            ],
            educacion: [
                { name: "📚 Lectura Sistemática", description: "Leer al menos un libro por mes en mi área de interés" },
                { name: "🎓 Curso Online", description: "Completar cursos en línea para adquirir nuevas habilidades" },
                { name: "🏫 Educación Formal", description: "Considerar estudios de posgrado o especialización" },
                { name: "👨‍🏫 Mentorías", description: "Buscar mentores en áreas donde quiero crecer" },
                { name: "📝 Documentar Aprendizajes", description: "Llevar un diario de aprendizajes y reflexiones" }
            ],
            creatividad: [
                { name: "🎨 Proyecto Artístico", description: "Desarrollar un proyecto creativo personal" },
                { name: "✍️ Escritura Creativa", description: "Dedicar tiempo regular a la escritura creativa" },
                { name: "🎵 Aprender Instrumento", description: "Aprender a tocar un instrumento musical" },
                { name: "📸 Fotografía", description: "Explorar la fotografía como forma de expresión" },
                { name: "🍳 Cocina Experimental", description: "Experimentar con nuevos platos y técnicas culinarias" }
            ]
        };

        return ideasDatabase[area] || [];
    }

    displayGeneratedIdeas(ideas) {
        const container = document.getElementById('generated-ideas');
        container.innerHTML = '<h5>💡 Ideas generadas:</h5>';

        ideas.forEach((idea, index) => {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'idea-item';
            ideaElement.innerHTML = `
                <div class="idea-title">${idea.name}</div>
                <div class="idea-description">${idea.description}</div>
            `;
            
            ideaElement.addEventListener('click', () => {
                ideaElement.classList.toggle('selected');
            });

            container.appendChild(ideaElement);
        });

        // Agregar botones de acción
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ideas-actions';
        actionsDiv.innerHTML = `
            <button id="add-selected-ideas">➕ Agregar Seleccionadas</button>
            <button id="regenerate-ideas">🔄 Generar Más</button>
        `;

        container.appendChild(actionsDiv);

        // Event listeners para los botones
        document.getElementById('add-selected-ideas').addEventListener('click', () => {
            this.addSelectedIdeas();
        });

        document.getElementById('regenerate-ideas').addEventListener('click', () => {
            this.generateIdeas();
        });
    }

    addSelectedIdeas() {
        const selectedIdeas = document.querySelectorAll('.idea-item.selected');
        
        if (selectedIdeas.length === 0) {
            this.showNotification('❌ Selecciona al menos una idea', 'error');
            return;
        }

        // Encontrar un nodo padre apropiado (la raíz por defecto)
        let parentNode = this.root;
        
        selectedIdeas.forEach(ideaElement => {
            const title = ideaElement.querySelector('.idea-title').textContent;
            const description = ideaElement.querySelector('.idea-description').textContent;
            
            const newNodeData = {
                name: title,
                type: 'leaf',
                description: description,
                details: {
                    generated: true,
                    created: new Date().toLocaleDateString(),
                    status: 'Idea generada'
                }
            };

            // Agregar al árbol
            if (!parentNode.data.children) {
                parentNode.data.children = [];
            }
            parentNode.data.children.push(newNodeData);
        });

        // Actualizar estructura
        this.root = d3.hierarchy(treeData);
        this.root.x0 = treeConfig.width / 2;
        this.root.y0 = 0;

        this.update(this.root);
        this.hideGenerateSection();
        this.showNotification(`✅ ${selectedIdeas.length} ideas agregadas al árbol`, 'success');
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-family: 'Gluten', cursive;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(300px);
            transition: all 0.3s ease;
        `;

        // Colores según el tipo
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del árbol de decisiones
    const decisionTree = new DecisionTree();
    
    // Hacer disponible globalmente para debugging
    window.decisionTree = decisionTree;
    
    console.log('🌳 Árbol de Decisiones Interactivo cargado correctamente');
});