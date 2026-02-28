import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null)

  const handleAgree = () => {
    setCount((count) => count + 1)
    console.log('Agreed! Count:', count + 1)
    // Fungsi navigasi / pages functions di sini
  }

  const flipCoin = () => {
    if (isFlipping) return
    
    setIsFlipping(true)
    setCoinResult(null)
    
    // Animasi flip 1 detik
    setTimeout(() => {
      const random = Math.random() > 0.5 ? 'heads' : 'tails'
      setCoinResult(random)
      setIsFlipping(false)
      
      // Bonus: count +1 kalau dapat heads?
      if (random === 'heads') {
        setCount((count) => count + 1)
      }
    }, 1000)
  }

  return (
    <>
      <div>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault()
            flipCoin()
          }}
        >
          <img 
            src={viteLogo} 
            className={`logo ${isFlipping ? 'flipping' : ''}`} 
            alt="Vite logo" 
          />
        </a>
      </div>
      
      <div className="content-wrapper">
        <h1>Welcome to READTalk</h1>
        
        {coinResult && (
          <div className="coin-result">
            Coin: <strong>{coinResult === 'heads' ? '⚡ HEADS' : '🪙 TAILS'}</strong>
            {coinResult === 'heads' && <span className="bonus"> +1 bonus!</span>}
          </div>
        )}
        
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

        <p className="read-the-docs">
          © 2026 SOEPARNO ENTERPRISE Corp.
        </p>
      </div>
    </>
  )
}

export default App
