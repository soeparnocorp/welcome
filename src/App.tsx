import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
        <button onClick={() => setCount((count) => count + 1)}>
          Agree and Countinue {count}
        </button>
        <p>
          Read our <code>Privacy Policies</code> Tap "Aggree and continue" to accept our <code>Terms of Service</code>
        </p>
      </div>
      <p className="read-the-docs">
        SOEPARNO Technology
      </p>
    </>
  )
}

export default App
