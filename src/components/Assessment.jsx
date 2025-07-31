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
          </div
