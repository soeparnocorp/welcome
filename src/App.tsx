// src/App.tsx
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const handleAgree = async () => {
    try {
      const res = await fetch('/functions/auth.ts', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        // redirect ke Room SPA
        window.location.href = '/room.html'
      } else {
        alert('Auth failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Auth request failed', err)
      alert('Auth request failed')
    }
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
