import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [showAgree, setShowAgree] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // token localStorage
    const token = localStorage.getItem('readtalk_token')

    if (token) {
      setIsLoggedIn(true)
      setShowAgree(false)
    } else {
      // login → Agree
      setShowAgree(true)

      // redirect callback OpenAuth
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code) {
        // Simulasikan exchange code → dapat token
        localStorage.setItem('readtalk_token', code)
        setIsLoggedIn(true)
        setShowAgree(false)
        // Bersihkan URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  const handleAgree = () => {
    // Redirect ke OpenAuth
    const openAuthUrl = "https://openauth.soeparnocorp.workers.dev/password/authorize"
    const redirectUri = encodeURIComponent("https://id-readtalk.pages.dev/")
    window.location.href = `${openAuthUrl}?redirect_uri=${redirectUri}`
  }

  return (
    <>
      <div>
        <a href="#" target="_blank">
          <img src={viteLogo} className="logo spin" alt="Vite logo" />
        </a>
      </div>
      <h1>Welcome to READTalk</h1>
      <div className="card">
        <p>
          Read our <code>Privacy Policies</code> Tap "Agree and 
          continue" to accept our <code>Terms of Service</code>
        </p>

        {showAgree && (
          <button onClick={handleAgree}>
            Agree and Continue
          </button>
        )}

        {isLoggedIn && !showAgree && (
          <p>Login berhasil! Selamat datang di READTalk.</p>
        )}
      </div>
      <p className="read-the-docs">
        © 2026 SOEPARNO ENTERPRISE Corp.
      </p>
    </>
  )
}

export default App
