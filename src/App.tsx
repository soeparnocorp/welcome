import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [cubeColor, setCubeColor] = useState('#ff0000')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 3D Cube Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw 3D cube
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = 80

      // Cube vertices
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ]

      // Project 3D to 2D
      const project = (x: number, y: number, z: number) => {
        const rotX = rotation.x + (isSpinning ? frame * 0.01 : 0)
        const rotY = rotation.y + (isSpinning ? frame * 0.02 : 0)
        
        // Rotation matrices
        const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
        
        // Apply rotations
        let x1 = x * cosY - z * sinY
        let z1 = x * sinY + z * cosY
        let y1 = y * cosX - z1 * sinX
        let z2 = y * sinX + z1 * cosX
        
        // Perspective projection
        const scale = 400 / (400 + z2)
        return {
          x: centerX + x1 * size * scale,
          y: centerY + y1 * size * scale
        }
      }

      // Draw faces
      const faces = [
        { vertices: [0,1,2,3], color: '#ff0000' }, // front
        { vertices: [5,4,7,6], color: '#00ff00' }, // back
        { vertices: [1,5,6,2], color: '#0000ff' }, // right
        { vertices: [4,0,3,7], color: '#ffff00' }, // left
        { vertices: [3,2,6,7], color: '#ff00ff' }, // top
        { vertices: [4,5,1,0], color: '#00ffff' }  // bottom
      ]

      faces.forEach(face => {
        ctx.beginPath()
        const points = face.vertices.map(v => project(vertices[v][0], vertices[v][1], vertices[v][2]))
        ctx.moveTo(points[0].x, points[0].y)
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y))
        ctx.closePath()
        
        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, face.color)
        gradient.addColorStop(1, cubeColor)
        
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      frame++
      requestAnimationFrame(animate)
    }
    animate()
  }, [rotation, isSpinning, cubeColor])

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

      <h1>Vite + React 3D Explorer</h1>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="cube-canvas"
      />

      <div className="controls">
        <div className="slider-group">
          <label>Rotate X</label>
          <input 
            type="range" 
            min="-3.14" 
            max="3.14" 
            step="0.1"
            value={rotation.x}
            onChange={(e) => setRotation({ ...rotation, x: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="slider-group">
          <label>Rotate Y</label>
          <input 
            type="range" 
            min="-3.14" 
            max="3.14" 
            step="0.1"
            value={rotation.y}
            onChange={(e) => setRotation({ ...rotation, y: parseFloat(e.target.value) })}
          />
        </div>

        <div className="button-group">
          <button onClick={() => setIsSpinning(!isSpinning)}>
            {isSpinning ? 'Stop' : 'Spin'}
          </button>
          
          <button onClick={() => setCubeColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)}>
            Random Color
          </button>
        </div>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
