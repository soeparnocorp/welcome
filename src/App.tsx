import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [dimension, setDimension] = useState(1)
  const [timeline, setTimeline] = useState<string[]>([])
  const [quantumState, setQuantumState] = useState<'alive' | 'dead' | 'both'>('both')
  const [infiniteCount, setInfiniteCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Multiverse timeline
  useEffect(() => {
    const timelines = [
      '🌍 Earth-616: React created',
      '🌌 Earth-1610: Vite born',
      '🌀 Earth-199999: TypeScript joined',
      '⚡ Earth-42: WebAssembly invasion',
      '🌠 Earth-838: Server components'
    ]
    let index = 0
    const interval = setInterval(() => {
      setTimeline(prev => [...prev.slice(-4), timelines[index % timelines.length]])
      index++
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Quantum tunneling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(Math.random() > 0.5 ? 'alive' : Math.random() > 0.5 ? 'dead' : 'both')
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // WebSocket to nowhere (simulasi cosmic background radiation)
  useEffect(() => {
    wsRef.current = new WebSocket('wss://echo.websocket.org')
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({ type: 'cosmic', message: 'Hello multiverse' }))
    }
    return () => wsRef.current?.close()
  }, [])

  // Infinite recursion visualizer
  useEffect(() => {
    let frame = 0
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawFractal = (x: number, y: number, size: number, depth: number) => {
      if (depth > 8) return
      
      ctx.strokeStyle = `hsl(${frame * 10 + depth * 30}, 100%, 50%)`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(x - size/2, y - size/2, size, size)
      ctx.stroke()

      drawFractal(x - size/2, y - size/2, size/2, depth + 1)
      drawFractal(x + size/2, y - size/2, size/2, depth + 1)
      drawFractal(x - size/2, y + size/2, size/2, depth + 1)
      drawFractal(x + size/2, y + size/2, size/2, depth + 1)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Mandelbrot-inspired chaos
      for (let i = 0; i < 10; i++) {
        ctx.save()
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(frame * 0.01 * i)
        drawFractal(0, 0, 200 + Math.sin(frame * 0.02) * 50, 0)
        ctx.restore()
      }

      frame++
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <div className="container">
      <div className="header">
        <h1 className="glitch" data-text="⚡ MULTIVERSE CHAOS ⚡">
          ⚡ MULTIVERSE CHAOS ⚡
        </h1>
        <p className="quantum-state">
          Quantum State: {quantumState === 'both' ? '🐈 Schrödinger\'s Cat' : quantumState}
        </p>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400}
        className="fractal-canvas"
      />

      <div className="controls-grid">
        <button 
          className="dimension-btn"
          onClick={() => setDimension(d => d + 1)}
        >
          🌌 Dimension {dimension}
        </button>

        <button 
          className="infinite-btn"
          onClick={() => setInfiniteCount(c => c + 1)}
        >
          ∞ Infinite Loop {infiniteCount}
        </button>

        <button 
          className="quantum-btn"
          onClick={() => {
            setQuantumState(prev => 
              prev === 'alive' ? 'dead' : prev === 'dead' ? 'both' : 'alive'
            )
          }}
        >
          🐈 Toggle Quantum
        </button>

        <button 
          className="cosmic-btn"
          onClick={() => {
            if (audioRef.current) {
              const osc = audioRef.current.createOscillator()
              osc.connect(audioRef.current.destination)
              osc.frequency.value = 432 * (dimension / 2)
              osc.start()
              osc.stop(0.2)
            }
          }}
        >
          🎵 Cosmic Frequency
        </button>
      </div>

      <div className="timeline">
        <h3>🌠 Timeline Fracture</h3>
        {timeline.map((t, i) => (
          <div key={i} className="timeline-event" style={{ 
            opacity: 1 - i * 0.2,
            transform: `translateX(${i * 10}px)`
          }}>
            {t}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Dimensions</span>
          <span className="stat-value">{dimension}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Reality Hops</span>
          <span className="stat-value">{infiniteCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Fractal Depth</span>
          <span className="stat-value">∞</span>
        </div>
      </div>

      <div className="cosmic-footer">
        <p>🌀 Vite + React • Beyond Infinity • Herman's Multiverse</p>
        <p className="hidden-dimension">Earth-{Math.floor(Math.random() * 1000)} detected</p>
      </div>
    </div>
  )
}

export default App
