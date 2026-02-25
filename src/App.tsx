import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="container">
      <div className="content">
        <h1>Welcome to READTalk</h1>
        
        <p className="terms-text">
          Read our <a href="#">Privacy Policies</a>. Tap "Agree and continue" 
          to accept our <a href="#">Terms of Service</a>.
        </p>

        <div className="language-selector">
          <span>English ▼</span>
        </div>

        <button className="agree-button">
          Agree and continue
        </button>

        <p className="footer">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </div>
  )
}

export default App
