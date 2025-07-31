import { assessmentData } from './questions'

const areaPlaybooks = {
  estrategia: [
    "Publica una guía de 1 página (usos sí/no, límites, expectativas por rol).",
    "Define 2 metas simples (tiempo ahorrado, tasa de respuesta) y revísalas quincenalmente.",
    "Plan trimestral de incorporación de casos de uso con responsables y fechas."
  ],
  prospectos: [
    "Define ICP simple y genera 50 cuentas por vertical con IA.",
    "Implementa score básico (caliente/templado/frío) y revísalo cada 2 semanas.",
    "Enriquece con datos públicos (sector, noticias, cambios de cargo)."
  ],
  mensajes: [
    "Crea 3 plantillas (contacto, seguimiento, cierre suave) con tono de marca.",
    "Ejecuta A/B de asunto o primer párrafo por 2 semanas y adopta la ganadora.",
    "Usa secuencias de 3 toques (día 0/3/7) con enfoques distintos."
  ],
  reuniones: [
    "Plantillas de preparación y resúmenes accionables post-llamada.",
    "Notas estándar en CRM (problema → impacto → próximo paso) y recordatorios.",
    "Vista 360 de cuenta con línea de tiempo y etapa actual."
  ],
  material: [
    "Propuesta base con 6–8 secciones y comparativa neutral (cuándo sí/cuándo no).",
    "Banco de respuestas a objeciones; casos de éxito por vertical.",
    "Presentación base alineada a marca, lista para pulir."
  ],
  capacitacion: [
    "Onboarding 1 página, micro-sesiones semanales de 20 min y canal de soporte.",
    "Repositorio vivo de plantillas/prompts, actualizado quincenalmente.",
    "Reconocimiento a quienes compartan buenas prácticas."
  ],
  etica: [
    "Política de datos (qué no ingresar), revisión humana y checklist de veracidad.",
    "Historial de versiones y permisos por rol.",
    "Muestra aleatoria semanal para auditoría de calidad."
  ],
  medicion: [
    "Elige 2–3 KPIs (tiempo, respuesta, citas) y crea tablero quincenal.",
    "1 experimento A/B activo; decisiones documentadas.",
    "Renueva mensualmente 2 plantillas con peor desempeño."
  ]
}

export const generateRecommendations = (areaScores) => {
  const items = []

  assessmentData.areas.forEach(area => {
    const max = area.questions.length * 5
    const score = areaScores[area.id] || 0
    const pct = max ? score / max : 0

    let priority = 'BAJA', timeline = '60–90 días'
    if (pct < 0.4) { priority = 'CRÍTICA'; timeline = '0–30 días' }
    else if (pct < 0.6) { priority = 'ALTA'; timeline = '30–60 días' }
    else if (pct < 0.8) { priority = 'MEDIA'; timeline = '60–90 días' }

    const actions = areaPlaybooks[area.id] || ["Definir acciones específicas para esta área."]

    items.push({
      areaId: area.id,
      areaName: area.name,
      score, max, percentage: Math.round(pct * 100),
      priority, timeline,
      actions
    })
  })

  // top3: áreas más débiles
  const top3 = [...items].sort((a,b) => (a.score/a.max) - (b.score/b.max)).slice(0,3)

  return { items, top3 }
}