// App.tsx - dengan auto detect
import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(false)

  // 🔥 AUTO DETECTED URL PARAM
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');
    
    if (userId && email) {
      // PARAMETER → OpenAuth
      console.log('Auto-detect: User returning from OpenAuth', { userId, email });
      
      // Redirect check-parameter 
      window.location.href = `/authentication?${window.location.search}`;
    }
  }, []); // component mount

  const handleAgree = () => {
    setIsLoading(true)
    // Redirect
    window.location.href = '/authentication'
  }

  // Redirect
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
