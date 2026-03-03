import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAgree = () => {
    setIsLoading(true)
    
    // Redirect ke pages function /auth
    window.location.href = '/auth'
    
    // Note: Setelah redirect, component ini akan unmount
    // Jadi setIsLoading(false) gak akan pernah dieksekusi
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
          disabled={isLoading}
        >
          {isLoading ? 'Redirecting...' : 'Agree and continue'}
        </button>

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
