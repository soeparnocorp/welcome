// src/App.tsx - id-readtalk
import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // CEK: Apakah user baru logout dari main app?
    const justLoggedOut = sessionStorage.getItem('justLoggedOut')
    if (justLoggedOut) {
      sessionStorage.removeItem('justLoggedOut')
      // Tampilkan pesan atau tidak perlu
    }

    // CEK: Apakah masih punya session?
    const session = localStorage.getItem('readtalk_session')
    if (session) {
      const sessionData = JSON.parse(session)
      const sessionAge = Date.now() - new Date(sessionData.agreedAt).getTime()
      
      // Jika session masih fresh (< 24 jam), langsung redirect ke main app
      if (sessionAge < 24 * 60 * 60 * 1000) {
        setIsRedirecting(true)
        setTimeout(() => {
          window.location.href = 'https://public.soeparnocorp.workers.dev/'
        }, 500) // Delay kecil biar smooth
      }
    }
  }, [])

  const handleAgree = () => {
    setCount((count) => count + 1)
    setIsRedirecting(true)
    
    // Buat session baru
    const session = {
      userId: 'user_' + Date.now(),
      agreedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent
    }
    
    localStorage.setItem('readtalk_session', JSON.stringify(session))
    
    // Redirect ke main app
    setTimeout(() => {
      window.location.href = 'https://public.soeparnocorp.workers.dev/'
    }, 300)
  }

  if (isRedirecting) {
    return (
      <div className="redirecting">
        <div className="spinner"></div>
        <p>Memasuki aplikasi...</p>
        <style>{`
          .redirecting {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff0000;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
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
