// ===== DATOS DEL ÁRBOL PROYECTO DE VIDA =====
// Estructura bidireccional: Raíces ← Tronco → Ramas
// 🌱 Raíces: Valores y fundamentos (hacia abajo)
// 🌳 Tronco: Objetivo principal (centro)
// 🌿 Ramas: Resultados y logros (hacia arriba)

const treeData = {
    // TRONCO CENTRAL
    trunk: {
        name: "🌳 Mi Objetivo Principal",
        type: "trunk",
        description: "El centro de mi árbol de vida - mi propósito principal",
        details: {
            objective: "Definir y alcanzar mi propósito de vida",
            vision: "La persona que quiero ser en el futuro",
            mission: "Lo que haré para lograr mi visión",
            timeline: "Proyecto a largo plazo"
        }
    },

    // RAÍCES (hacia abajo desde el tronco)
    roots: [
        {
            name: "🌱 Mis Valores Fundamentales",
            type: "roots",
            description: "Las raíces que sostienen todo mi proyecto de vida",
            details: {
                valores: ["Honestidad", "Perseverancia", "Compasión", "Excelencia"],
                principios: ["Respeto por otros", "Crecimiento continuo", "Responsabilidad"],
                fundamentos: "Estos valores guían todas mis decisiones"
            },
            children: [
                {
                    name: "💫 Mi Misión Personal",
                    type: "deep_roots",
                    description: "La razón de ser que guía mi camino",
                    details: {
                        mision: "Contribuir al bienestar de mi comunidad mientras desarrollo mi potencial",
                        como: "A través del desarrollo profesional y personal continuo"
                    }
                },
                {
                    name: "🔮 Mi Visión de Futuro", 
                    type: "deep_roots",
                    description: "La imagen clara de lo que quiero llegar a ser",
                    details: {
                        vision: "Ser una persona íntegra, exitosa y que inspire a otros",
                        plazo: "En los próximos 5-10 años"
                    }
                }
            ]
        },
        {
            name: "📋 Mis Principios y Estrategias",
            type: "roots",
            description: "Los métodos y enfoques fundamentales",
            details: {
                estrategias: ["Educación continua", "Networking", "Salud integral"],
                herramientas: "Planificación, disciplina, perseverancia"
            }
        }
    ],

    // RAMAS (hacia arriba desde el tronco)
    branches: [
        {
            name: "🌿 Desarrollo Profesional",
            type: "branch",
            description: "Rama dedicada al crecimiento en mi carrera",
            details: {
                objetivo: "Alcanzar la excelencia en mi campo profesional",
                areas: ["Habilidades técnicas", "Liderazgo", "Comunicación"]
            },
            children: [
                {
                    name: "🎓 Educación Continua",
                    type: "leaf",
                    description: "Compromiso constante con el aprendizaje",
                    details: {
                        acciones: ["Cursos especializados", "Certificaciones", "Maestría"],
                        meta: "Mantenerme actualizado y competitivo"
                    }
                },
                {
                    name: "🤝 Networking Estratégico",
                    type: "leaf", 
                    description: "Construcción de relaciones profesionales valiosas",
                    details: {
                        actividades: ["Eventos profesionales", "LinkedIn activo", "Mentorías"],
                        objetivo: "Crear oportunidades mutuas de crecimiento"
                    }
                },
                {
                    name: "💼 Proyectos de Impacto",
                    type: "leaf",
                    description: "Liderar iniciativas que generen valor",
                    details: {
                        tipos: ["Innovación", "Mejora de procesos", "Nuevos productos"],
                        beneficios: "Visibilidad, experiencia, reconocimiento"
                    }
                }
            ]
        },
        {
            name: "🌿 Bienestar y Salud",
            type: "branch",
            description: "Rama enfocada en mi salud integral",
            details: {
                objetivo: "Mantener equilibrio en todas las áreas de mi vida",
                areas: ["Salud física", "Salud mental", "Relaciones"]
            },
            children: [
                {
                    name: "💪 Fitness y Nutrición",
                    type: "leaf",
                    description: "Cuidado integral del cuerpo físico",
                    details: {
                        rutina: "Ejercicio regular 4-5 veces por semana",
                        alimentacion: "Dieta balanceada y consciente"
                    }
                },
                {
                    name: "🧘 Mindfulness y Crecimiento",
                    type: "leaf",
                    description: "Desarrollo emocional y espiritual",
                    details: {
                        practicas: ["Meditación diaria", "Journaling", "Lectura"],
                        objetivos: "Paz interior, claridad mental, propósito"
                    }
                },
                {
                    name: "❤️ Relaciones Significativas",
                    type: "leaf",
                    description: "Cultivar conexiones profundas y auténticas",
                    details: {
                        familia: "Tiempo de calidad y comunicación abierta",
                        amistades: "Relaciones basadas en valores compartidos"
                    }
                }
            ]
        },
        {
            name: "🌿 Estabilidad Financiera",
            type: "branch",
            description: "Rama dedicada a la seguridad económica",
            details: {
                objetivo: "Lograr independencia financiera",
                pilares: ["Ingresos múltiples", "Ahorro sistemático", "Inversiones"]
            },
            children: [
                {
                    name: "💰 Múltiples Fuentes de Ingreso",
                    type: "leaf",
                    description: "Diversificar las entradas económicas",
                    details: {
                        principales: "Salario base del trabajo principal",
                        secundarias: ["Freelancing", "Consultorías", "Proyectos"]
                    }
                },
                {
                    name: "📊 Inversión y Ahorro",
                    type: "leaf",
                    description: "Hacer crecer el dinero inteligentemente",
                    details: {
                        estrategia: "Ahorro del 20% de ingresos mínimo",
                        inversiones: ["Fondos indexados", "Bienes raíces", "Educación"]
                    }
                }
            ]
        },
        {
            name: "🌿 Impacto y Legado",
            type: "branch",
            description: "Rama dedicada a la contribución social",
            details: {
                objetivo: "Dejar un impacto positivo duradero",
                areas: ["Mentoría", "Voluntariado", "Innovación social"]
            },
            children: [
                {
                    name: "🎯 Mentoría y Enseñanza",
                    type: "leaf",
                    description: "Compartir conocimientos con otros",
                    details: {
                        actividades: ["Mentoría profesional", "Talleres", "Conferencias"],
                        impacto: "Ayudar a otros a alcanzar su potencial"
                    }
                },
                {
                    name: "🌍 Contribución Social",
                    type: "leaf",
                    description: "Participar en causas significativas",
                    details: {
                        areas: ["Educación", "Medio ambiente", "Desarrollo comunitario"],
                        commitment: "Dedicar tiempo y recursos regularmente"
                    }
                }
            ]
        }
    ]
};

