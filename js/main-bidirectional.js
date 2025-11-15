// ===== ÁRBOL BIDIRECCIONAL PROYECTO DE VIDA =====
// Implementación con estructura de reloj de arena: Raíces ← Tronco → Ramas

class BiDirectionalTree {
    constructor() {
        this.svg = null;
        this.g = null;
        this.trunkNode = null;
        this.rootsGroup = null;
        this.branchesGroup = null;
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
        this.setupEventListeners();
        this.createTooltip();
        this.processData();
        this.render();
    }

    setupSVG() {
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

        // Centrar inicialmente en el tronco
        const initialTransform = d3.zoomIdentity
            .translate(treeConfig.width / 2, treeConfig.height / 2)
            .scale(0.7);
        
        this.svg.call(zoom.transform, initialTransform);
    }

    processData() {
        // Crear nodo del tronco en el centro
        this.trunkNode = {
            ...treeData.trunk,
            x: 0,
            y: 0,
            id: 'trunk'
        };

        // Procesar raíces (hacia abajo)
        this.rootsNodes = this.processNodes(treeData.roots, 'roots', 1, -1);
        
        // Procesar ramas (hacia arriba)
        this.branchesNodes = this.processNodes(treeData.branches, 'branches', 1, 1);
    }

    processNodes(nodes, parentType, level, direction) {
        const processedNodes = [];
        const angleStep = (Math.PI * 1.4) / Math.max(nodes.length, 1);
        const startAngle = -Math.PI * 0.7;

        nodes.forEach((node, index) => {
            const angle = startAngle + (angleStep * index);
            const distance = 180 * level;
            
            const processedNode = {
                ...node,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance * direction,
                id: `${parentType}_${level}_${index}`,
                level: level,
                direction: direction,
                angle: angle
            };

            // Procesar hijos recursivamente
            if (node.children) {
                processedNode.children = this.processChildNodes(
                    node.children, 
                    processedNode, 
                    level + 1, 
                    direction
                );
            }

            processedNodes.push(processedNode);
        });

        return processedNodes;
    }

    processChildNodes(children, parent, level, direction) {
        const processedChildren = [];
        const childAngleSpread = Math.PI / 4; // 45 grados de extensión
        const angleStep = childAngleSpread / Math.max(children.length - 1, 1);
        const startAngle = parent.angle - childAngleSpread / 2;

        children.forEach((child, index) => {
            const angle = startAngle + (angleStep * index);
            const distance = 120;
            
            const processedChild = {
                ...child,
                x: parent.x + Math.cos(angle) * distance,
                y: parent.y + Math.sin(angle) * distance,
                id: `${parent.id}_child_${index}`,
                level: level,
                direction: direction,
                parent: parent
            };

            processedChildren.push(processedChild);
        });

        return processedChildren;
    }

    render() {
        this.renderTrunk();
        this.renderRoots();
        this.renderBranches();
    }

    renderTrunk() {
        // Renderizar el tronco central
        const trunkGroup = this.g.selectAll('.trunk-group')
            .data([this.trunkNode])
            .enter()
            .append('g')
            .attr('class', 'trunk-group node trunk');

        // Círculo del tronco
        trunkGroup.append('circle')
            .attr('r', treeConfig.nodeRadius * 1.5)
            .style('fill', treeConfig.colors.trunk)
            .style('stroke', 'white')
            .style('stroke-width', 4)
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());

        // Icono del tronco
        trunkGroup.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-40px')
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text('🌳');

