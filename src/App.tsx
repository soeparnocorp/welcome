import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [showAgree, setShowAgree] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (code && state) {
      // simpan token
      localStorage.setItem('readtalk_token', code)
      localStorage.setItem('readtalk_state', state)
      setShowAgree(false)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (localStorage.getItem('readtalk_token')) {
      setShowAgree(false)
    }
  }, [])

  const handleAgree = () => {
    if (!localStorage.getItem('readtalk_token')) {
      const state = crypto.randomUUID()
      localStorage.setItem('readtalk_state_temp', state)
      const redirectUri = encodeURIComponent("https://id-readtalk.pages.dev/")
      const openAuthUrl = `https://openauth.soeparnocorp.workers.dev/authorize?redirect_uri=${redirectUri}&state=${state}`
      window.location.href = openAuthUrl
    }
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
      </div>
      <p className="read-the-docs">
        © 2026  SOEPARNO ENTERPRISE Corp.
      </p>
    </>
  )
}

export default App
