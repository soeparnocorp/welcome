import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const handleAgree = () => {
    // Dapetin device ID dari localStorage
    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('device_id', deviceId)
    }
    
    // Redirect ke OpenAuth Worker
    // Asumsi worker lo di deploy di https://openauth.soeparnocorp.workers.dev
    const authUrl = new URL('https://openauth.soeparnocorp.workers.dev')
    authUrl.searchParams.set('redirect_uri', 'https://id-readtalk.pages.dev/callback')
    authUrl.searchParams.set('client_id', 'readtalk-app')
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('device_id', deviceId)
    
    window.location.href = authUrl.toString()
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
