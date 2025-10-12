// ===== ÁRBOL ORGÁNICO REAL CON EDICIÓN COMPLETA =====
// Estructura vertical con tronco alargado y funcionalidad completa

class EditableOrganicTree {
    constructor() {
        this.svg = null;
        this.g = null;
        this.trunkNode = null;
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
        
        // Cargar datos guardados si existen
        this.loadFromLocalStorage();
        
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

        // Centrar inicialmente
        const initialTransform = d3.zoomIdentity
            .translate(treeConfig.width / 2, treeConfig.height / 2)
            .scale(0.7);
        
        this.svg.call(zoom.transform, initialTransform);
    }

    processData() {
        // TRONCO en el centro (Y = 0) - Ahora será alargado verticalmente
        this.trunkNode = {
            ...treeData.trunk,
            x: 0,
            y: 0,
            id: 'trunk',
            level: 0
        };

        // RAÍCES hacia abajo (Y positivo)
        this.rootsNodes = this.processRoots(treeData.roots);
        
        // RAMAS hacia arriba (Y negativo)  
        this.branchesNodes = this.processBranches(treeData.branches);
    }

    processRoots(rootsData) {
        const processedRoots = [];
        const rootSpacing = 160;
        const startX = -(rootsData.length - 1) * rootSpacing / 2;

        rootsData.forEach((root, index) => {
            const rootX = startX + (index * rootSpacing);
            const rootY = 140; // Distancia del tronco hacia abajo

            const processedRoot = {
                ...root,
                x: rootX,
                y: rootY,
                id: `root_${index}`,
                level: 1,
                direction: 'down'
            };

            // Procesar raíces secundarias
            if (root.children) {
                processedRoot.children = this.processRootChildren(
                    root.children, 
                    rootX, 
                    rootY, 
                    index
                );
            }

            processedRoots.push(processedRoot);
        });

        return processedRoots;
    }

    processRootChildren(children, parentX, parentY, parentIndex) {
        const processedChildren = [];
        const childSpacing = 100;
        const startX = parentX - (children.length - 1) * childSpacing / 2;
        const childY = parentY + 120;

        children.forEach((child, index) => {
            const childX = startX + (index * childSpacing);
            
            const processedChild = {
                ...child,
                x: childX,
                y: childY,
                id: `root_${parentIndex}_child_${index}`,
                level: 2,
                direction: 'down',
                parentX: parentX,
                parentY: parentY
            };

            processedChildren.push(processedChild);
        });

        return processedChildren;
    }

    processBranches(branchesData) {
        const processedBranches = [];
        const branchSpacing = 140;
        const startX = -(branchesData.length - 1) * branchSpacing / 2;

        branchesData.forEach((branch, index) => {
            const branchX = startX + (index * branchSpacing);
            const branchY = -140; // Distancia del tronco hacia arriba

            const processedBranch = {
                ...branch,
                x: branchX,
                y: branchY,
                id: `branch_${index}`,
                level: 1,
                direction: 'up'
            };

            // Procesar hojas
            if (branch.children) {
                processedBranch.children = this.processBranchChildren(
                    branch.children,
                    branchX,
                    branchY,
                    index
                );
            }

            processedBranches.push(processedBranch);
        });

        return processedBranches;
    }

    processBranchChildren(children, parentX, parentY, parentIndex) {
        const processedChildren = [];
        const childSpacing = 90;
        const startX = parentX - (children.length - 1) * childSpacing / 2;
        const childY = parentY - 100;

        children.forEach((child, index) => {
            const childX = startX + (index * childSpacing);
            
            const processedChild = {
                ...child,
                x: childX,
                y: childY,
                id: `branch_${parentIndex}_child_${index}`,
                level: 2,
                direction: 'up',
                parentX: parentX,
                parentY: parentY
            };

            processedChildren.push(processedChild);
        });

        return processedChildren;
    }

    render() {
        // Renderizar fondo sutil
        this.renderSubtleBackground();
        
        // Renderizar conexiones
        this.renderConnections();
        
        // Renderizar nodos
        this.renderTrunk();
        this.renderRoots();
        this.renderBranches();
    }

