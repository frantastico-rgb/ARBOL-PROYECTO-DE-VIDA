// ===== ÁRBOL ORGÁNICO BIDIRECCIONAL =====
// Estructura vertical real: Raíces (abajo) → Tronco (centro) → Ramas (arriba)

class OrganicBidirectionalTree {
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

        // Centrar inicialmente
        const initialTransform = d3.zoomIdentity
            .translate(treeConfig.width / 2, treeConfig.height / 2)
            .scale(0.6);
        
        this.svg.call(zoom.transform, initialTransform);
    }

    processData() {
        // TRONCO en el centro (Y = 0)
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
        const rootSpacing = 200; // Separación horizontal entre raíces principales
        const startX = -(rootsData.length - 1) * rootSpacing / 2;

        rootsData.forEach((root, index) => {
            const rootX = startX + (index * rootSpacing);
            const rootY = 120; // Distancia del tronco hacia abajo

            const processedRoot = {
                ...root,
                x: rootX,
                y: rootY,
                id: `root_${index}`,
                level: 1,
                direction: 'down'
            };

            // Procesar raíces secundarias (más profundas)
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
        const childSpacing = 120;
        const startX = parentX - (children.length - 1) * childSpacing / 2;
        const childY = parentY + 100; // Más profundo

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
        const branchSpacing = 180; // Separación horizontal entre ramas principales
        const startX = -(branchesData.length - 1) * branchSpacing / 2;

        branchesData.forEach((branch, index) => {
            const branchX = startX + (index * branchSpacing);
            const branchY = -120; // Distancia del tronco hacia arriba

            const processedBranch = {
                ...branch,
                x: branchX,
                y: branchY,
                id: `branch_${index}`,
                level: 1,
                direction: 'up'
            };

            // Procesar hojas (extremos de las ramas)
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
        const childSpacing = 100;
        const startX = parentX - (children.length - 1) * childSpacing / 2;
        const childY = parentY - 80; // Más alto

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
        // Renderizar fondo con zonas de color
        this.renderBackground();
        
        // Renderizar conexiones primero
        this.renderConnections();
        
        // Renderizar nodos
        this.renderTrunk();
        this.renderRoots();
        this.renderBranches();
    }

    renderBackground() {
        // Zona Verde (Ramas) - Arriba
        this.g.append('rect')
            .attr('x', -treeConfig.width/2)
            .attr('y', -treeConfig.height/2)
            .attr('width', treeConfig.width)
            .attr('height', treeConfig.height/3)
            .attr('fill', 'rgba(76, 175, 80, 0.1)')
            .attr('rx', 15);

        // Zona Azul (Tronco) - Centro
        this.g.append('rect')
            .attr('x', -treeConfig.width/2)
            .attr('y', -treeConfig.height/6)
            .attr('width', treeConfig.width)
            .attr('height', treeConfig.height/3)
            .attr('fill', 'rgba(33, 150, 243, 0.1)')
            .attr('rx', 15);

        // Zona Amarilla (Raíces) - Abajo
        this.g.append('rect')
            .attr('x', -treeConfig.width/2)
            .attr('y', treeConfig.height/6)
            .attr('width', treeConfig.width)
            .attr('height', treeConfig.height/3)
            .attr('fill', 'rgba(255, 235, 59, 0.1)')
            .attr('rx', 15);
    }

    renderConnections() {
        // Conexiones de raíces (líneas orgánicas hacia abajo)
        this.rootsNodes.forEach(root => {
            // Línea del tronco a la raíz principal
            this.g.append('path')
                .attr('d', this.createOrganicPath(this.trunkNode, root))
                .attr('class', 'root-connection')
                .style('stroke', '#8D6E63')
                .style('stroke-width', 4)
                .style('fill', 'none')
                .style('opacity', 0.8);

            // Conexiones a raíces secundarias
            if (root.children) {
                root.children.forEach(child => {
                    this.g.append('path')
                        .attr('d', this.createOrganicPath(root, child))
                        .attr('class', 'deep-root-connection')
                        .style('stroke', '#6D4C41')
                        .style('stroke-width', 2)
                        .style('fill', 'none')
                        .style('opacity', 0.7);
                });
            }
        });

        // Conexiones de ramas (líneas orgánicas hacia arriba)
        this.branchesNodes.forEach(branch => {
            // Línea del tronco a la rama principal
            this.g.append('path')
                .attr('d', this.createOrganicPath(this.trunkNode, branch))
                .attr('class', 'branch-connection')
                .style('stroke', '#8D6E63')
                .style('stroke-width', 4)
                .style('fill', 'none')
                .style('opacity', 0.8);

            // Conexiones a hojas
            if (branch.children) {
                branch.children.forEach(child => {
                    this.g.append('path')
                        .attr('d', this.createOrganicPath(branch, child))
                        .attr('class', 'leaf-connection')
                        .style('stroke', '#4CAF50')
                        .style('stroke-width', 2)
                        .style('fill', 'none')
                        .style('opacity', 0.7);
                });
            }
        });
    }

    createOrganicPath(source, target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        
        // Crear curva orgánica (más natural)
        const midX = source.x + dx * 0.5;
        const midY = source.y + dy * 0.3;
        
        return `M ${source.x},${source.y} 
                Q ${midX},${midY} 
                ${target.x},${target.y}`;
    }

    renderTrunk() {
        const trunkGroup = this.g.append('g')
            .attr('class', 'trunk-group node trunk')
            .attr('transform', `translate(${this.trunkNode.x}, ${this.trunkNode.y})`);

        // Círculo del tronco (más grande)
        trunkGroup.append('circle')
            .attr('r', treeConfig.nodeRadius * 1.8)
            .style('fill', treeConfig.colors.trunk)
            .style('stroke', 'white')
            .style('stroke-width', 5)
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.handleNodeClick(event, this.trunkNode))
            .on('mouseover', (event, d) => this.showTooltip(event, this.trunkNode))
            .on('mouseout', () => this.hideTooltip());

        // Icono del tronco
        trunkGroup.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-50px')
            .attr('text-anchor', 'middle')
            .style('font-size', '35px')
            .text('🌳');

        // Texto del tronco
        trunkGroup.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('OBJETIVO');
    }

    renderRoots() {
        // Raíces principales
        this.rootsNodes.forEach(root => {
            this.renderNode(root, 'roots-main');
            
            // Raíces secundarias
            if (root.children) {
                root.children.forEach(child => {
                    this.renderNode(child, 'roots-deep');
                });
            }
        });
    }

    renderBranches() {
        // Ramas principales
        this.branchesNodes.forEach(branch => {
            this.renderNode(branch, 'branches-main');
            
            // Hojas
            if (branch.children) {
                branch.children.forEach(child => {
                    this.renderNode(child, 'branches-leaf');
                });
            }
        });
    }

    renderNode(nodeData, cssClass) {
        const nodeGroup = this.g.append('g')
            .attr('class', `node ${nodeData.type} ${cssClass}`)
            .attr('transform', `translate(${nodeData.x}, ${nodeData.y})`);

        // Círculo del nodo
        const radius = nodeData.level === 1 ? 
            treeConfig.nodeRadius * 1.2 : 
            treeConfig.nodeRadius * 0.9;

        nodeGroup.append('circle')
            .attr('r', radius)
            .style('fill', this.getNodeColor(nodeData))
            .style('stroke', 'white')
            .style('stroke-width', 3)
            .style('cursor', 'pointer')
            .on('click', (event) => this.handleNodeClick(event, nodeData))
            .on('mouseover', (event) => this.showTooltip(event, nodeData))
            .on('mouseout', () => this.hideTooltip());

        // Icono del nodo
        nodeGroup.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '-30px')
            .attr('text-anchor', 'middle')
            .style('font-size', nodeData.level === 1 ? '20px' : '16px')
            .text(getNodeIcon(nodeData.type, nodeData.name));

        // Texto del nodo
        nodeGroup.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', nodeData.level === 1 ? '11px' : '9px')
            .style('font-weight', '500')
            .style('fill', 'white')
            .text(this.getShortName(nodeData.name));
    }

    getShortName(name) {
        const cleanName = name.replace(/[🌱🌿🍃💎💫🔮📋💼❤️💰🎓🤝💪🧘📊🌟🎯🌍]/g, '').trim();
        return cleanName.length > 12 ? cleanName.substring(0, 12) + '...' : cleanName;
    }

    getNodeColor(d) {
        if (d === this.selectedParentNode) return '#28a745';
        if (d === this.currentActiveNode) return treeConfig.colors.active;
        return treeConfig.colors[d.type] || treeConfig.colors.branch;
    }

    // Event Handlers (simplificados)
    setupEventListeners() {
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

        document.getElementById('close-panel').addEventListener('click', () => {
            this.hideInfoPanel();
        });
    }

    handleNodeClick(event, d) {
        this.currentActiveNode = d;
        this.showNodeInfo(d);
        this.updateActiveNode();
    }

    showNodeInfo(d) {
        const panel = document.getElementById('info-panel');
        const title = document.getElementById('info-title');
        const description = document.getElementById('info-description');
        const details = document.getElementById('info-details');

        title.textContent = d.name;
        description.textContent = d.description;

        // Limpiar detalles
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
        this.g.selectAll('.node circle')
            .style('fill', d => this.getNodeColor(d));
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const button = document.getElementById('editMode');
        
        if (this.isEditMode) {
            button.textContent = '👁️ Modo Vista';
            button.style.background = '#FF6B6B';
        } else {
            button.textContent = '✏️ Modo Edición';
            button.style.background = '';
            this.hideInfoPanel();
        }
    }

    centerTree() {
        const zoom = d3.zoom();
        const transform = d3.zoomIdentity
            .translate(treeConfig.width / 2, treeConfig.height / 2)
            .scale(0.6);
        
        this.svg.transition()
            .duration(750)
            .call(zoom.transform, transform);
    }

    showAllNodes() {
        this.g.selectAll('.node').style('opacity', 1);
        this.g.selectAll('path').style('opacity', d => d.level <= 1 ? 0.8 : 0.7);
    }

    hideSecondaryNodes() {
        this.g.selectAll('.node').style('opacity', d => d.level <= 1 ? 1 : 0.3);
        this.g.selectAll('.deep-root-connection, .leaf-connection').style('opacity', 0.2);
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
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    const organicTree = new OrganicBidirectionalTree();
    window.organicTree = organicTree;
    console.log('🌳 Árbol Orgánico Bidireccional cargado correctamente');
});