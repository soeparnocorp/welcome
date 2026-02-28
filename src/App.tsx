import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  })

  // Eksplorasi 1: Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Eksplorasi 2: Window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div className="debug-info">
        <div>Mouse: {mousePos.x}, {mousePos.y}</div>
        <div>Window: {windowSize.width}x{windowSize.height}</div>
      </div>

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      
      <div className="experiment-grid">
        <div className="card">
          <h3>Counter</h3>
          <button onClick={() => setCount(c => c + 1)}>
            count is {count}
          </button>
        </div>

        <div className="card">
          <h3>Warna Random</h3>
          <div 
            className="color-box"
            style={{ 
              backgroundColor: `hsl(${count * 10}, 70%, 50%)` 
            }}
          />
        </div>

        <div className="card">
          <h3>Even/Odd</h3>
          <p>{count} adalah angka {count % 2 === 0 ? 'genap' : 'ganjil'}</p>
        </div>
      </div>

      <p className="read-the-docs">
        Eksplorasi fitur React + Vite • Herman Edition
      </p>
    </>
  )
}

export default App
