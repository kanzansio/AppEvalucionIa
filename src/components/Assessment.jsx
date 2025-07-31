import React, { useEffect, useState } from 'react'
import { assessmentData, scaleOptions } from '../data/questions'

const STORAGE = 'ia-ventas-progress'

export default function Assessment({ onComplete }){
  const [areaIndex, setAreaIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentArea = assessmentData.areas[areaIndex]
  const currentQuestion = currentArea.questions[questionIndex]

  // load progress
  useEffect(() => {
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}')
      if(saved.answers) setAnswers(saved.answers)
      if(Number.isInteger(saved.areaIndex)) setAreaIndex(saved.areaIndex)
      if(Number.isInteger(saved.questionIndex)) setQuestionIndex(saved.questionIndex)
    }catch{}
  }, [])

  // save progress
  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify({ areaIndex, questionIndex, answers }))
  }, [areaIndex, questionIndex, answers])

  const totalQuestions = assessmentData.areas.reduce((acc,a)=>acc+a.questions.length,0)
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount/totalQuestions)*100)
  const currentQuestionNumber = assessmentData.areas.slice(0, areaIndex).reduce((acc, area) => acc + area.questions.length, 0) + questionIndex + 1

  const select = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  const next = () => {
    if(questionIndex < currentArea.questions.length - 1){
      setQuestionIndex(questionIndex + 1)
    } else if(areaIndex < assessmentData.areas.length - 1){
      setAreaIndex(areaIndex + 1)
      setQuestionIndex(0)
    } else {
      // finish assessment
      const areaScores = {}
      let totalScore = 0
      assessmentData.areas.forEach(area => {
        let sum = 0
        area.questions.forEach(q => { sum += answers[q.id] || 0 })
        areaScores[area.id] = sum
        totalScore += sum
      })
      localStorage.removeItem(STORAGE) // Clear progress
      onComplete({ answers, areaScores, totalScore, maxScore: totalQuestions * 5 })
    }
  }

  const prev = () => {
    if(questionIndex > 0) setQuestionIndex(questionIndex - 1)
    else if(areaIndex > 0){
      const prevArea = assessmentData.areas[areaIndex - 1]
      setAreaIndex(areaIndex - 1)
      setQuestionIndex(prevArea.questions.length - 1)
    }
  }

  const skip = () => next()

  const isAnswered = answers[currentQuestion.id] !== undefined
  const isFirstQuestion = areaIndex === 0 && questionIndex === 0
  const isLastQuestion = areaIndex === assessmentData.areas.length - 1 && questionIndex === currentArea.questions.length - 1

  const getOptionIcon = (value) => {
    const icons = ['❌', '⚠️', '⏸️', '✅', '🚀']
    return icons[value - 1] || '⭕'
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header con progreso */}
        <div className="vstack" style={{ marginBottom: 32 }}>
          <div className="hstack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="hstack" style={{ gap: 8 }}>
              <img src="https://iven.academy/wp-content/uploads/2023/03/Asset-3-2.svg" alt="IVen Academy" style={{ height: 32 }} />
              <div style={{ fontWeight: 700, fontSize: '18px' }}>Evaluación IA en Ventas</div>
            </div>
            <div className="badge" style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 700 }}>
              {currentQuestionNumber}/{totalQuestions} · {progress}%
            </div>
          </div>
          
          <div className="progress" style={{ height: 8 }}>
            <div style={{ 
              width: progress + '%',
              background: 'linear-gradient(90deg, #2563eb, #10b981)'
            }} />
          </div>
          
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--muted)', 
            textAlign: 'center',
            marginTop: 8
          }}>
            {answeredCount} de {totalQuestions} respondidas
          </div>
        </div>

        {/* Área actual */}
        <div className="vstack" style={{ marginBottom: 32 }}>
          <div className="hstack" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ 
              background: '#eff6ff', 
              color: '#2563eb',
              padding: '8px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              ÁREA {areaIndex + 1} DE {assessmentData.areas.length}
            </div>
            <div style={{ 
              background: '#f0fdf4', 
              color: '#16a34a',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600
            }}>
              {questionIndex + 1}/{currentArea.questions.length}
            </div>
          </div>
          
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 8
          }}>
            {currentArea.name}
          </h2>
          
          <p style={{ 
            color: 'var(--muted)', 
            margin: 0,
            fontSize: '16px',
            lineHeight: 1.5
          }}>
            {currentArea.description}
          </p>
        </div>

        {/* Pregunta actual */}
        <div className="vstack" style={{ marginBottom: 32 }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 700, 
            marginBottom: 24,
            lineHeight: 1.4,
            color: 'var(--text)'
          }}>
            {currentQuestion.text}
          </div>
          
          <div className="vstack" style={{ gap: 12 }}>
            {scaleOptions.map(opt => {
              const selected = answers[currentQuestion.id] === opt.value
              return (
                <div 
                  key={opt.value} 
                  className={'question ' + (selected ? 'selected' : '')} 
                  onClick={() => select(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selected ? '2px solid #2563eb' : '1px solid var(--border)',
                    background: selected ? '#eff6ff' : 'white',
                    boxShadow: selected ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none'
                  }}
                >
                  <div style={{ 
                    fontSize: '24px',
                    minWidth: '32px',
                    textAlign: 'center'
                  }}>
                    {getOptionIcon(opt.value)}
                  </div>
                  <div className="vstack" style={{ gap: 4, flex: 1 }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '16px',
                      color: selected ? '#2563eb' : 'var(--text)'
                    }}>
                      {opt.value}. {opt.text}
                    </div>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: selected ? '6px solid #2563eb' : '2px solid var(--border)',
                    background: selected ? 'white' : 'transparent',
                    transition: 'all 0.2s ease'
                  }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Navegación */}
        <div className="hstack" style={{ justifyContent: 'space-between', marginTop: 32 }}>
          <button 
            className="btn secondary" 
            onClick={prev} 
            disabled={isFirstQuestion}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: isFirstQuestion ? 0.5 : 1
            }}
          >
            ← Anterior
          </button>
          
          <div className="hstack" style={{ gap: 12 }}>
            <button 
              className="btn ghost" 
              onClick={skip}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              Omitir ⏭️
            </button>
            
            <button 
              className="btn" 
              onClick={next}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isAnswered ? '#10b981' : '#2563eb'
              }}
            >
              {isLastQuestion ? '🏁 Finalizar' : 'Siguiente →'}
            </button>
          </div>
        </div>

        {/* Indicador de progreso por área */}
        <div style={{ 
          marginTop: 32,
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            marginBottom: 12,
            color: 'var(--text)'
          }}>
            Progreso por área:
          </div>
          
          <div className="hstack" style={{ gap: 8, flexWrap: 'wrap' }}>
            {assessmentData.areas.map((area, idx) => {
              const areaAnswered = area.questions.filter(q => answers[q.id] !== undefined).length
              const areaTotal = area.questions.length
              const areaProgress = Math.round((areaAnswered / areaTotal) * 100)
              const isCurrent = idx === areaIndex
              const isCompleted = areaProgress === 100
              
              return (
                <div 
                  key={area.id}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: isCurrent ? '#2563eb' : isCompleted ? '#10b981' : '#e2e8f0',
                    color: isCurrent || isCompleted ? 'white' : 'var(--muted)',
                    border: isCurrent ? '2px solid #1d4ed8' : 'none'
                  }}
                >
                  {area.name.split(' ')[0]} {areaAnswered}/{areaTotal}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
