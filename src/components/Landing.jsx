import React, { useState } from 'react'

const LOGO = "https://iven.academy/wp-content/uploads/2023/03/Asset-3-2.svg"

export default function Landing({ onStart }){
  const [form, setForm] = useState({ name:'', email:'', company:'', role:'', teamSize:'1-5' })
  const [err, setErr] = useState({})

  const validate = () => {
    const e = {}
    if(!form.name.trim()) e.name = 'Requerido'
    if(!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email inválido'
    if(!form.company.trim()) e.company = 'Requerido'
    if(!form.role.trim()) e.role = 'Requerido'
    setErr(e)
    return Object.keys(e).length === 0
  }

  const submit = () => { if(validate()) onStart(form) }

  return (
    <div className="hero">
      <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
        {/* Logo y Header */}
        <div className="vstack" style={{ alignItems: 'center', marginBottom: 32 }}>
          <img src={LOGO} alt="IVen Academy" style={{ height: 56, marginBottom: 24 }} />
          <h1 style={{ 
            margin: 0, 
            fontSize: '32px', 
            fontWeight: 800, 
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 16
          }}>
            ¿Qué tan preparada está tu{' '}
            <span style={{ color: '#5bb878' }}>área de ventas</span>{' '}
            para la{' '}
            <span style={{ color: '#5bb878' }}>IA</span>?
          </h1>
          <p style={{ 
            color: 'var(--muted)', 
            textAlign: 'center', 
            fontSize: '16px',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '500px'
          }}>
            Evalúa el <strong>uso actual</strong> y la <strong>necesidad</strong> de IA en tu proceso comercial y recibe un plan 30/60/90 para mejorar prospección, calificación, propuestas y cierre.
          </p>
        </div>

        <div className="hr" style={{ margin: '32px 0' }}></div>

        {/* Formulario */}
        <div className="vstack" style={{ gap: 20 }}>
          {/* Primera fila */}
          <div className="row">
            <div className="vstack" style={{ gap: 8 }}>
              <label className="label">Nombre *</label>
              <input 
                className="input" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="Tu nombre completo"
                style={{ fontSize: '14px' }}
              />
              {err.name && <small style={{ color: '#ef4444', fontSize: '12px' }}>{err.name}</small>}
            </div>
            <div className="vstack" style={{ gap: 8 }}>
              <label className="label">Email *</label>
              <input 
                className="input" 
                type="email"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                placeholder="tu.email@empresa.com"
                style={{ fontSize: '14px' }}
              />
              {err.email && <small style={{ color: '#ef4444', fontSize: '12px' }}>{err.email}</small>}
            </div>
          </div>

          {/* Segunda fila */}
          <div className="row">
            <div className="vstack" style={{ gap: 8 }}>
              <label className="label">Empresa *</label>
              <input 
                className="input" 
                value={form.company} 
                onChange={e => setForm({ ...form, company: e.target.value })} 
                placeholder="Nombre de tu empresa"
                style={{ fontSize: '14px' }}
              />
              {err.company && <small style={{ color: '#ef4444', fontSize: '12px' }}>{err.company}</small>}
            </div>
            <div className="vstack" style={{ gap: 8 }}>
              <label className="label">Cargo *</label>
              <input 
                className="input" 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })} 
                placeholder="Ej. Head of Sales, Director Comercial"
                style={{ fontSize: '14px' }}
              />
              {err.role && <small style={{ color: '#ef4444', fontSize: '12px' }}>{err.role}</small>}
            </div>
          </div>

          {/* Tercera fila */}
          <div className="row">
            <div className="vstack" style={{ gap: 8 }}>
              <label className="label">Tamaño del equipo de ventas</label>
              <select 
                className="select" 
                value={form.teamSize} 
                onChange={e => setForm({ ...form, teamSize: e.target.value })}
                style={{ fontSize: '14px' }}
              >
                <option value="1-5">1–5 personas</option>
                <option value="6-15">6–15 personas</option>
                <option value="16-50">16–50 personas</option>
                <option value="51+">51+ personas</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button 
                className="btn" 
                onClick={submit}
                style={{ 
                  width: '100%', 
                  padding: '14px 24px',
                  fontSize: '16px',
                  fontWeight: 700
                }}
              >
                🚀 Empezar evaluación
              </button>
            </div>
          </div>
        </div>

        {/* Footer con información */}
        <div className="vstack" style={{ marginTop: 32, gap: 16 }}>
          <div className="hr"></div>
          
          <div className="vstack" style={{ gap: 12, alignItems: 'center' }}>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--muted)', 
              textAlign: 'center',
              lineHeight: 1.5
            }}>
              ⏱️ <strong>Duración:</strong> 5–7 minutos<br/>
              📊 <strong>Resultado:</strong> Diagnóstico completo y plan 30/60/90<br/>
              🔒 <strong>Privacidad:</strong> Tus datos están protegidos
            </div>
            
            <div className="hstack" style={{ 
              justifyContent: 'center', 
              gap: 24, 
              fontSize: '12px', 
              color: 'var(--muted)',
              flexWrap: 'wrap'
            }}>
              <div className="hstack" style={{ gap: 8 }}>
                <span>✅</span>
                <span>Sin spam</span>
              </div>
              <div className="hstack" style={{ gap: 8 }}>
                <span>✅</span>
                <span>Reporte gratuito</span>
              </div>
              <div className="hstack" style={{ gap: 8 }}>
                <span>✅</span>
                <span>Consulta opcional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial o trust indicators */}
        <div style={{ 
          marginTop: 24,
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontStyle: 'italic', 
            color: 'var(--muted)',
            marginBottom: 8
          }}>
            "Esta evaluación nos ayudó a identificar exactamente dónde enfocar nuestros esfuerzos en IA"
          </div>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: 'var(--text)'
          }}>
             <strong>Aldo Malpica</strong> • Fundador de Ivenn Academy<br/>
          </div>
        </div>
      </div>
      
      {/* Footer con créditos */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 1.4
      }}>
       
        Programado y diseñado por <strong>Kanzansio.digital</strong> • Powered by IA
      </div>
    </div>
  )
}
