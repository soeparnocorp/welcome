// src/App.tsx - id-readtalk
import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [checking, setChecking] = useState(true)

  // CEK COOKIE SAAT PERTAMA BUKA
  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})

    // Jika sudah pernah agree, langsung redirect
    if (cookies.readtalk_user === 'agreed') {
      window.location.href = 'https://public.soeparnocorp.workers.dev/'
    } else {
      setChecking(false) // Tampilkan tombol agree
    }
  }, [])

  const handleAgree = () => {
    setCount((count) => count + 1)
    
    // SET COOKIE - 10 tahun
    const farFuture = new Date()
    farFuture.setFullYear(farFuture.getFullYear() + 10)
    
    document.cookie = `readtalk_user=agreed; expires=${farFuture.toUTCString()}; path=/;`
    document.cookie = `user_id=user_${Date.now()}; expires=${farFuture.toUTCString()}; path=/;`
    document.cookie = `agreed_at=${new Date().toISOString()}; expires=${farFuture.toUTCString()}; path=/;`
    
    // Redirect ke main app
    window.location.href = 'https://public.soeparnocorp.workers.dev/'
  }

  if (checking) {
    return <div style={{ padding: '20px' }}>Memeriksa status...</div>
  }

  return (
    <>
      <div>
        <a href="#" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      
      <div className="content-wrapper">
        <h1>Welcome to READTalk</h1>
        
        <p className="terms-text">
          Read our <a href="#">Privacy Policies</a>. Tap "Agree and continue" 
          to accept our <a href="#">Terms of Service</a>.
        </p>

        <div className="language-selector">
          <span>English ▼</span>
        </div>

        <button 
          className="agree-button"
          onClick={handleAgree}
        >
          Agree and continue {count > 0 ? `(${count})` : ''}
        </button>

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
