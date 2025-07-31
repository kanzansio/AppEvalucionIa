export const assessmentData = {
  areas: [
    { id: "necesidad", name: "Necesidad Percibida e Impacto", description: "Dónde la IA aportaría más valor", questions: [
      { id: "N1", text: "Prospección insuficiente: IA podría ampliar alcance y personalización.", type: "likert" },
      { id: "N2", text: "Calificación inconsistente; IA ayudaría a priorizar leads.", type: "likert" },
      { id: "N3", text: "Ciclo de venta largo; IA podría acortarlo con automatizaciones.", type: "likert" },
      { id: "N4", text: "El equipo necesita soporte en propuestas/objeciones; IA mejoraría calidad.", type: "likert" }
    ]},
    { id: "uso", name: "Uso Actual de IA", description: "Adopción en el día a día", questions: [
      { id: "U1", text: "Asistentes de IA para redactar emails/mensajes de alcance.", type: "likert" },
      { id: "U2", text: "IA en llamadas: transcripción, resúmenes y próximos pasos.", type: "likert" },
      { id: "U3", text: "Lead scoring/next-best-action activo en CRM.", type: "likert" },
      { id: "U4", text: "Actualizaciones automáticas al CRM (notas, actividades).", type: "likert" }
    ]},
    { id: "datos", name: "Datos y CRM", description: "Calidad, cobertura e integración", questions: [
      { id: "D1", text: "CRM con registros completos (campos clave ≥90%).", type: "likert" },
      { id: "D2", text: "Higiene de datos (duplicados, campos críticos, actividad).", type: "likert" },
      { id: "D3", text: "Integración IA↔CRM sin pasos manuales.", type: "likert" },
      { id: "D4", text: "Datasets para A/B tests y evaluación de modelos.", type: "likert" }
    ]},
    { id: "herramientas", name: "Herramientas y Automatización", description: "Orquestación en el flujo del vendedor", questions: [
      { id: "H1", text: "Herramientas de IA aprobadas y accesibles.", type: "likert" },
      { id: "H2", text: "Flujo con plantillas, snippets y atajos de IA.", type: "likert" },
      { id: "H3", text: "Resúmenes automáticos y sugerencias de próximos pasos.", type: "likert" },
      { id: "H4", text: "Automatizaciones multi-herramienta (correo, CRM, voz).", type: "likert" }
    ]},
    { id: "prompts", name: "Habilidades de Prompting", description: "Pedir y evaluar salidas de IA", questions: [
      { id: "P1", text: "Dominio de prompts (rol, objetivo, formato, tono, límites).", type: "likert" },
      { id: "P2", text: "Biblioteca de prompts por etapa (TOFU/MOFU/BOFU).", type: "likert" },
      { id: "P3", text: "Checklist de evaluación (fidelidad, relevancia, riesgo).", type: "likert" },
      { id: "P4", text: "Práctica e iteración con feedback estructurado.", type: "likert" }
    ]},
    { id: "procesos", name: "Procesos y Medición", description: "A/B testing y mejora continua", questions: [
      { id: "PR1", text: "A/B tests con y sin IA: asuntos, CTAs, secuencias.", type: "likert" },
      { id: "PR2", text: "Tableros por rep y caso de uso (respuesta, citas, win rate, ciclo).", type: "likert" },
      { id: "PR3", text: "Rituales semanales/mensuales de actualización de playbooks.", type: "likert" },
      { id: "PR4", text: "Etiquetado con/sin IA en oportunidades.", type: "likert" }
    ]},
    { id: "gobernanza", name: "Gobernanza y Seguridad", description: "Políticas, riesgos y cumplimiento", questions: [
      { id: "G1", text: "Políticas de PII/consentimiento y límites de uso de IA.", type: "likert" },
      { id: "G2", text: "Revisión humana para contenido sensible.", type: "likert" },
      { id: "G3", text: "Registro de riesgos y mitigaciones (alucinación, sesgo, cumplimiento).", type: "likert" },
      { id: "G4", text: "Auditorías periódicas y logs de uso.", type: "likert" }
    ]},
    { id: "impacto", name: "Impacto y ROI", description: "Resultados atribuibles a IA", questions: [
      { id: "I1", text: "Ahorro de tiempo por rep (≥20–30%).", type: "likert" },
      { id: "I2", text: "Aumento de respuesta y agendamientos.", type: "likert" },
      { id: "I3", text: "Mejora de win rate o ciclo (≥2 periodos).", type: "likert" },
      { id: "I4", text: "Caso financiero (ROI) establecido.", type: "likert" }
    ]}
  ]
}

export const scaleOptions = [
  { value: 1, text: "Nunca / No existe" },
  { value: 2, text: "A veces / Piloto aislado" },
  { value: 3, text: "Regular / Integración inicial" },
  { value: 4, text: "Consistente / Estándar de equipo" },
  { value: 5, text: "Avanzado / Automatizado y medido" }
]

export const getMaturityLevel = (score, totalMax) => {
  const q1 = 0.25 * totalMax, q2 = 0.50 * totalMax, q3 = 0.75 * totalMax
  if (score <= q1) return { label: "Explorador", color: "#ef4444", description: "Pilotos dispersos; enfócate en datos/CRM y 1–2 casos de uso tractables." }
  if (score <= q2) return { label: "Iniciado",   color: "#f59e0b", description: "Adopción inicial; formaliza playbooks, plantillas de prompt y medición." }
  if (score <= q3) return { label: "Integrador", color: "#3b82f6", description: "Fluye en el día a día; acelera A/B tests, automatiza CRM y QA." }
  return { label: "Orquestador", color: "#5bb878", description: "Optimización continua; escala automatizaciones y mide ROI por caso de uso." }
}

export const getAreaMaturityLevel = (areaScore, areaMax) => {
  const q1 = 0.25 * areaMax, q2 = 0.50 * areaMax, q3 = 0.75 * areaMax
  if (areaScore <= q1) return { label: "Explorador", color: "#ef4444", min: 0, max: q1 }
  if (areaScore <= q2) return { label: "Iniciado",   color: "#f59e0b", min: q1, max: q2 }
  if (areaScore <= q3) return { label: "Integrador", color: "#3b82f6", min: q2, max: q3 }
  return { label: "Orquestador", color: "#5bb878", min: q3, max: areaMax }
}
