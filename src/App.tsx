import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // Fungsi untuk navigasi / pages functions
  const handleAgree = () => {
    setCount((count) => count + 1)
    
    // Contoh fungsi untuk navigasi ke halaman berikutnya
    console.log('User agreed! Count:', count + 1)
    
    // Bisa ditambahkan:
    // - Navigasi ke halaman lain (react-router)
    // - Set cookies/localStorage
    // - Panggil API
    // - Dll
    
    alert(`Agreed! Button clicked ${count + 1} times`)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
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
          Agree and continue {count > 0 ? `(${count})` : ''}
        </button>

        <p className="footer">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
