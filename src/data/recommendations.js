import { assessmentData } from './questions'

export const generateRecommendations = (areaScores) => {
  const items = []

  assessmentData.areas.forEach(area => {
    const max = area.questions.length * 5
    const score = areaScores[area.id] || 0
    const pct = max ? score / max : 0

    let priority = 'MEDIA', timeline = '60–90 días'
    if (pct < 0.4) { priority = 'CRÍTICA'; timeline = '2-4 meses' }
    else if (pct < 0.6) { priority = 'ALTA'; timeline = '2-4 meses' }
    else if (pct < 0.8) { priority = 'MEDIA'; timeline = '2-4 meses' }

    let actions = []
    let detailedDescription = ''
    
    switch(area.id){
      case 'necesidad':
        detailedDescription = 'Capacidad para identificar y contactar prospectos cualificados'
        actions = [
          'Implementar secuencias de prospección automatizadas',
          'Desarrollar mensajes personalizados por industria',
          'Integrar prospección social con outreach tradicional'
        ]
        break
      case 'uso':
        detailedDescription = 'Adherencia a un proceso de ventas estructurado y uso de metodologías'
        actions = [
          'Estandarizar el uso de asistentes de IA para copy y resúmenes',
          'Activar lead scoring automático en el CRM',
          'Implementar automatización de notas y seguimientos'
        ]
        break
      case 'datos':
        detailedDescription = 'Capacidad de escucha activa, descubrimiento de necesidades y presentación'
        actions = [
          'Mejorar calidad de datos en CRM (≥90% completitud)',
          'Implementar higiene de datos automática',
          'Crear datasets para evaluación de modelos IA'
        ]
        break
      case 'herramientas':
        detailedDescription = 'Técnicas de negociación efectivas y capacidad de cierre'
        actions = [
          'Desplegar herramientas IA aprobadas para todo el equipo',
          'Integrar plantillas y snippets al flujo de trabajo',
          'Automatizar resúmenes y próximos pasos'
        ]
        break
      case 'prompts':
        detailedDescription = 'Uso efectivo de herramientas CRM y gestión de relaciones'
        actions = [
          'Formar equipo en técnicas de prompting efectivo',
          'Crear biblioteca de prompts por etapa del funnel',
          'Establecer checklist de evaluación de salidas IA'
        ]
        break
      case 'procesos':
        detailedDescription = 'Actitud hacia el aprendizaje continuo y gestión personal'
        actions = [
          'Implementar A/B testing sistemático con IA',
          'Crear tableros de seguimiento por rep y caso de uso',
          'Establecer rituales de mejora continua'
        ]
        break
      case 'gobernanza':
        detailedDescription = 'Políticas de seguridad y uso responsable de IA'
        actions = [
          'Definir políticas de PII y límites de uso',
          'Implementar revisión humana para contenido sensible',
          'Establecer auditorías periódicas de uso IA'
        ]
        break
      case 'impacto':
        detailedDescription = 'Medición y optimización del ROI de IA'
        actions = [
          'Establecer línea base y métricas de atribución',
          'Medir lift en respuesta, citas y win rate',
          'Calcular ROI por caso de uso implementado'
        ]
        break
      default:
        detailedDescription = 'Área de desarrollo general'
        actions = ['Estandarizar buenas prácticas y documentar aprendizajes']
    }

    items.push({
      areaId: area.id,
      areaName: area.name,
      priority, 
      timeline, 
      actions,
      description: detailedDescription,
      percent: Math.round(pct*100),
      score, 
      max
    })
  })

  const order = { 'CRÍTICA': 0, 'ALTA': 1, 'MEDIA': 2, 'BAJA': 3 }
  items.sort((a, b) => order[a.priority] - order[b.priority])

  return {
    byArea: items,
    top3: items.slice(0, 3),
    patterns: generatePatterns(items),
    priorities: generatePriorities(items)
  }
}

const generatePatterns = (items) => {
  const patterns = []
  
  // Detectar desbalance de habilidades
  const communicationArea = items.find(item => item.areaId === 'prompts')
  const closingArea = items.find(item => item.areaId === 'herramientas')
  
  if (communicationArea && closingArea) {
    if (communicationArea.percent >= 70 && closingArea.percent < 50) {
      patterns.push({
        id: 'desbalance_habilidades',
        title: 'Desbalance habilidades',
        priority: 'ALTA',
        description: 'Excelentes habilidades de comunicación que no se están capitalizando en el cierre. Enfócate en negociación.',
        recommendation: 'Especialización en técnicas de negociación y cierre',
        impact: 'Alto',
        timeline: '2-4 meses'
      })
    }
  }
  
  // Detectar riesgo de burnout
  const personalDev = items.find(item => item.areaId === 'impacto')
  if (personalDev && personalDev.percent < 40) {
    patterns.push({
      id: 'riesgo_burnout',
      title: 'Riesgo de burnout',
      priority: 'ALTA',
      description: 'El bajo desarrollo personal puede impactar la retención de talento y el rendimiento a largo plazo.',
      recommendation: 'Programa de desarrollo personal y bienestar',
      impact: 'Alto',
      timeline: '2-4 meses'
    })
  }
  
  // Detectar oportunidades de automatización
  const processArea = items.find(item => item.areaId === 'procesos')
  const toolsArea = items.find(item => item.areaId === 'herramientas')
  
  if (processArea && toolsArea && processArea.percent < 60 && toolsArea.percent < 60) {
    patterns.push({
      id: 'automatizacion_potencial',
      title: 'Potencial de automatización alto',
      priority: 'MEDIA',
      description: 'Múltiples procesos manuales que podrían automatizarse para liberar tiempo del equipo.',
      recommendation: 'Implementar automatizaciones inteligentes en CRM y comunicaciones',
      impact: 'Medio',
      timeline: '2-4 meses'
    })
  }
  
  return patterns
}

