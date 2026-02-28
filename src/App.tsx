// App.tsx
import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count] = useState(0) // state count dihapus fungsinya, cuma display

  // Cek device ID di localStorage
  useEffect(() => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
    console.log('Device ID:', deviceId);
  }, []);

  const handleAgree = () => {
    // LANGSUNG redirect, tanpa tambahan logic apapun
    window.location.href = 'https://account.soeparnocorp.workers.dev/';
  }

  return (
    <>
      <div>
        <a href="#">
          <img src={viteLogo} className="logo coin-flip" alt="Vite logo" />
        </a>
      </div>
      
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
