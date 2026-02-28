import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [dimension, setDimension] = useState(1)
  const [timeline, setTimeline] = useState<string[]>([])
  const [quantumState, setQuantumState] = useState<'alive' | 'dead' | 'both'>('both')
  const [infiniteCount, setInfiniteCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Timeline effect
  useEffect(() => {
    const timelines = [
      '🌍 React created (2013)',
      '⚡ Vite released (2020)',
      '📘 TypeScript 5.0',
      '🚀 React Server Components',
      '🌀 Next.js 15'
    ]
    let index = 0
    const interval = setInterval(() => {
      setTimeline(prev => [...prev.slice(-4), timelines[index % timelines.length]])
      index++
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Quantum state
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(Math.random() > 0.5 ? 'alive' : Math.random() > 0.5 ? 'dead' : 'both')
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Canvas fractal (tanpa WebSocket!)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const drawFractal = (x: number, y: number, size: number, depth: number) => {
      if (depth > 6) return
      
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
      
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(frame * 0.01 * i)
        drawFractal(0, 0, 200, 0)
        ctx.restore()
      }

      frame++
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <div className="container">
      <h1 className="glitch">⚡ VITE + REACT ⚡</h1>
      
      <canvas ref={canvasRef} width={800} height={400} className="fractal-canvas" />
      
      <div className="controls">
        <button onClick={() => setDimension(d => d + 1)}>
          Dimension {dimension}
        </button>
        <button onClick={() => setInfiniteCount(c => c + 1)}>
          Loop {infiniteCount}
        </button>
      </div>

      <div className="timeline">
        {timeline.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>

      <p className="footer">Herman's Vite React Template • Chaos Edition</p>
    </div>
  )
}

export default App
