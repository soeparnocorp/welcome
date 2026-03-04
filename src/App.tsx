// App.tsx - dengan auto detect
import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)

  // DETECT URL PARAMETERS
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');
    
    if (userId && email) {
      // ADA PARAMETER → user baru balik dari OpenAuth
      console.log('Auto-detect: User returning from OpenAuth', { userId, email });
      
      // Redirect ke check-login dengan parameter yang sama
      window.location.href = `/account${window.location.search}`;
    }
  }, []); // Kosong = jalan sekali pas component mount

  const handleAgree = () => {
    setIsLoading(true)
    // Redirect ke halaman login (untuk user baru)
    window.location.href = '/api/login'
  }

  // Kalo lagi redirect, jangan render apa-apa
  if (window.location.search.includes('userId')) {
    return <div>Redirecting...</div>;
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