const generatePriorities = (items) => {
  const priorities = []
  
  // Prioridad 1: Prospección y Generación de Leads
  const prospection = items.find(item => item.areaId === 'necesidad')
  if (prospection) {
    priorities.push({
      id: 'prospection_leads',
      title: 'Prospección y Generación de Leads',
      priority: 'CRÍTICA',
      timeline: 'Corto plazo (2-4 meses)',
      description: 'Optimizar estrategia de prospección multicanal',
      actions: [
        'Implementar secuencias de prospección automatizadas',
        'Desarrollar mensajes personalizados por industria', 
        'Integrar prospección social con outreach tradicional'
      ],
      expectedOutcome: 'Incremento del 25-40% en leads calificados',
      resource: "Workshop 'Prospección Multicanal Avanzada'"
    })
  }
  
  // Prioridad 2: Negociación y Cierre
  const negotiation = items.find(item => item.areaId === 'herramientas')
  if (negotiation) {
    priorities.push({
      id: 'negotiation_closing',
      title: 'Negociación y Cierre',
      priority: 'ALTA',
      timeline: 'Corto plazo (2-4 meses)', 
      description: 'Implementar estrategias de negociación estructuradas',
      actions: [
        'Desarrollar proceso de preparación para negociaciones',
        'Implementar múltiples técnicas de cierre',
        'Mejorar mapeo de stakeholders y decisores'
      ],
      expectedOutcome: 'Mejora del 15-25% en tasa de conversión',
      resource: "Workshop 'Negociación Estratégica'"
    })
  }
  
  // Prioridad 3: Desarrollo Personal y Profesional
  const development = items.find(item => item.areaId === 'impacto')
  if (development) {
    priorities.push({
      id: 'personal_development',
      title: 'Desarrollo Personal y Profesional',
      priority: 'ALTA',
      timeline: 'Corto plazo (2-4 meses)',
      description: 'Desarrollar hábitos de crecimiento profesional',
      actions: [
        'Programa de mentoría y coaching individualizado',
        'Plan de desarrollo de carrera personalizado',
        'Técnicas de gestión del tiempo y productividad'
      ],
      expectedOutcome: 'Mayor retención de talento y performance sostenible',
      resource: "Programa 'Liderazgo Personal en Ventas'"
    })
  }
  
  return priorities.slice(0, 3)
}

// Función para obtener el estado/nivel de madurez de un área específica
export const getAreaStatus = (score, max) => {
  const percentage = (score / max) * 100
  
  if (percentage >= 88) return { label: 'Avanzado', color: '#3b82f6', bgColor: '#dbeafe' }
  if (percentage >= 78) return { label: 'Competente', color: '#10b981', bgColor: '#dcfce7' }
  if (percentage >= 60) return { label: 'En Desarrollo', color: '#f59e0b', bgColor: '#fef3c7' }
  return { label: 'En Desarrollo', color: '#f59e0b', bgColor: '#fef3c7' }
}

// Función para generar insights específicos por área
export const generateAreaInsights = (areaId, score, max) => {
  const percentage = (score / max) * 100
  const insights = {
    necesidad: {
      low: "Tu equipo necesita fortalecer las bases de prospección y generación de leads.",
      medium: "Buen nivel de prospección, pero hay oportunidades de optimización.",
      high: "Excelente capacidad de prospección. Enfócate en escalar y automatizar."
    },
    uso: {
      low: "Es fundamental establecer un proceso de ventas más estructurado.",
      medium: "Proceso sólido establecido, busca oportunidades de refinamiento.",
      high: "Proceso maduro y bien definido. Considera mentoring a otros equipos."
    },
    datos: {
      low: "Las habilidades de presentación necesitan desarrollo prioritario.",
      medium: "Buenas habilidades de comunicación con espacio para mejora.",
      high: "Comunicación excepcional. Podrías liderar entrenamientos internos."
    },
    herramientas: {
      low: "El cierre es un área crítica que requiere atención inmediata.",
      medium: "Técnicas de cierre en desarrollo, continúa practicando.",
      high: "Dominio excepcional del cierre. Comparte tus mejores prácticas."
    },
    prompts: {
      low: "El uso del CRM necesita ser más sistemático y efectivo.",
      medium: "Buen uso del CRM con oportunidades de optimización.",
      high: "Uso avanzado del CRM. Considera entrenar a otros en mejores prácticas."
    },
    procesos: {
      low: "El desarrollo personal es clave para el crecimiento a largo plazo.",
      medium: "Enfoque sólido en desarrollo personal, mantén la constancia.",
      high: "Excelente compromiso con el crecimiento personal continuo."
    },
    gobernanza: {
      low: "La gobernanza de IA requiere atención inmediata para evitar riesgos.",
      medium: "Políticas básicas establecidas, necesitan refinamiento.",
      high: "Marco de gobernanza sólido y bien implementado."
    },
    impacto: {
      low: "Es crucial establecer métricas para medir el impacto de IA.",
      medium: "Medición básica en proceso, amplía el alcance de métricas.",
      high: "Medición madura del ROI y optimización continua."
    }
  }
  
  const areaInsights = insights[areaId] || insights.necesidad
  
  if (percentage < 40) return areaInsights.low
  if (percentage < 75) return areaInsights.medium
  return areaInsights.high
}
