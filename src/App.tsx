import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [chaos, setChaos] = useState(0)
  const [particles, setParticles] = useState<Array<{x: number, y: number}>>([])
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set canvas size setelah mount
  useEffect(() => {
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight * 0.5
    })
  }, [])

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p, i) => {
        ctx.fillStyle = `hsl(${(frame + i * 30) % 360}, 100%, 50%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
      
      frame++
      requestAnimationFrame(animate)
    }
    animate()
  }, [particles])

  return (
    <div className="app">
      <canvas 
        ref={canvasRef} 
        width={canvasSize.width} 
        height={canvasSize.height}
        className="chaos-canvas"
      />
      
      <div className="controls">
        <button onClick={() => setChaos(c => c + 1)}>
          Increase Chaos {chaos}
        </button>
        
        <button onClick={() => {
          setParticles(prev => [...prev, {
            x: Math.random() * canvasSize.width,
            y: Math.random() * canvasSize.height
          }])
        }}>
          Spawn Particle
        </button>
      </div>

      <div className="reality">
        <h2>Chaos Level: {chaos}</h2>
        <p>Particles: {particles.length}</p>
      </div>

      <p className="footer">
        Vite + React • Chaos Mode
      </p>
    </div>
  )
}

export default App
