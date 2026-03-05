// App.tsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './pages/Home'
import Profile from './pages/profile'
import Settings from './pages/settings'

function Landing() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // AUTO DETECT URL PARAMETERS
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const userId = params.get('userId')
    const email = params.get('email')

    if (userId && email) {
      console.log('Auto-detect: User returning from OpenAuth', { userId, email })
      navigate(`/profile${location.search}`, { replace: true })
    }
  }, [location.search, navigate])

  const handleAgree = () => {
    setIsLoading(true)
    window.location.href = '/api/agree'
  }

  if (location.search.includes('userId')) {
    return <div>Redirecting...</div>
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