// ===== CONFIGURACIÓN DEL ÁRBOL BIDIRECCIONAL =====
const treeConfig = {
    width: 1400,
    height: 1000,
    nodeRadius: 30,
    linkDistance: 150,
    trunkY: 500, // Posición Y del tronco (centro)
    colors: {
        trunk: "#8B4513",        // Marrón para el tronco
        roots: "#654321",        // Marrón oscuro para las raíces  
        deep_roots: "#4A2C17",   // Marrón muy oscuro para raíces profundas
        branch: "#228B22",       // Verde para las ramas
        leaf: "#32CD32",         // Verde claro para las hojas
        active: "#FFD700"        // Dorado para el nodo activo
    },
    animation: {
        duration: 500,
        delay: 100
    }
};

// ===== DATOS ADICIONALES =====
const nodeIcons = {
    trunk: "🌳",
    roots: "🌱", 
    deep_roots: "🌿",
    branch: "🌿",
    leaf: "🍃"
};

// Función para obtener el icono apropiado
function getNodeIcon(nodeType, nodeName) {
    // Iconos específicos por tipo de nodo
    if (nodeType === "trunk") return "🌳";
    if (nodeType === "roots") return "🌱";
    if (nodeType === "deep_roots") return "🪴";
    if (nodeType === "branch") return "🌿";
    if (nodeType === "leaf") return "🍃";
    
    // Iconos específicos por contenido
    if (nodeName.includes("Valores")) return "💎";
    if (nodeName.includes("Misión")) return "💫";
    if (nodeName.includes("Visión")) return "🔮";
    if (nodeName.includes("Estrategias")) return "📋";
    if (nodeName.includes("Profesional")) return "💼";
    if (nodeName.includes("Bienestar")) return "❤️";
    if (nodeName.includes("Financiera")) return "💰";
    if (nodeName.includes("Educación")) return "🎓";
    if (nodeName.includes("Networking")) return "🤝";
    if (nodeName.includes("Fitness")) return "💪";
    if (nodeName.includes("Mindfulness")) return "🧘";
    if (nodeName.includes("Relaciones")) return "❤️";
    if (nodeName.includes("Inversión")) return "📊";
    if (nodeName.includes("Impacto")) return "🌟";
    if (nodeName.includes("Mentoría")) return "🎯";
    if (nodeName.includes("Social")) return "🌍";
    
    return nodeIcons[nodeType] || "🌿";
}

// Exportar para uso en main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { treeData, treeConfig, getNodeIcon };
}