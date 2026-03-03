// src/App.tsx
import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [agreed, setAgreed] = useState(false)

  const handleAgree = () => {
    // tandai bahwa user sudah klik Agree
    setAgreed(true)
    console.log('User agreed!')

    // redirect ke halaman after-login (placeholder)
    window.location.href = '/room.html'
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
          Agree and continue
        </button>

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