    renderSubtleBackground() {
        // Fondo sutil menos evidente
        const gradient = this.svg.append("defs")
            .append("radialGradient")
            .attr("id", "treeGradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#f8f9fa")
            .attr("stop-opacity", 0.8);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#e9ecef")
            .attr("stop-opacity", 0.3);

        this.g.append('rect')
            .attr('x', -treeConfig.width/2)
            .attr('y', -treeConfig.height/2)
            .attr('width', treeConfig.width)
            .attr('height', treeConfig.height)
            .attr('fill', 'url(#treeGradient)')
            .attr('rx', 20);
    }

    renderConnections() {
        // Conexiones de raíces
        this.rootsNodes.forEach(root => {
            this.g.append('path')
                .attr('d', this.createOrganicPath(this.trunkNode, root))
                .attr('class', 'root-connection')
                .style('stroke', '#8D6E63')
                .style('stroke-width', 6)
                .style('fill', 'none')
                .style('opacity', 0.7);

            if (root.children) {
                root.children.forEach(child => {
                    this.g.append('path')
                        .attr('d', this.createOrganicPath(root, child))
                        .attr('class', 'deep-root-connection')
                        .style('stroke', '#6D4C41')
                        .style('stroke-width', 3)
                        .style('fill', 'none')
                        .style('opacity', 0.6);
                });
            }
        });

        // Conexiones de ramas
        this.branchesNodes.forEach(branch => {
            this.g.append('path')
                .attr('d', this.createOrganicPath(this.trunkNode, branch))
                .attr('class', 'branch-connection')
                .style('stroke', '#8D6E63')
                .style('stroke-width', 6)
                .style('fill', 'none')
                .style('opacity', 0.7);

            if (branch.children) {
                branch.children.forEach(child => {
                    this.g.append('path')
                        .attr('d', this.createOrganicPath(branch, child))
                        .attr('class', 'leaf-connection')
                        .style('stroke', '#4CAF50')
                        .style('stroke-width', 3)
                        .style('fill', 'none')
                        .style('opacity', 0.6);
                });
            }
        });
    }

    createOrganicPath(source, target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        
        // Crear curva más natural
        const controlX1 = source.x + dx * 0.2;
        const controlY1 = source.y + dy * 0.1;
        const controlX2 = source.x + dx * 0.8;
        const controlY2 = source.y + dy * 0.9;
        
        return `M ${source.x},${source.y} 
                C ${controlX1},${controlY1} ${controlX2},${controlY2} 
                ${target.x},${target.y}`;
    }

    renderTrunk() {
        const trunkGroup = this.g.append('g')
            .attr('class', 'trunk-group node trunk')
            .attr('transform', `translate(${this.trunkNode.x}, ${this.trunkNode.y})`);

        // TRONCO ALARGADO VERTICAL (no circular)
        trunkGroup.append('ellipse')
            .attr('rx', 25) // Ancho
            .attr('ry', 60) // Alto - más alargado
            .style('fill', treeConfig.colors.trunk)
            .style('stroke', '#5D4037')
            .style('stroke-width', 4)
            .style('cursor', 'pointer')
            .on('click', (event) => this.handleNodeClick(event, this.trunkNode))
            .on('mouseover', (event) => this.showTooltip(event, this.trunkNode))
            .on('mouseout', () => this.hideTooltip());

        // Textura del tronco
        trunkGroup.append('ellipse')
            .attr('rx', 22)
            .attr('ry', 57)
            .style('fill', 'none')
            .style('stroke', '#4A2C2A')
            .style('stroke-width', 1)
            .style('opacity', 0.6);

        // Icono del tronco
        trunkGroup.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-70px')
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text('🌳');

        // Texto del tronco
        trunkGroup.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('OBJETIVO');
    }

    renderRoots() {
        this.rootsNodes.forEach(root => {
            this.renderEditableNode(root, 'roots-main');
            
            if (root.children) {
                root.children.forEach(child => {
                    this.renderEditableNode(child, 'roots-deep');
                });
            }
        });
    }

    renderBranches() {
        this.branchesNodes.forEach(branch => {
            this.renderEditableNode(branch, 'branches-main');
            
            if (branch.children) {
                branch.children.forEach(child => {
                    this.renderEditableNode(child, 'branches-leaf');
                });
            }
        });
    }

