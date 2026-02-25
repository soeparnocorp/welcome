import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Cek session saat halaman dimuat (seperti WhatsApp)
  useEffect(() => {
    const session = localStorage.getItem('readtalk_session')
    if (session) {
      const sessionData = JSON.parse(session)
      // Cek apakah session masih valid (24 jam)
      const sessionAge = Date.now() - new Date(sessionData.agreedAt).getTime()
      if (sessionAge < 24 * 60 * 60 * 1000) {
        console.log('Session masih valid, redirecting...')
        setIsRedirecting(true)
        setTimeout(() => {
          window.location.href = 'https://public.soeparnocorp.workers.dev/'
        }, 1500)
      }
    }
  }, [])

  const handleAgree = () => {
    setCount((count) => count + 1)
    setIsRedirecting(true)
    
    // Buat session untuk user
    const session = {
      userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      agreedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
      sessionToken: btoa(Date.now() + Math.random().toString(36))
    }
    
    // Simpan session di localStorage
    localStorage.setItem('readtalk_session', JSON.stringify(session))
    
    // Redirect ke aplikasi utama
    setTimeout(() => {
      window.location.href = 'https://public.soeparnocorp.workers.dev/'
    }, 500)
  }

  // Tampilan loading saat redirect
  if (isRedirecting) {
    return (
      <div className="redirecting">
        <div className="spinner"></div>
        <p>Mengalihkan ke aplikasi...</p>
        <style>{`
          .redirecting {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
