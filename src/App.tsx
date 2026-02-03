import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const handleClick = () => {
    // arah ke Pages Function /click
    window.location.href = '/user'
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Welcome to READTalk</h1>

      <div className="card">
        <button className="agree-btn" onClick={handleClick}>
          Agree and Continue
        </button>

        <p>
          Read our <code>Privacy Policies</code>. Tap "Agree and Continue" to accept our{' '}
          <code>Terms of Service</code>.
        </p>
      </div>

      <p className="read-the-docs">SOEPARNO Technology</p>
    </>
  )
}

export default App
