import React, { useEffect, useState } from 'react'
import { assessmentData, scaleOptions } from '../data/questions'

const STORAGE = 'ia-ventas-progress'

export default function Assessment({ onComplete }){
  const [areaIndex, setAreaIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: value }

  const currentArea = assessmentData.areas[areaIndex]
  const currentQuestion = currentArea.questions[questionIndex]

  // Cargar progreso
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE)
      if (raw) {
        const data = JSON.parse(raw)
        if (data && data.answers) {
          setAnswers(data.answers || {})
          setAreaIndex(data.areaIndex || 0)
          setQuestionIndex(data.questionIndex || 0)
        }
      }
    } catch (e) {
      console.warn('No se pudo cargar el progreso', e)
    }
  }, [])

  // Guardar progreso
  useEffect(() => {
    const payload = { answers, areaIndex, questionIndex }
    localStorage.setItem(STORAGE, JSON.stringify(payload))
  }, [answers, areaIndex, questionIndex])

  const totalQuestions = assessmentData.areas.reduce((acc, a) => acc + a.questions.length, 0)
  const answeredCount = Object.keys(answers).length

  const setAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }))
  }

  const goNext = () => {
    if (questionIndex < currentArea.questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
    } else if (areaIndex < assessmentData.areas.length - 1) {
      setAreaIndex(areaIndex + 1)
      setQuestionIndex(0)
    } else {
      finish()
    }
  }

  const goPrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1)
    } else if (areaIndex > 0) {
      const prevArea = assessmentData.areas[areaIndex - 1]
      setAreaIndex(areaIndex - 1)
      setQuestionIndex(prevArea.questions.length - 1)
    }
  }

  const skip = () => {
    goNext()
  }

  const finish = () => {
    const areaScores = {}
    assessmentData.areas.forEach(area => {
      const sum = area.questions.reduce((acc, q) => acc + (answers[q.id] || 0), 0)
      areaScores[area.id] = sum
    })
    const totalScore = Object.values(areaScores).reduce((a,b) => a + b, 0)
    const maxScore = assessmentData.areas.reduce((acc, area) => acc + area.questions.length * 5, 0)

    const result = { answers, areaScores, totalScore, maxScore }
    localStorage.removeItem(STORAGE)
    onComplete(result)
  }

  return (
    <div className="card">
      {/* Progreso */}
      <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="section-title">
          <div className="section-icon" style={{ background: '#e0f2fe', color: '#1e3a5f' }}>📝</div>
          Evaluación de IA en Ventas
        </div>
        <div className="badge" style={{ background: '#f1f5f9', color: '#1e293b' }}>
          {answeredCount} de {totalQuestions} respondidas
        </div>
      </div>

      {/* Área actual */}
      <div className="vstack" style={{ marginBottom: 24 }}>
        <div className="hstack" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div className="badge" style={{ background: '#f0fdf4', color: '#166534' }}>
            {currentArea.name}
          </div>
          <div style={{ color: 'var(--muted)' }}>{currentArea.description}</div>
        </div>

        <div className="question-box">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            {currentQuestion.text}
          </div>
          <div className="hstack" style={{ gap: 8, flexWrap: 'wrap' }}>
            {scaleOptions.map(opt => (
              <button
                key={opt.value}
                className={`btn ${answers[currentQuestion.id] === opt.value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setAnswer(currentQuestion.id, opt.value)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="hstack" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-outline" onClick={goPrev} disabled={areaIndex === 0 && questionIndex === 0}>
          ← Anterior
        </button>
        <div className="hstack" style={{ gap: 8 }}>
          <button className="btn btn-ghost" onClick={skip}>Saltar</button>
          {areaIndex === assessmentData.areas.length - 1 && questionIndex === currentArea.questions.length - 1 ? (
            <button className="btn btn-primary" onClick={finish} disabled={!answers[currentQuestion.id]}>
              Finalizar
            </button>
          ) : (
            <button className="btn btn-primary" onClick={goNext} disabled={!answers[currentQuestion.id]}>
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}