        // Texto del tronco
        trunkGroup.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d => {
                const name = d.name.replace(/🌳/g, '').trim();
                return name.length > 20 ? name.substring(0, 20) + '...' : name;
            });

        // Posicionar el tronco
        trunkGroup.attr('transform', `translate(0, 0)`);
    }

    renderRoots() {
        this.renderNodeGroup(this.rootsNodes, 'roots-group', 'roots');
    }

    renderBranches() {
        this.renderNodeGroup(this.branchesNodes, 'branches-group', 'branches');
    }

    renderNodeGroup(nodes, groupClass, nodeClass) {
        // Crear enlaces primero
        this.renderLinks(nodes, nodeClass);
        
        // Crear nodos
        const nodeGroups = this.g.selectAll(`.${groupClass}`)
            .data(this.flattenNodes(nodes))
            .enter()
            .append('g')
            .attr('class', d => `${groupClass} node ${d.type}`)
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Círculos
        nodeGroups.append('circle')
            .attr('r', d => d.children ? treeConfig.nodeRadius : treeConfig.nodeRadius * 0.8)
            .style('fill', d => this.getNodeColor(d))
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());

        // Iconos
        nodeGroups.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-25px')
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text(d => getNodeIcon(d.type, d.name));

        // Texto
        nodeGroups.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', '500')
            .text(d => {
                const name = d.name.replace(/[🌱🌿🍃💎💫🔮📋💼❤️💰🎓🤝💪🧘📊🌟🎯🌍]/g, '').trim();
                return name.length > 15 ? name.substring(0, 15) + '...' : name;
            });
    }

    renderLinks(nodes, nodeClass) {
        const links = this.generateLinks(nodes);
        
        this.g.selectAll(`.link-${nodeClass}`)
            .data(links)
            .enter()
            .append('path')
            .attr('class', `link link-${nodeClass}`)
            .attr('d', d => this.createCurvedPath(d.source, d.target))
            .style('fill', 'none')
            .style('stroke', d => this.getLinkColor(d.source))
            .style('stroke-width', 2)
            .style('stroke-opacity', 0.6);
    }

    generateLinks(nodes) {
        const links = [];
        
        nodes.forEach(node => {
            // Enlace desde el tronco a la raíz/rama principal
            links.push({
                source: this.trunkNode,
                target: node
            });

            // Enlaces a los hijos
            if (node.children) {
                node.children.forEach(child => {
                    links.push({
                        source: node,
                        target: child
                    });
                });
            }
        });

        return links;
    }

    createCurvedPath(source, target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.5;
        
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
    }

    flattenNodes(nodes) {
        const flattened = [];
        
        nodes.forEach(node => {
            flattened.push(node);
            if (node.children) {
                flattened.push(...node.children);
            }
        });

        return flattened;
    }

    getNodeColor(d) {
        if (d === this.selectedParentNode) return '#28a745';
        if (d === this.currentActiveNode) return treeConfig.colors.active;
        return treeConfig.colors[d.type] || treeConfig.colors.branch;
    }

    getLinkColor(source) {
        return treeConfig.colors[source.type] || '#999';
    }

    // ===== EVENT HANDLERS =====
    setupEventListeners() {
        // Botones principales
        document.getElementById('expandAll').addEventListener('click', () => {
            this.showAllNodes();
        });

        document.getElementById('collapseAll').addEventListener('click', () => {
            this.hideChildNodes();
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
    }

    handleNodeClick(event, d) {
        if (this.isCreateMode) {
            this.selectParentForCreation(d);
        } else if (this.isEditMode) {
            this.editNode(d);
        } else {
            this.currentActiveNode = d;
            this.showNodeInfo(d);
            this.updateActiveNode();
        }
    }

    showNodeInfo(d) {
        // Implementar panel de información similar al anterior
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');

        title.textContent = d.name;
        description.textContent = d.description;

        // Limpiar detalles anteriores
        details.innerHTML = '';

        if (d.details) {
            Object.entries(d.details).forEach(([key, value]) => {
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

        panel.classList.add('active');
    }

    hideInfoPanel() {
        document.getElementById('info-panel').classList.remove('active');
        this.currentActiveNode = null;
        this.updateActiveNode();
    }

    updateActiveNode() {
        // Actualizar estilos visuales de nodos activos
        this.g.selectAll('.node circle')
            .style('fill', d => this.getNodeColor(d));
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const button = document.getElementById('editMode');
        const addButton = document.getElementById('addNode');
        const generateButton = document.getElementById('generateIdeas');
        
        if (this.isEditMode) {
            button.textContent = '👁️ Modo Vista';
            button.style.background = '#FF6B6B';
            addButton.style.display = 'inline-block';
            generateButton.style.display = 'inline-block';
        } else {
            button.textContent = '✏️ Modo Edición';
            button.style.background = '';
            addButton.style.display = 'none';
            generateButton.style.display = 'none';
            this.hideInfoPanel();
        }
    }

    centerTree() {
        const zoom = d3.zoom();
        const transform = d3.zoomIdentity
            .translate(treeConfig.width / 2, treeConfig.height / 2)
            .scale(0.7);
        
        this.svg.transition()
            .duration(750)
            .call(zoom.transform, transform);
    }

    showAllNodes() {
        // Mostrar todos los nodos
        this.g.selectAll('.node')
            .style('opacity', 1);
        this.g.selectAll('.link')
            .style('opacity', 1);
    }

    hideChildNodes() {
        // Ocultar nodos hijos (mantener solo principales)
        this.g.selectAll('.node')
            .style('opacity', d => d.level <= 1 || d.id === 'trunk' ? 1 : 0.3);
        this.g.selectAll('.link')
            .style('opacity', 0.3);
    }

    // Tooltip functions
    createTooltip() {
        this.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");
    }

    showTooltip(event, d) {
        this.tooltip.style("visibility", "visible")
            .html(`<strong>${d.name}</strong><br>${d.description}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    }

    hideTooltip() {
        this.tooltip.style("visibility", "hidden");
    }

    formatLabel(key) {
        const labels = {
            objective: '🎯 Objetivo',
            vision: '🔮 Visión',
            mission: '💫 Misión',
            timeline: '⏰ Tiempo',
            valores: '💎 Valores',
            principios: '📋 Principios',
            areas: '🎯 Áreas',
            estrategias: '📋 Estrategias'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    // Funciones de edición y creación (simplificadas por espacio)
    editNode(d) {
        console.log('Editando nodo:', d.name);
    }

    startCreateMode() {
        console.log('Iniciando modo creación');
    }

    showGenerateSection() {
        console.log('Mostrando generador de ideas');
    }

    saveTreeData() {
        console.log('Guardando árbol');
    }

    // Funciones auxiliares
    cancelNodeEdit() { this.hideInfoPanel(); }
    cancelCreateMode() { this.hideInfoPanel(); }
    selectParentForCreation(d) { console.log('Padre seleccionado:', d.name); }
    saveNodeEdit() { console.log('Guardando edición'); }
    deleteNode() { console.log('Eliminando nodo'); }
    createNewNode() { console.log('Creando nodo'); }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    const biDirectionalTree = new BiDirectionalTree();
    window.biDirectionalTree = biDirectionalTree;
    console.log('🌳 Árbol Bidireccional Proyecto de Vida cargado correctamente');
});