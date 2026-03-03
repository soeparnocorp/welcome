// src/App.tsx
import { useState, useEffect, useRef } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [showAuth, setShowAuth] = useState(false)
  const popupRef = useRef<Window | null>(null)
  const checkIntervalRef = useRef<number>()

  // Listen untuk pesan dari popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LOGIN_SUCCESS') {
        // Sembunyikan overlay
        setShowAuth(false)
        
        // Bersihkan interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current)
        }
        
        // Redirect ke account
        window.location.href = '/account.html'
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleAgree = () => {
    setCount(c => c + 1)
    
    // Tampilkan overlay dulu
    setShowAuth(true)
    
    // Kasih sedikit delay biar smooth
    setTimeout(() => {
      // Buka popup tapi disembunyikan
      const width = 500
      const height = 600
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      // Bikin popup tanpa toolbar, tanpa title bar, tapi diposisikan di belakang
      const popup = window.open(
        '/auth', 
        '_blank', // Pake _blank biar gak muncul sebagai popup
        `width=${width},height=${height},left=${left},top=${top},popup=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1`
      )

      popupRef.current = popup

      // Cek terus apakah popup ditutup paksa
      checkIntervalRef.current = window.setInterval(() => {
        if (popup?.closed) {
          setShowAuth(false)
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current)
          }
        }
      }, 500)
    }, 100)
  }

  // Bersihkan interval saat component unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

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
          Read our <a href="https://readtalk.pages.dev/">Privacy Policies</a>. Tap "Agree and continue" 
          to accept our <a href="https://readtalk.pages.dev/">Terms of Service</a>.
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

      {/* OVERLAY MODAL - INI YANG KELIHATAN, BUKAN POPUPNYA */}
      {showAuth && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-modal-header">
              <h2>Sign in to READTalk</h2>
              <button 
                className="close-button"
                onClick={() => {
                  setShowAuth(false)
                  popupRef.current?.close()
                }}
              >✕</button>
            </div>
            <div className="auth-modal-content">
              <div className="loading-spinner"></div>
              <p>Loading authentication page...</p>
              <p className="hint">You may see a new window briefly - that's normal!</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
