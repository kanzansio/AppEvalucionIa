export const assessmentData = {
  areas: [
    {
      id: "estrategia",
      name: "Estrategia y Objetivos",
      description: "Dirección clara, metas visibles y límites de uso",
      questions: [
        { id: "A1Q1", text: "¿El equipo sabe para qué tareas específicas usa la IA?" },
        { id: "A1Q2", text: "¿Existen metas simples ligadas al uso de IA (tiempo, respuesta, citas)?" },
        { id: "A1Q3", text: "¿Cada rol conoce qué se espera de su uso de IA?" },
        { id: "A1Q4", text: "¿Hay un plan trimestral para incorporar/mejorar casos de uso?" },
        { id: "A1Q5", text: "¿Están claros los límites y riesgos (datos sensibles, promesas)?" }
      ]
    },
    {
      id: "prospectos",
      name: "Prospección y Priorización",
      description: "Encontrar, enriquecer y ordenar a quién contactar primero",
      questions: [
        { id: "A2Q1", text: "¿Usan IA para generar listas iniciales de prospectos?" },
        { id: "A2Q2", text: "¿La IA ayuda a priorizar cuentas/contactos (caliente/templado/frío)?" },
        { id: "A2Q3", text: "¿La IA enriquece con datos públicos útiles (sector, noticias)?" },
        { id: "A2Q4", text: "¿La IA detecta señales sencillas para elegir el momento de contacto?" },
        { id: "A2Q5", text: "¿Revisan y ajustan criterios de priorización de forma regular?" }
      ]
    },
    {
      id: "mensajes",
      name: "Mensajes Comerciales",
      description: "Claridad, personalización y secuencias",
      questions: [
        { id: "A3Q1", text: "¿La IA ayuda a crear borradores claros y breves?" },
        { id: "A3Q2", text: "¿La IA añade contexto del cliente sin sonar genérico?" },
        { id: "A3Q3", text: "¿Usan IA para mejorar tono/claridad antes de enviar?" },
        { id: "A3Q4", text: "¿Prueban variantes simples (asunto o primer párrafo)?" },
        { id: "A3Q5", text: "¿Usan secuencias de seguimiento con intervalos razonables?" }
      ]
    },
    {
      id: "reuniones",
      name: "Llamadas, Reuniones y CRM",
      description: "Preparación, notas útiles y próximos pasos claros",
      questions: [
        { id: "A4Q1", text: "¿La IA arma un brief previo de la cuenta antes de la llamada?" },
        { id: "A4Q2", text: "¿Generan resúmenes accionables con acuerdos y tareas?" },
        { id: "A4Q3", text: "¿La IA ayuda a registrar notas claras en el CRM?" },
        { id: "A4Q4", text: "¿Configuran recordatorios y cadencias con borradores listos?" },
        { id: "A4Q5", text: "¿Tienen una vista 360 de la cuenta (línea de tiempo)?" }
      ]
    },
    {
      id: "material",
      name: "Material Comercial",
      description: "Propuestas, casos y comparativas",
      questions: [
        { id: "A5Q1", text: "¿La IA crea propuestas base con secciones estándar?" },
        { id: "A5Q2", text: "¿Adapta casos de éxito al tamaño/sector del cliente?" },
        { id: "A5Q3", text: "¿Tienen banco de respuestas a objeciones comunes?" },
        { id: "A5Q4", text: "¿La IA arma comparativas neutrales (cuándo sí/cuándo no)?" },
        { id: "A5Q5", text: "¿Generan presentaciones listas para pulir (alineadas a marca)?" }
      ]
    },
    {
      id: "capacitacion",
      name: "Capacitación y Adopción",
      description: "Onboarding, práctica y cultura de compartir",
      questions: [
        { id: "A6Q1", text: "¿Existe una guía de inicio con usos sí/no y ejemplos?" },
        { id: "A6Q2", text: "¿Realizan micro-sesiones para practicar prompts?" },
        { id: "A6Q3", text: "¿Mantienen un repositorio vivo de plantillas y ejemplos?" },
        { id: "A6Q4", text: "¿Tienen canal de soporte entre pares y FAQ?" },
        { id: "A6Q5", text: "¿Reconocen a quienes comparten buenas prácticas?" }
      ]
    },
    {
      id: "etica",
      name: "Ética, Seguridad y Calidad",
      description: "Guardrails, revisión humana y veracidad",
      questions: [
        { id: "A7Q1", text: "¿El equipo conoce qué datos no deben usarse con IA?" },
        { id: "A7Q2", text: "¿Hay revisión humana obligatoria antes de enviar piezas clave?" },
        { id: "A7Q3", text: "¿Guardan fuentes para cifras y evitan promesas absolutas?" },
        { id: "A7Q4", text: "¿La IA mantiene el tono/valores de la marca?" },
        { id: "A7Q5", text: "¿Tienen historial de versiones y control de accesos?" }
      ]
    },
    {
      id: "medicion",
      name: "Medición e Iteración",
      description: "KPIs, experimentos y mejoras constantes",
      questions: [
        { id: "A8Q1", text: "¿Definen 2–3 KPIs simples (tiempo, respuesta, citas)?" },
        { id: "A8Q2", text: "¿Realizan pruebas A/B y documentan aprendizajes?" },
        { id: "A8Q3", text: "¿Actualizan plantillas/cadencias según resultados?" },
        { id: "A8Q4", text: "¿Detectan cuellos de botella por etapa/segmento?" },
        { id: "A8Q5", text: "¿Incorporan la voz del cliente a mensajes/guiones?" }
      ]
    }
  ]
}

export const scaleOptions = [
  { value: 1, text: "1 — No lo hacemos" },
  { value: 2, text: "2 — Lo hemos probado muy poco" },
  { value: 3, text: "3 — A veces, sin método claro" },
  { value: 4, text: "4 — Con reglas simples y consistencia" },
  { value: 5, text: "5 — Siempre, con buenas prácticas y medición" }
]

export const getMaturityLevel = (score, totalMax) => {
  const q1 = 0.25 * totalMax, q2 = 0.50 * totalMax, q3 = 0.75 * totalMax
  if (score <= q1) return { label: "Explorador", color: "#ef4444", description: "Primeros pasos: define guía y 3 casos de uso." }
  if (score <= q2) return { label: "Iniciado",   color: "#f59e0b", description: "En prueba: estandariza plantillas y mide 2–3 KPIs." }
  if (score <= q3) return { label: "Integrador", color: "#1e3a5f", description: "En marcha: integra con CRM y haz A/B regulares." }
  return { label: "Orquestador", color: "#5bb878", description: "Avanzado: automatiza, escala y mide ROI por caso de uso." }
}

export const getAreaMaturityLevel = (areaScore, areaMax) => {
  const q1 = 0.25 * areaMax, q2 = 0.50 * areaMax, q3 = 0.75 * areaMax
  if (areaScore <= q1) return { label: "Explorador", color: "#ef4444", min: 0, max: q1 }
  if (areaScore <= q2) return { label: "Iniciado",   color: "#f59e0b", min: q1, max: q2 }
  if (areaScore <= q3) return { label: "Integrador", color: "#1e3a5f", min: q2, max: q3 }
  return { label: "Orquestador", color: "#5bb878", min: q3, max: areaMax }
}