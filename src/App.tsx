import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [chaos, setChaos] = useState(0)
  const [particles, setParticles] = useState<Array<{x: number, y: number}>>([])
  const [emoji, setEmoji] = useState('🤔')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<AudioContext | null>(null)

  // Eksplorasi 1: Canvas 2D physics
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Particle system
      particles.forEach((p, i) => {
        ctx.fillStyle = `hsl(${(frame + i * 30) % 360}, 100%, 50%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        // Update position
        p.y += Math.sin(frame * 0.1 + i) * 2
        p.x += Math.cos(frame * 0.1 + i) * 2
      })
      
      frame++
      requestAnimationFrame(animate)
    }
    animate()
  }, [particles])

  // Eksplorasi 2: Web Audio API
  const playBeep = () => {
    if (!audioRef.current) {
      audioRef.current = new AudioContext()
    }
    const osc = audioRef.current.createOscillator()
    osc.connect(audioRef.current.destination)
    osc.frequency.value = 440 + chaos * 100
    osc.start()
    osc.stop(0.1)
  }

  // Eksplorasi 3: Device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setEmoji(['🧭', '📱', '🌀', '⚡'][Math.floor(Math.random() * 4)])
    }
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  return (
    <div className="app">
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight * 0.5}
        className="chaos-canvas"
      />
      
      <div className="controls">
        <button onClick={() => setChaos(c => c + 1)}>
          Increase Chaos {chaos}
        </button>
        
        <button onClick={() => {
          setParticles(prev => [...prev, {
            x: Math.random() * 400,
            y: Math.random() * 200
          }])
        }}>
          Spawn Particle
        </button>
        
        <button onClick={playBeep}>
          🔊 Sonic Boom
        </button>
      </div>

      <div className="reality">
        <h2>Reality Distortion Field</h2>
        <p className="emoji">{emoji}</p>
        <p>Chaos Level: {chaos}</p>
        <p>Particles: {particles.length}</p>
      </div>

      <div className="footer">
        <p>⚡ Vite + React = Reality Glitch ⚡</p>
        <p>Herman's Chaos Laboratory</p>
      </div>
    </div>
  )
}

export default App