    renderEditableNode(nodeData, cssClass) {
        const nodeGroup = this.g.append('g')
            .attr('class', `node ${nodeData.type} ${cssClass}`)
            .attr('transform', `translate(${nodeData.x}, ${nodeData.y})`)
            .style('cursor', 'pointer');

        // Círculo del nodo con indicadores de edición
        const radius = nodeData.level === 1 ? 
            treeConfig.nodeRadius * 1.1 : 
            treeConfig.nodeRadius * 0.8;

        const circle = nodeGroup.append('circle')
            .attr('r', radius)
            .style('fill', this.getNodeColor(nodeData))
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .on('click', (event) => this.handleNodeClick(event, nodeData))
            .on('mouseover', (event) => this.showTooltip(event, nodeData))
            .on('mouseout', () => this.hideTooltip());

        // Indicador de edición cuando está en modo edición
        if (this.isEditMode) {
            nodeGroup.append('circle')
                .attr('r', radius + 5)
                .style('fill', 'none')
                .style('stroke', '#FFD700')
                .style('stroke-width', 2)
                .style('stroke-dasharray', '5,5')
                .style('opacity', 0.8)
                .attr('class', 'edit-indicator');
        }

        // Icono del nodo
        nodeGroup.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-25px')
            .attr('text-anchor', 'middle')
            .style('font-size', nodeData.level === 1 ? '18px' : '14px')
            .text(getNodeIcon(nodeData.type, nodeData.name));

        // Texto del nodo
        nodeGroup.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', nodeData.level === 1 ? '10px' : '8px')
            .style('font-weight', '500')
            .style('fill', 'white')
            .text(this.getShortName(nodeData.name));
    }

    getShortName(name) {
        const cleanName = name.replace(/[🌱🌿🍃💎💫🔮📋💼❤️💰🎓🤝💪🧘📊🌟🎯🌍]/g, '').trim();
        return cleanName.length > 10 ? cleanName.substring(0, 10) + '...' : cleanName;
    }

    getNodeColor(d) {
        if (d === this.selectedParentNode) return '#28a745';
        if (d === this.currentActiveNode) return treeConfig.colors.active;
        return treeConfig.colors[d.type] || treeConfig.colors.branch;
    }

