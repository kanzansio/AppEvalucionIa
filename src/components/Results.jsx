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
    const canvas = await html2canvas(el, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      windowHeight: el.scrollHeight
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save('diagnostico-ia-ventas.pdf')
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 75) return '#5bb878'
    if (percentage >= 50) return '#1e3a5f'
    if (percentage >= 25) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="card" ref={refReport}>
      <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="section-title">
          <div className="section-icon" style={{ background: '#e0f2fe', color: '#1e3a5f' }}>📄</div>
          Resultado del Diagnóstico
        </div>
        <div className="hstack" style={{ gap: 8 }}>
          <button className="btn btn-outline" onClick={onRestart} style={{ background: 'white', color: '#1e3a5f' }}>
            Reiniciar
          </button>
          <button className="btn btn-primary" onClick={downloadPDF}>
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="vstack" style={{ gap: 12, marginBottom: 24 }}>
        <div style={{ fontWeight: 700 }}>Nivel de Madurez</div>
        <div className="hstack" style={{ alignItems: 'center', gap: 12 }}>
          <div className="badge" style={{ background: '#f1f5f9', color: '#1e293b' }}>
            Total: {totalScore} / {maxScore}
          </div>
          <div className="badge" style={{ background: '#eafaf0', color: '#166534' }}>
            {maturity.label}
          </div>
        </div>
        <div style={{ color: 'var(--muted)' }}>{maturity.description}</div>
      </div>

      {/* Radar */}
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="section-title">
          <div className="section-icon" style={{ background: '#dcfce7', color: '#166534' }}>📡</div>
          Vista General (Radar)
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" />
              <PolarRadiusAxis angle={30} domain={[0, Math.max(...radarData.map(d => d.max))]} />
              <Radar dataKey="score" stroke="#5bb878" fill="#5bb878" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barras */}
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="section-title">
          <div className="section-icon" style={{ background: '#dbeafe', color: '#1e3a5f' }}>📊</div>
          Puntuación por Área
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#5bb878" name="Puntaje" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prioridades */}
      <div className="card" style={{ padding: 16 }}>
        <div className="section-title">
          <div className="section-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>⚠️</div>
          Prioridades Inmediatas
        </div>
        <div className="vstack" style={{ gap: 12 }}>
          {recos.top3.map((item, idx) => (
            <div key={item.areaId} className="hstack" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.areaName}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {item.actions[0]}
                </div>
              </div>
              <div className="badge" style={{ background: '#fef3c7', color: getScoreColor(item.percentage) }}>
                {item.priority} • {item.timeline}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="no-print" style={{
        padding: '24px 0 8px 0',
        textAlign: 'center',
        marginTop: '24px'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--muted)',
          lineHeight: 1.6,
          opacity: 0.7
        }}>
          Desarrollado por <strong>Aldo Malpica</strong> • Fundador de IVen Academy<br/>
          Programado y diseñado por <strong>Kanzansio.digital</strong> • Powered by IA
        </div>
      </div>
    </div>
  )
}