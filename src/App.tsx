// src/App.tsx
import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAgree = async () => {
    setLoading(true)
    setError('')
    
    try {
      // 1. Kirim request ke auth API
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agreed: true,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      })

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status}`)
      }

      // 2. Dapetin response dari server
      const data = await response.json()
      
      // 3. Simpan token/user data (misal di localStorage)
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
      }
      
      // 4. Redirect ke dashboard/account
      window.location.href = data.redirectUrl || '/account.html'
      
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setCount(c => c + 1) // Tetap increment buat tracking percobaan
    } finally {
      setLoading(false)
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

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        <button
          className="agree-button"
          onClick={handleAgree}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Processing...' : 'Agree and continue'}
          {count > 0 && !loading && ` (${count})`}
        </button>

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
