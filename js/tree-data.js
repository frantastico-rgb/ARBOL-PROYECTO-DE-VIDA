// ===== DATOS DEL ÁRBOL PROYECTO DE VIDA =====
// Estructura jerárquica para el proyecto de vida
// 🌱 Raíces: Valores y fundamentos | 🌳 Tronco: Objetivo principal | 🌿 Ramas: Resultados

const treeData = {
    name: "🌳 Mi Objetivo Principal",
    type: "trunk",
    description: "El tronco de mi árbol de vida - mi propósito central y objetivo principal",
    details: {
        objective: "Definir y alcanzar mi propósito de vida",
        vision: "La persona que quiero ser en el futuro",
        mission: "Lo que haré para lograr mi visión",
        timeline: "Proyecto a largo plazo"
    },
    // Raíces (hacia abajo)
    roots: [
    children: [
        {
            name: "🌱 Mis Valores Fundamentales",
            type: "roots",
            description: "Las raíces que sostienen todo mi proyecto de vida",
            details: {
                valores: ["Honestidad", "Perseverancia", "Compasión", "Excelencia"],
                principios: ["Respeto por otros", "Crecimiento continuo", "Responsabilidad"],
                fundamentos: "Estos valores guían todas mis decisiones",
                importancia: "Son la base sólida de mi carácter"
            },
            children: [
                {
                    name: "💫 Mi Misión Personal",
                    type: "roots",
                    description: "La razón de ser que guía mi camino",
                    details: {
                        mision: "Contribuir al bienestar de mi comunidad mientras desarrollo mi potencial",
                        como: "A través del desarrollo profesional y personal continuo",
                        impacto: "Dejar una huella positiva en las personas que me rodean",
                        medicion: "Retroalimentación de personas cercanas y logros tangibles"
                    }
                },
                {
                    name: "� Mi Visión de Futuro",
                    type: "roots",
                    description: "La imagen clara de lo que quiero llegar a ser",
                    details: {
                        vision: "Ser una persona íntegra, exitosa y que inspire a otros",
                        plazo: "En los próximos 5-10 años",
                        aspectos: ["Profesional", "Personal", "Familiar", "Social"],
                        indicadores: "Logros específicos y satisfacción personal"
                    }
                },
                {
                    name: "📋 Mis Estrategias",
                    type: "roots",
                    description: "Los métodos y enfoques para alcanzar mi visión",
                    details: {
                        estrategias: ["Educación continua", "Networking", "Salud integral", "Finanzas inteligentes"],
                        herramientas: "Planificación, disciplina, perseverancia",
                        recursos: "Tiempo, dinero, relaciones, conocimientos",
                        revision: "Evaluación trimestral de progreso"
                    }
                }
            ]
        },
        {
            name: "🌿 Desarrollo Profesional",
            type: "branch",
            description: "Rama dedicada al crecimiento en mi carrera y habilidades",
            details: {
                objetivo: "Alcanzar la excelencia en mi campo profesional",
                areas: ["Habilidades técnicas", "Liderazgo", "Comunicación", "Innovación"],
                timeline: "Progreso continuo",
                medicion: "Promociones, reconocimientos, nuevas oportunidades"
            },
            children: [
                {
                    name: "� Educación Continua",
                    type: "leaf",
                    description: "Compromiso constante con el aprendizaje",
                    details: {
                        acciones: ["Cursos especializados", "Certificaciones", "Maestría", "Seminarios"],
                        recursos: "Tiempo diario dedicado al estudio",
                        meta: "Mantenerme actualizado y competitivo",
                        seguimiento: "Evaluación semestral de conocimientos adquiridos"
                    }
                },
                {
                    name: "🤝 Networking Estratégico",
                    type: "leaf",
                    description: "Construcción de relaciones profesionales valiosas",
                    details: {
                        actividades: ["Eventos profesionales", "LinkedIn activo", "Mentorías"],
                        objetivo: "Crear oportunidades mutuas de crecimiento",
                        medicion: "Calidad y cantidad de conexiones significativas"
                    }
                },
                {
                    name: "💼 Proyectos de Impacto",
                    type: "leaf",
                    description: "Liderar iniciativas que generen valor",
                    details: {
                        tipos: ["Innovación", "Mejora de procesos", "Nuevos productos"],
                        beneficios: "Visibilidad, experiencia, reconocimiento",
                        compromiso: "Excelencia en cada proyecto asignado"
                    }
                }
            ]
        },
        {
            name: "🌿 Bienestar Personal",
            type: "branch", 
            description: "Rama enfocada en mi salud física, mental y emocional",
            details: {
                objetivo: "Mantener un equilibrio saludable en todas las áreas de mi vida",
                areas: ["Salud física", "Salud mental", "Relaciones", "Espiritualidad"],
                importancia: "Base fundamental para el éxito en otras áreas",
                filosofia: "Cuerpo sano, mente sana, espíritu fuerte"
            },
            children: [
                {
                    name: "� Fitness y Nutrición",
                    type: "leaf",
                    description: "Cuidado integral del cuerpo físico",
                    details: {
                        rutina: "Ejercicio regular 4-5 veces por semana",
                        alimentacion: "Dieta balanceada y consciente",
                        descanso: "7-8 horas de sueño de calidad",
                        chequeos: "Revisiones médicas preventivas regulares"
                    }
                },
                {
                    name: "🧘 Mindfulness y Crecimiento",
                    type: "leaf",
                    description: "Desarrollo de la inteligencia emocional y espiritual",
                    details: {
                        practicas: ["Meditación diaria", "Journaling", "Lectura inspiracional"],
                        objetivos: "Paz interior, claridad mental, propósito",
                        beneficios: "Mejor toma de decisiones y relaciones más sanas"
                    }
                },
                {
                    name: "❤️ Relaciones Significativas",
                    type: "leaf",
                    description: "Cultivar conexiones profundas y auténticas",
                    details: {
                        familia: "Tiempo de calidad y comunicación abierta",
                        amistades: "Relaciones basadas en valores compartidos",
                        pareja: "Crecimiento mutuo y apoyo incondicional",
                        comunidad: "Contribución activa al bienestar colectivo"
                    }
                }
            ]
        },
        {
            name: "🌿 Estabilidad Financiera",
            type: "branch",
            description: "Rama dedicada a la construcción de seguridad económica",
            details: {
                objetivo: "Lograr independencia financiera y tranquilidad económica",
                pilares: ["Ingresos múltiples", "Ahorro sistemático", "Inversiones inteligentes"],
                filosofia: "El dinero es una herramienta para la libertad y el impacto positivo"
            },
            children: [
                {
                    name: "💰 Múltiples Fuentes de Ingreso",
                    type: "leaf",
                    description: "Diversificar las entradas económicas",
                    details: {
                        principales: "Salario base del trabajo principal",
                        secundarias: ["Freelancing", "Consultorías", "Proyectos personales"],
                        pasivas: ["Inversiones", "Regalías", "Propiedades"],
                        objetivo: "Reducir dependencia de una sola fuente"
                    }
                },
                {
                    name: "📊 Inversión y Ahorro",
                    type: "leaf",
                    description: "Hacer crecer el dinero de manera inteligente",
                    details: {
                        estrategia: "Ahorro del 20% de ingresos mínimo",
                        inversiones: ["Fondos indexados", "Bienes raíces", "Educación"],
                        emergencia: "Fondo de emergencia de 6 meses de gastos",
                        revision: "Evaluación trimestral del portafolio"
                    }
                }
            ]
        }
    ]
};

// ===== CONFIGURACIÓN DEL ÁRBOL =====
const treeConfig = {
    width: 1200,
    height: 800,
    nodeRadius: 30,
    linkDistance: 150,
    colors: {
        root: "#8B4513",      // Marrón para el tronco
        roots: "#654321",     // Marrón oscuro para las raíces  
        branch: "#228B22",    // Verde para las ramas
        leaf: "#32CD32",      // Verde claro para las hojas
        active: "#FFD700"     // Dorado para el nodo activo
    },
    animation: {
        duration: 500,
        delay: 100
    }
};

// ===== DATOS ADICIONALES =====
const nodeIcons = {
    root: "🎯",
    decision: "🤔",
    outcome: "📋",
    analysis: "📊",
    action: "⚡",
    collaboration: "🤝"
};

// Función para obtener el icono apropiado
function getNodeIcon(nodeType, nodeName) {
    // Iconos específicos por tipo de nodo
    if (nodeType === "root") return "🌳";
    if (nodeType === "roots") return "🌱";
    if (nodeType === "branch") return "🌿";
    if (nodeType === "leaf") return "🍃";
    
    // Iconos específicos por contenido
    if (nodeName.includes("Valores")) return "💎";
    if (nodeName.includes("Misión")) return "�";
    if (nodeName.includes("Visión")) return "🔮";
    if (nodeName.includes("Estrategias")) return "📋";
    if (nodeName.includes("Profesional")) return "�";
    if (nodeName.includes("Bienestar")) return "❤️";
    if (nodeName.includes("Financiera")) return "�";
    if (nodeName.includes("Educación")) return "🎓";
    if (nodeName.includes("Networking")) return "🤝";
    if (nodeName.includes("Fitness")) return "�";
    if (nodeName.includes("Mindfulness")) return "🧘";
    if (nodeName.includes("Relaciones")) return "❤️";
    if (nodeName.includes("Inversión")) return "📊";
    
    return nodeIcons[nodeType] || "🌿";
}

// Exportar para uso en main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { treeData, treeConfig, getNodeIcon };
}