    // ===== FUNCIONALIDADES DE EDICIÓN COMPLETA =====
    setupEventListeners() {
        // Botones principales
        document.getElementById('expandAll').addEventListener('click', () => {
            this.showAllNodes();
        });

        document.getElementById('collapseAll').addEventListener('click', () => {
            this.hideSecondaryNodes();
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

    // ===== FUNCIONES DE EDICIÓN =====
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.isCreateMode = false;
        
        const button = document.getElementById('editMode');
        const addButton = document.getElementById('addNode');
        const generateButton = document.getElementById('generateIdeas');
        
        if (this.isEditMode) {
            button.textContent = '👁️ Modo Vista';
            button.style.background = '#FF6B6B';
            addButton.style.display = 'inline-block';
            generateButton.style.display = 'inline-block';
            this.showEditIndicators();
        } else {
            button.textContent = '✏️ Modo Edición';
            button.style.background = '';
            addButton.style.display = 'none';
            generateButton.style.display = 'none';
            this.hideEditIndicators();
            this.hideInfoPanel();
        }
    }

    showEditIndicators() {
        // Agregar indicadores visuales de que los nodos son editables
        this.g.selectAll('.node')
            .append('circle')
            .attr('r', d => d.level === 1 ? 38 : 30)
            .style('fill', 'none')
            .style('stroke', '#FFD700')
            .style('stroke-width', 2)
            .style('stroke-dasharray', '5,5')
            .style('opacity', 0.8)
            .attr('class', 'edit-indicator');
    }

    hideEditIndicators() {
        this.g.selectAll('.edit-indicator').remove();
    }

    editNode(d) {
        this.editingNode = d;
        this.currentActiveNode = d;
        this.showNodeEditForm(d);
        this.updateActiveNode();
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
        title.textContent = '✏️ Editando: ' + d.name;

        // Llenar formulario con datos actuales
        document.getElementById('edit-name').value = d.name || '';
        document.getElementById('edit-description').value = d.description || '';
        document.getElementById('edit-type').value = d.type || 'leaf';

        panel.classList.add('active');
    }

    saveNodeEdit() {
        if (!this.editingNode) return;

        const name = document.getElementById('edit-name').value.trim();
        const description = document.getElementById('edit-description').value.trim();
        const type = document.getElementById('edit-type').value;

        if (!name) {
            this.showNotification('❌ El nombre del nodo es obligatorio', 'error');
            return;
        }

        // Actualizar datos del nodo
        this.editingNode.name = name;
        this.editingNode.description = description;
        this.editingNode.type = type;

        // Re-renderizar
        this.refresh();
        this.hideInfoPanel();
        this.showNotification('✅ Nodo actualizado correctamente', 'success');
    }

    // ===== FUNCIONES DE EDICIÓN COMPLETAS =====
    cancelNodeEdit() { 
        this.hideInfoPanel();
        this.editingNode = null;
    }

    deleteNode() { 
        if (!this.editingNode) return;
        
        if (confirm(`¿Eliminar "${this.editingNode.name}"?\n\nEsta acción no se puede deshacer.`)) {
            // Eliminar de la estructura de datos
            this.removeNodeFromData(this.editingNode);
            
            // Re-renderizar
            this.refresh();
            this.hideInfoPanel();
            this.showNotification('🗑️ Nodo eliminado correctamente', 'warning');
            
            // Guardar cambios
            this.saveToLocalStorage();
        }
    }

    removeNodeFromData(nodeToRemove) {
        // Buscar y eliminar en raíces
        this.rootsNodes = this.rootsNodes.filter(root => {
            if (root.id === nodeToRemove.id) return false;
            if (root.children) {
                root.children = root.children.filter(child => child.id !== nodeToRemove.id);
            }
            return true;
        });

        // Buscar y eliminar en ramas
        this.branchesNodes = this.branchesNodes.filter(branch => {
            if (branch.id === nodeToRemove.id) return false;
            if (branch.children) {
                branch.children = branch.children.filter(child => child.id !== nodeToRemove.id);
            }
            return true;
        });

        // Actualizar datos originales
        this.updateOriginalData();
    }

    // ===== MODO CREACIÓN COMPLETO =====
    startCreateMode() { 
        this.isCreateMode = true;
        this.isEditMode = false;
        this.selectedParentNode = null;
        
        // Cambiar aspecto visual
        const button = document.getElementById('addNode');
        button.textContent = '❌ Cancelar Creación';
        button.style.background = '#dc3545';
        
        // Mostrar indicadores visuales
        this.showCreationIndicators();
        this.showNotification('👆 Selecciona un nodo padre donde agregar', 'info');
    }

    showCreationIndicators() {
        this.g.selectAll('.node')
            .append('circle')
            .attr('r', d => (d.level === 1 ? 38 : 30))
            .style('fill', 'none')
            .style('stroke', '#28a745')
            .style('stroke-width', 2)
            .style('stroke-dasharray', '5,5')
            .style('opacity', 0.8)
            .attr('class', 'creation-indicator');
    }

    hideCreationIndicators() {
        this.g.selectAll('.creation-indicator').remove();
    }

    cancelCreateMode() { 
        this.isCreateMode = false;
        this.selectedParentNode = null;
        
        // Restaurar botón
        const button = document.getElementById('addNode');
        button.textContent = '➕ Agregar Nodo';
        button.style.background = '';
        
        this.hideCreationIndicators();
        this.hideInfoPanel();
        this.showNotification('❌ Creación cancelada', 'warning');
    }

    selectParentForCreation(d) { 
        this.selectedParentNode = d;
        this.showCreateNodeForm(d);
        this.updateActiveNode();
        this.showNotification(`✅ Padre seleccionado: ${d.name}`, 'success');
    }

    showCreateNodeForm(parentNode) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const createSection = document.getElementById('create-section');

        // Ocultar otras secciones
        description.style.display = 'none';
        details.style.display = 'none';
        document.getElementById('edit-section').style.display = 'none';
        document.getElementById('generate-section').style.display = 'none';

        // Mostrar sección de creación
        createSection.style.display = 'block';

        // Actualizar título
        title.textContent = '➕ Crear Nuevo Nodo';

        // Llenar información del padre
        document.getElementById('create-parent').value = parentNode.name;

        // Limpiar campos anteriores
        document.getElementById('create-name').value = '';
        document.getElementById('create-description').value = '';

        // Determinar tipos permitidos según el padre
        const typeSelect = document.getElementById('create-type');
        typeSelect.innerHTML = '';
        
        if (parentNode.id === 'trunk') {
            typeSelect.innerHTML = `
                <option value="roots">🌱 Raíces (Valores/Fundamentos)</option>
                <option value="branch">🌿 Rama (Resultado/Logro)</option>
            `;
        } else if (parentNode.direction === 'down') {
            typeSelect.innerHTML = `<option value="deep_roots">🌰 Raíz Profunda</option>`;
        } else if (parentNode.direction === 'up') {
            typeSelect.innerHTML = `<option value="leaf">🍃 Hoja (Acción Específica)</option>`;
        }

        // Agregar validación en tiempo real
        this.setupCreateFormValidation();

        panel.classList.add('active');
    }

    createNewNode() { 
        if (!this.selectedParentNode) {
            this.showNotification('❌ Primero selecciona un nodo padre', 'error');
            return;
        }

        const name = document.getElementById('create-name').value.trim();
        const description = document.getElementById('create-description').value.trim();
        const type = document.getElementById('create-type').value;

        // Validación mejorada del nombre
        if (!name || name.length < 2) {
            this.showNotification('❌ El nombre debe tener al menos 2 caracteres', 'error');
            document.getElementById('create-name').focus();
            return;
        }

        if (name.length > 50) {
            this.showNotification('❌ El nombre es demasiado largo (máximo 50 caracteres)', 'error');
            document.getElementById('create-name').focus();
            return;
        }

        // Descripción es opcional, pero si se incluye debe ser válida
        if (description && description.length < 10) {
            this.showNotification('⚠️ La descripción debería tener al menos 10 caracteres para ser útil', 'warning');
            // No bloquear, solo advertir
        }

        // Crear nuevo nodo
        const newNode = {
            name: name,
            description: description,
            type: type,
            id: `new_${Date.now()}`,
            level: this.selectedParentNode.level + 1,
            direction: this.selectedParentNode.direction || (type === 'roots' || type === 'deep_roots' ? 'down' : 'up')
        };

        // Agregar a la estructura
        this.addNodeToParent(this.selectedParentNode, newNode);

        // Re-procesar datos y renderizar
        this.processData();
        this.refresh();

        // Salir del modo creación
        this.cancelCreateMode();
        
        this.showNotification(`✅ "${name}" creado correctamente`, 'success');
        
        // Guardar cambios
        this.saveToLocalStorage();
    }

    setupCreateFormValidation() {
        const nameInput = document.getElementById('create-name');
        const descriptionInput = document.getElementById('create-description');
        const createButton = document.getElementById('create-node');

        // Validación en tiempo real del nombre
        nameInput.addEventListener('input', () => {
            const value = nameInput.value.trim();
            const isValid = value.length >= 2 && value.length <= 50;
            
            if (value.length === 0) {
                nameInput.style.borderColor = '#dc3545';
                nameInput.title = 'El nombre es obligatorio';
                createButton.disabled = true;
            } else if (value.length < 2) {
                nameInput.style.borderColor = '#ffc107';
                nameInput.title = 'Mínimo 2 caracteres';
                createButton.disabled = true;
            } else if (value.length > 50) {
                nameInput.style.borderColor = '#dc3545';
                nameInput.title = 'Máximo 50 caracteres';
                createButton.disabled = true;
            } else {
                nameInput.style.borderColor = '#28a745';
                nameInput.title = 'Nombre válido';
                createButton.disabled = false;
            }
        });

        // Validación de descripción (opcional pero útil)
        descriptionInput.addEventListener('input', () => {
            const value = descriptionInput.value.trim();
            
            if (value.length === 0) {
                descriptionInput.style.borderColor = '#6c757d';
                descriptionInput.title = 'Descripción opcional';
            } else if (value.length < 10) {
                descriptionInput.style.borderColor = '#ffc107';
                descriptionInput.title = 'Recomendado: al menos 10 caracteres';
            } else {
                descriptionInput.style.borderColor = '#28a745';
                descriptionInput.title = 'Descripción útil';
            }
        });

        // Estado inicial
        createButton.disabled = true;
        nameInput.focus();
    }

    addNodeToParent(parentNode, newNode) {
        // Si es el tronco
        if (parentNode.id === 'trunk') {
            if (newNode.type === 'roots' || newNode.type === 'deep_roots') {
                if (!treeData.roots) treeData.roots = [];
                treeData.roots.push(newNode);
            } else {
                if (!treeData.branches) treeData.branches = [];
                treeData.branches.push(newNode);
            }
        } else {
            // Es un nodo hijo
            if (!parentNode.children) parentNode.children = [];
            parentNode.children.push(newNode);
        }
        
        this.updateOriginalData();
    }

    // ===== GENERADOR DE IDEAS COMPLETO =====
    showGenerateSection() { 
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');
        const generateSection = document.getElementById('generate-section');

        // Ocultar otras secciones
        description.style.display = 'none';
        details.style.display = 'none';
        document.getElementById('edit-section').style.display = 'none';
        document.getElementById('create-section').style.display = 'none';

        // Mostrar sección de generación
        generateSection.style.display = 'block';
        title.textContent = '💡 Generador de Ideas Inteligente';

        panel.classList.add('active');
        this.showNotification('💡 Generador de ideas activado', 'info');
    }

    hideGenerateSection() { 
        document.getElementById('generate-section').style.display = 'none';
        document.getElementById('generated-ideas').innerHTML = '';
        this.hideInfoPanel();
    }

    generateIdeas() { 
        const area = document.getElementById('generate-area').value;
        const context = document.getElementById('generate-context').value.trim();
        
        this.showNotification('⏳ Generando ideas...', 'info');
        
        // Simular generación de ideas (reemplazar con IA real más tarde)
        setTimeout(() => {
            const ideas = this.getIdeasForArea(area, context);
            this.displayGeneratedIdeas(ideas);
            this.showNotification('✨ Ideas generadas correctamente', 'success');
        }, 1500);
    }

    getIdeasForArea(area, context) {
        const ideasDatabase = {
            valores: [
                { title: "🤝 Integridad Personal", description: "Actuar con honestidad y coherencia en todas mis decisiones y relaciones." },
                { title: "🌱 Crecimiento Continuo", description: "Comprometerme con el aprendizaje permanente y la mejora constante." },
                { title: "❤️ Empatía y Compasión", description: "Desarrollar la capacidad de entender y ayudar a otros en sus necesidades." },
                { title: "🎯 Responsabilidad Social", description: "Contribuir positivamente a mi comunidad y sociedad." },
                { title: "⚖️ Equilibrio Vida-Trabajo", description: "Mantener armonía entre mis metas profesionales y bienestar personal." }
            ],
            profesional: [
                { title: "🎓 Especialización Técnica", description: "Dominar habilidades específicas en mi área de expertise profesional." },
                { title: "👥 Liderazgo de Equipos", description: "Desarrollar capacidades para guiar, motivar y coordinar grupos de trabajo." },
                { title: "💼 Emprendimiento", description: "Crear un proyecto empresarial propio que genere valor e impacto." },
                { title: "🌐 Networking Estratégico", description: "Construir una red sólida de contactos profesionales y mentores." },
                { title: "📊 Gestión de Proyectos", description: "Adquirir competencias para planificar, ejecutar y controlar proyectos complejos." }
            ],
            bienestar: [
                { title: "🏃‍♂️ Salud Física Integral", description: "Mantener rutina de ejercicio, alimentación balanceada y chequeos médicos regulares." },
                { title: "🧘‍♀️ Bienestar Mental", description: "Practicar mindfulness, gestión del estrés y cuidado de la salud emocional." },
                { title: "😴 Descanso Reparador", description: "Establecer hábitos de sueño saludables y rutinas de relajación." },
                { title: "🎨 Hobbies Creativos", description: "Dedicar tiempo a actividades que nutran mi creatividad y pasión personal." },
                { title: "🌿 Conexión con la Naturaleza", description: "Pasar tiempo al aire libre y cultivar una relación armónica con el entorno." }
            ],
            financiero: [
                { title: "💰 Fondo de Emergencia", description: "Crear un fondo que cubra 6-12 meses de gastos básicos para imprevistos." },
                { title: "📈 Inversiones Diversificadas", description: "Desarrollar un portafolio de inversiones balanceado para el crecimiento a largo plazo." },
                { title: "🏠 Patrimonio Inmobiliario", description: "Adquirir propiedades que generen valor y estabilidad financiera." },
                { title: "📚 Educación Financiera", description: "Aprender sobre finanzas personales, inversiones y planificación fiscal." },
                { title: "💳 Libertad de Deudas", description: "Eliminar deudas de consumo y mantener un perfil crediticio saludable." }
            ],
            relaciones: [
                { title: "👨‍👩‍👧‍👦 Vínculos Familiares", description: "Fortalecer las relaciones con familia y crear tradiciones significativas." },
                { title: "🤝 Amistades Profundas", description: "Cultivar amistades auténticas basadas en confianza mutua y apoyo." },
                { title: "💕 Relación de Pareja", description: "Construir una relación romántica sólida basada en comunicación y crecimiento mutuo." },
                { title: "🌍 Comunidad Local", description: "Participar activamente en mi comunidad y crear redes de apoyo social." },
                { title: "🎭 Habilidades Sociales", description: "Mejorar mi comunicación, escucha activa y inteligencia emocional." }
            ],
            educacion: [
                { title: "🎓 Título Universitario", description: "Completar estudios superiores en el área de mi interés profesional." },
                { title: "🌐 Idiomas Extranjeros", description: "Dominar al menos dos idiomas adicionales para ampliar oportunidades globales." },
                { title: "💻 Competencias Digitales", description: "Mantenerse actualizado en tecnologías emergentes y herramientas digitales." },
                { title: "📚 Lectura Sistemática", description: "Establecer un plan de lectura regular que amplíe mi conocimiento y perspectiva." },
                { title: "🎤 Oratoria Pública", description: "Desarrollar habilidades de comunicación y presentación en público." }
            ],
            creatividad: [
                { title: "🎨 Expresión Artística", description: "Explorar diferentes formas de arte como pintura, música, escritura o fotografía." },
                { title: "🔧 Proyectos DIY", description: "Crear objetos útiles y decorativos con mis propias manos y creatividad." },
                { title: "📝 Escritura Creativa", description: "Desarrollar habilidades narrativas a través de cuentos, poesía o blogs personales." },
                { title: "🎭 Artes Escénicas", description: "Participar en teatro, danza o música para explorar mi expresión corporal." },
                { title: "💡 Innovación Práctica", description: "Aplicar creatividad para resolver problemas cotidianos con soluciones originales." }
            ]
        };

        let ideas = ideasDatabase[area] || [];
        
        // Si hay contexto, personalizar las ideas
        if (context) {
            ideas = ideas.map(idea => ({
                ...idea,
                description: `${idea.description} (Contexto: ${context.substring(0, 50)}...)`
            }));
        }

        return ideas.slice(0, 5); // Limitar a 5 ideas
    }

    displayGeneratedIdeas(ideas) {
        const container = document.getElementById('generated-ideas');
        
        let html = '<h5>✨ Ideas Generadas:</h5>';
        
        ideas.forEach((idea, index) => {
            html += `
                <div class="idea-item" data-index="${index}">
                    <div class="idea-title">${idea.title}</div>
                    <div class="idea-description">${idea.description}</div>
                </div>
            `;
        });

        html += `
            <div class="ideas-actions">
                <button id="add-selected-ideas">➕ Agregar Seleccionadas</button>
                <button id="regenerate-ideas">🔄 Generar Más</button>
            </div>
        `;

        container.innerHTML = html;

        // Event listeners para las ideas
        container.querySelectorAll('.idea-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
            });
        });

        document.getElementById('add-selected-ideas').addEventListener('click', () => {
            this.addSelectedIdeasToTree();
        });

        document.getElementById('regenerate-ideas').addEventListener('click', () => {
            this.generateIdeas();
        });

        // Almacenar ideas para uso posterior
        this.generatedIdeas = ideas;
    }

    addSelectedIdeasToTree() {
        const selectedItems = document.querySelectorAll('.idea-item.selected');
        
        if (selectedItems.length === 0) {
            this.showNotification('⚠️ Selecciona al menos una idea', 'warning');
            return;
        }

        let addedCount = 0;
        selectedItems.forEach(item => {
            const index = parseInt(item.dataset.index);
            const idea = this.generatedIdeas[index];
            
            // Crear nodo automáticamente
            const newNode = {
                name: idea.title,
                description: idea.description,
                type: 'branch', // Por defecto como rama
                id: `generated_${Date.now()}_${Math.random()}`,
                level: 1,
                direction: 'up'
            };

            // Agregar a las ramas
            if (!treeData.branches) treeData.branches = [];
            treeData.branches.push(newNode);
            addedCount++;
        });

        // Re-procesar y renderizar
        this.processData();
        this.refresh();
        
        this.showNotification(`✅ ${addedCount} ideas agregadas al árbol`, 'success');
        
        // Guardar cambios
        this.saveToLocalStorage();
        
        // Cerrar panel
        this.hideGenerateSection();
    }

    // ===== SISTEMA DE GUARDADO PERMANENTE =====
    saveToLocalStorage() {
        try {
            const treeDataToSave = {
                trunk: treeData.trunk,
                roots: treeData.roots,
                branches: treeData.branches,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('arbolProyectoVida', JSON.stringify(treeDataToSave));
            this.showNotification('💾 Cambios guardados automáticamente', 'success');
        } catch (error) {
            this.showNotification('❌ Error al guardar', 'error');
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('arbolProyectoVida');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Actualizar datos globales
                if (parsedData.trunk) treeData.trunk = parsedData.trunk;
                if (parsedData.roots) treeData.roots = parsedData.roots;
                if (parsedData.branches) treeData.branches = parsedData.branches;
                
                const lastSaved = new Date(parsedData.lastSaved).toLocaleString();
                this.showNotification(`📂 Datos cargados (${lastSaved})`, 'info');
                
                return true;
            }
        } catch (error) {
            this.showNotification('⚠️ Error cargando datos guardados', 'warning');
            console.error('Error loading from localStorage:', error);
        }
        return false;
    }

    updateOriginalData() {
        // Sincronizar cambios con el objeto global treeData
        // Esta función mantiene la consistencia entre la vista y los datos
    }

    saveTreeData() {
        this.saveToLocalStorage();
        
        // También ofrecer descarga como archivo JSON
        const dataToDownload = {
            trunk: treeData.trunk,
            roots: treeData.roots,
            branches: treeData.branches,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arbol-proyecto-vida-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('💾 Árbol guardado y descargado', 'success');
    }

    refresh() {
        this.g.selectAll("*").remove();
        this.render();
    }

    // Funciones básicas (tooltip, info, etc.)
    showNodeInfo(d) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        
        title.textContent = d.name;
        description.textContent = d.description;
        panel.classList.add('active');
    }

    hideInfoPanel() {
        document.getElementById('info-panel').classList.remove('active');
        this.currentActiveNode = null;
        this.editingNode = null;
        this.updateActiveNode();
    }

    updateActiveNode() {
        this.g.selectAll('.node circle')
            .style('fill', d => this.getNodeColor(d));
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
        this.g.selectAll('.node').style('opacity', 1);
        this.g.selectAll('path').style('opacity', 0.7);
    }

    hideSecondaryNodes() {
        this.g.selectAll('.node').style('opacity', d => d.level <= 1 ? 1 : 0.3);
    }

    saveTreeData() {
        this.showNotification('💾 Árbol guardado', 'success');
    }

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

    showNotification(message, type = 'info') {
        // Crear notificación
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

        const colors = {
            success: '#28a745',
            warning: '#ffc107', 
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

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
    const editableTree = new EditableOrganicTree();
    window.editableTree = editableTree;
    console.log('🌳 Árbol Orgánico Editable cargado correctamente');
});