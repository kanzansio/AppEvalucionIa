import React, { useRef } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { assessmentData, getMaturityLevel, getAreaMaturityLevel } from '../data/questions'
import { generateRecommendations } from '../data/recommendations'

export default function Results({ user, results, onRestart }){
  const { totalScore, areaScores, maxScore } = results
  const maturity = getMaturityLevel(totalScore, maxScore)
  const recos = generateRecommendations(areaScores)

  const radarData = assessmentData.areas.map(area => ({
    area: area.name.split(' ')[0],
    fullName: area.name,
    score: areaScores[area.id] || 0,
    max: area.questions.length * 5
  }))

  const barData = assessmentData.areas.map(area => ({
    name: area.name.split(' ')[0],
    score: areaScores[area.id] || 0,
    max: area.questions.length * 5
  }))

  const refReport = useRef(null)
  const downloadPDF = async () => {
    const el = refReport.current
    const canvas = await html2canvas(el, { scale: 2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p','mm','a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgProps = pdf.getImageProperties(img)
    const ratio = imgProps.width / imgProps.height
    const pdfWidth = pageWidth - 20
    const pdfHeight = pdfWidth / ratio
    pdf.addImage(img, 'PNG', 10, 10, pdfWidth, pdfHeight)
    pdf.save('diagnostico-ia-ventas.pdf')
  }

  // Calcular fortalezas principales y oportunidades clave
  const strengths = assessmentData.areas
    .map(area => ({
      ...area,
      score: areaScores[area.id] || 0,
      max: area.questions.length * 5,
      percentage: Math.round(((areaScores[area.id] || 0) / (area.questions.length * 5)) * 100)
    }))
    .filter(area => area.percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage)

  const opportunities = assessmentData.areas
    .map(area => ({
      ...area,
      score: areaScores[area.id] || 0,
      max: area.questions.length * 5,
      percentage: Math.round(((areaScores[area.id] || 0) / (area.questions.length * 5)) * 100)
    }))
    .filter(area => area.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage)

  const getScoreColor = (percentage) => {
    if (percentage >= 75) return '#10b981'
    if (percentage >= 50) return '#3b82f6'
    if (percentage >= 25) return '#f59e0b'
    return '#ef4444'
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="vstack" style={{ gap: 24 }} ref={refReport}>
      {/* Header del diagnóstico */}
      <div className="results-header">
        <div className="hstack" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div className="vstack" style={{ gap: 8, textAlign: 'left' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
              Diagnóstico de Madurez del Equipo de Ventas
            </h1>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>
              {user.name} • {user.company} • {formatDate()}
            </div>
          </div>
          <div className="hstack" style={{ gap: 16 }}>
            <button className="btn secondary" onClick={onRestart} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
              Nueva evaluación
            </button>
            <button className="btn" onClick={downloadPDF} style={{ background: 'white', color: '#667eea' }}>
              📄 Descargar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Puntuación Total y Overview */}
      <div className="grid-3">
        <div className="score-card">
          <div className="score-main" style={{ color: maturity.color }}>
            {totalScore}/{maxScore}
          </div>
          <div className="score-label" style={{ color: maturity.color }}>
            {maturity.label}
          </div>
          <div className="score-description">
            {maturity.description}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">📊 Principales Fortalezas</div>
          <div className="vstack" style={{ gap: 8 }}>
            {strengths.slice(0, 3).map(area => (
              <div key={area.id} className="hstack" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{area.name.split(' ')[0]}</span>
                <span style={{ color: getScoreColor(area.percentage), fontWeight: 700 }}>
                  {area.score}/{area.max}
                </span>
              </div>
            ))}
            {strengths.length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                Tu equipo tiene grandes oportunidades de crecimiento en todas las áreas
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-title">🎯 Oportunidades Clave</div>
          <div className="vstack" style={{ gap: 8 }}>
            {opportunities.slice(0, 3).map(area => (
              <div key={area.id} className="hstack" style={{ justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{area.name.split(' ')[0]}</span>
                <span style={{ color: getScoreColor(area.percentage), fontWeight: 700 }}>
                  {area.score}/{area.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perfil de Madurez y Puntuación Detallada */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title">
            <div className="section-icon icon-strengths">📈</div>
            Perfil de Madurez por Área
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 20 }}>
            Visualización general del nivel de tu equipo en cada área evaluada
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar 
                  name="Puntaje" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  fill="#2563eb" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <div className="section-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📊</div>
            Puntuación Detallada por Área
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 20 }}>
            Comparación directa del rendimiento en cada área
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análisis Detallado por Área */}
      <div className="analysis-section">
        <div className="section-title">
          <div className="section-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>🔍</div>
          Análisis Detallado por Área
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 20 }}>
          Evaluación específica y nivel de madurez de cada área
        </div>
        
        <div className="grid-2">
          {assessmentData.areas.map(area => {
            const score = areaScores[area.id] || 0
            const max = area.questions.length * 5
            const percentage = Math.round((score / max) * 100)
            const level = getAreaMaturityLevel(score, max)
            
            return (
              <div key={area.id} className="area-analysis-card">
                <div className="area-header">
                  <div className="area-title">{area.name}</div>
                  <div className={`badge status-${level.label.toLowerCase()}`}>
                    {level.label}
                  </div>
                </div>
                
                <div className="area-score">
                  <span style={{ fontWeight: 700, fontSize: '18px', color: level.color }}>
                    {score}/{max}
                  </span>
                  <span style={{ color: 'var(--muted)' }}>({percentage}%)</span>
                </div>
                
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${level.color}, ${level.color}dd)`
                    }} 
                  />
                </div>
                
                <div className="area-description">
                  {area.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Plan de Acción Recomendado */}
      <div className="patterns-section">
        <div className="section-title">
          <div className="section-icon" style={{ background: '#fed7d7', color: '#e53e3e' }}>⚠️</div>
          Plan de Acción Recomendado
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 20 }}>
          Recomendaciones priorizadas basadas en tu evaluación
        </div>

        <div className="vstack" style={{ gap: 16 }}>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: 8 }}>Patrones Identificados</div>
          
          {recos.top3.slice(0, 2).map((pattern, idx) => (
            <div key={pattern.areaId} className={`pattern-item ${pattern.priority.toLowerCase()}`}>
              <div className="pattern-title">
                <span>{idx === 0 ? 'Desbalance habilidades' : 'Riesgo de burnout'}</span>
                <div className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>
                  ALTA
                </div>
              </div>
              <div className="pattern-description">
                {idx === 0 
                  ? `Excelentes habilidades de comunicación que no se están capitalizando en el cierre. Enfócate en ${pattern.areaName.toLowerCase()}.`
                  : `El bajo desarrollo personal puede impactar la retención de talento y el rendimiento a largo plazo.`
                }
              </div>
              <div className="pattern-recommendation">
                <strong>Recomendación:</strong> {idx === 0 
                  ? `Especialización en técnicas de ${pattern.areaName.toLowerCase()}`
                  : 'Programa de desarrollo personal y bienestar'
                }
              </div>
            </div>
          ))}
        </div>

        <div className="vstack" style={{ gap: 16, marginTop: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: 8 }}>Prioridades Inmediatas</div>
          
          {recos.top3.map((priority, idx) => (
            <div key={priority.areaId} className="card" style={{ border: `2px solid ${idx === 0 ? '#dc2626' : idx === 1 ? '#ea580c' : '#ca8a04'}` }}>
              <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>
                  {priority.areaName}
                </div>
                <div className="hstack" style={{ gap: 8 }}>
                  <div className="badge" style={{ 
                    background: idx === 0 ? '#fee2e2' : idx === 1 ? '#fed7aa' : '#fef3c7',
                    color: idx === 0 ? '#dc2626' : idx === 1 ? '#ea580c' : '#ca8a04'
                  }}>
                    {priority.priority}
                  </div>
                  <div className="badge">
                    {priority.timeline}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 12 }}>
                Optimizar estrategia de {priority.areaName.toLowerCase()} multicanal
              </div>
              
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 8 }}>
                Acciones Recomendadas:
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: '14px', lineHeight: 1.6 }}>
                {priority.actions.map((action, actionIdx) => (
                  <li key={actionIdx} style={{ marginBottom: 4 }}>
                    {action}
                  </li>
                ))}
              </ul>
              
              <div className="hstack" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
                <button className="btn ghost" style={{ fontSize: '12px', padding: '8px 16px' }}>
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: 12 }}>
          ¿Listo para llevar tu equipo al siguiente nivel?
        </div>
        <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: 24, maxWidth: '600px', margin: '0 auto 24px' }}>
          Nuestros expertos pueden ayudarte a implementar estas recomendaciones con programas de 
          formación personalizados para tu equipo.
        </div>
        <div className="hstack" style={{ justifyContent: 'center', gap: 16 }}>
          <button className="btn" style={{ background: 'white', color: '#667eea', fontWeight: 700 }}>
            📅 Agendar Consulta Gratuita
          </button>
          <button className="btn ghost" style={{ border: '2px solid white', color: 'white' }}>
            👥 Ver Programas de Formación
          </button>
          <button className="btn ghost" style={{ border: '2px solid white', color: 'white' }} onClick={onRestart}>
            🔄 Realizar Nueva Evaluación
          </button>
        </div>
      </div>
    </div>
  )
}
