import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="content-wrapper">
      <h1>Welcome to READTalk</h1>
      
      <p className="terms-text">
        Read our <a href="#">Privacy Policies</a>. Tap "Agree and continue" 
        to accept our <a href="#">Terms of Service</a>.
      </p>

      <div className="language-selector">
        <span>English ▼</span>
      </div>

      <button 
        className="agree-button"
        onClick={() => setCount((count) => count + 1)}
      >
        Agree and continue {count > 0 ? `(${count})` : ''}
      </button>

      <p className="footer">
        © 2026 SOEPARNO ENTERPRISE Corp.
      </p>
    </div>
  )
}

export default App
