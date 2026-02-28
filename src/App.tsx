// App.tsx
import { useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // CEK DEVICE ID DI LOCALSTORAGE
  useEffect(() => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
  }, []);

  const handleAgree = () => {
    // LANGSUNG REDIRECT - TANPA COUNT, TANPA LOG
    window.location.href = 'https://account.soeparnocorp.workers.dev/';
  }

  return (
    <>
      <div>
        <img src={viteLogo} className="logo coin-flip" alt="Vite logo" />
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

        <p className="copyright">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
