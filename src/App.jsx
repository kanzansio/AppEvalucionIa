import React, { useState } from 'react'
import Landing from './components/Landing'
import Assessment from './components/Assessment'
import Results from './components/Results'

export default function App(){
  const [step, setStep] = useState('landing')
  const [user, setUser] = useState(null)
  const [results, setResults] = useState(null)

  const start = (info) => { setUser(info); setStep('assessment') }
  const complete = (res) => { setResults(res); setStep('results') }
  const restart = () => { setUser(null); setResults(null); setStep('landing') }

  return (
    <div className="container">
      {step === 'landing' && <Landing onStart={start} />}
      {step === 'assessment' && <Assessment onComplete={complete} />}
      {step === 'results' && <Results user={user} results={results} onRestart={restart} />}
    </div>
  )
}
