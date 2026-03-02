import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/session')
        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(true)
          setUserEmail(data.user.email)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }
    checkSession()
  }, [])

  const handleAgree = () => {
    const openAuthUrl = 'https://openauth.soeparnocorp.workers.dev'
    const redirectUri = 'https://id-readtalk.pages.dev/callback'
    const clientId = 'your-client-id'
    
    window.location.href = `${openAuthUrl}/authorize?` + new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code'
    })
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
        
        {isAuthenticated ? (
          <div className="user-profile">
            <p>Welcome, {userEmail}!</p>
            <p>You have successfully agreed to the terms.</p>
          </div>
        ) : (
          <p className="terms-text">
            Read our <a href="https://readtalk.pages.dev/">Privacy Policies</a>. Tap "Agree and continue" 
            to accept our <a href="https://readtalk.pages.dev/">Terms of Service</a>.
          </p>
        )}

        <div className="language-selector">
          <span>English ▼</span>
        </div>

        {!isAuthenticated && (
          <button 
            className="agree-button"
            onClick={handleAgree}
          >
            Agree and continue
          </button>
        )}

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
