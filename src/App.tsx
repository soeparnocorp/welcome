// App.tsx
import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleAgree = () => {
    setCount((count) => count + 1)
    console.log('Agreed! Count:', count + 1)
    // Redirect ke URL yang ditentukan
    window.location.href = 'https://account.soeparnocorp.workers.dev/'
  }

  return (
    <>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <img src={viteLogo} className="logo coin-flip" alt="Vite logo" />
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
          Agree and continue {count > 0 ? `(${count})` : ''}
        </button>
      </div>
    </>
  )
}

export default App
