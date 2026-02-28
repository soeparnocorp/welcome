import { useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  useEffect(() => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
  }, []);

  const handleAgree = () => {
    window.location.href = 'https://account.soeparnocorp.workers.dev/';
  }

  return (
    <div className="container">
      <img src={viteLogo} className="logo coin-flip" alt="logo" />
      
      <h1>Welcome to READTalk</h1>
      
      <p className="terms">
        Read our <a href="#">Privacy Policies</a>. Tap "Agree and continue" to accept our <a href="#">Terms of Service</a>.
      </p>

      <div className="language">English ▼</div>

      <button className="agree" onClick={handleAgree}>
        Agree and continue
      </button>

      <div className="copyright">© 2026 SOEPARNO ENTERPRISE Corp.</div>
    </div>
  )
}

export default App
