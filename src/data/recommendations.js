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
      recommendation: 'Implementar automatizaciones inteligentes en CRM y comunicaciones
