import { useState, useEffect, useRef } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // ==================== STATE ====================
  const [step, setStep] = useState<'welcome' | 'room' | 'chat'>('welcome')
  const [userData, setUserData] = useState<{userId: string; email: string} | null>(null)
  const [roomName, setRoomName] = useState('')
  const [lastRoom, setLastRoom] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // ==================== DETEK PARAMETER ====================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const email = params.get('email')
    
    if (userId && email) {
      console.log('✅ Detek parameter dari OpenAuth:', { userId, email })
      
      setUserData({ userId, email })
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', email)
      
      const savedRoom = localStorage.getItem('lastRoom')
      if (savedRoom) {
        setLastRoom(savedRoom)
        setRoomName(savedRoom)
        setStep('chat')
      } else {
        setStep('room')
      }
    }
  }, [])
  
  // ==================== KIRIM PERINTAH KE IFRAME ====================
  useEffect(() => {
    if (step === 'chat' && iframeRef.current && roomName) {
      const iframe = iframeRef.current
      
      const handleIframeLoad = () => {
        iframe.contentWindow?.postMessage({
          type: 'OPEN_ROOM',
          roomName: roomName
        }, 'https://account.soeparnocorp.workers.dev')
      }
      
      iframe.addEventListener('load', handleIframeLoad)
      return () => iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [step, roomName])
  
  // ==================== HANDLERS ====================
  
  const handleAgree = () => {
    setShowAuthModal(true)
    // Redirect ke OpenAuth di tab baru
    window.open('https://openauth.soeparnocorp.workers.dev/', '_blank')
    
    // Tutup modal setelah beberapa detik
    setTimeout(() => setShowAuthModal(false), 3000)
  }
  
  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      alert('Nama room harus diisi!')
      return
    }
    
    localStorage.setItem('lastRoom', roomName)
    setLastRoom(roomName)
    setStep('chat')
  }
  
  // ==================== RENDER ====================
  
  // WELCOME SCREEN (menggunakan CSS dari App.css)
  if (step === 'welcome') {
    return (
      <>
        {/* AUTH MODAL (menggunakan CSS dari App.css) */}
        {showAuthModal && (
          <div className="auth-overlay">
            <div className="auth-modal">
              <div className="auth-modal-header">
                <h2>OpenAuth</h2>
                <button className="close-button" onClick={() => setShowAuthModal(false)}>×</button>
              </div>
              <div className="auth-modal-content">
                <div className="loading-spinner"></div>
                <p>Mengarahkan ke OpenAuth...</p>
                <p className="hint">Silakan login di tab yang terbuka</p>
              </div>
            </div>
          </div>
        )}
        
        {/* WELCOME CONTENT */}
        <div>
          <a href="#" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
        </div>
        
        <div className="content-wrapper">
          <h1>Welcome to READTalk</h1>
          
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
            Agree and continue
          </button>

          <p className="read-the-docs footer">
            © 2026 SOEPARNO ENTERPRISE Corp.
          </p>
        </div>
      </>
    )
  }
  
  // ROOM SCREEN (FORM CREATE ROOM)
  if (step === 'room') {
    return (
      <div className="room-screen" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div className="room-card" style={{
          background: 'white',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h1 className="room-title" style={{ color: '#ff0000', fontSize: '32px', marginBottom: '10px' }}>
            READTalk
          </h1>
          <h2 className="room-subtitle" style={{ color: '#333', fontSize: '18px', marginBottom: '30px' }}>
            Buat Room Baru
          </h2>
          
          <input
            type="text"
            className="room-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name..."
            maxLength={14}
            autoFocus
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '30px',
              fontSize: '16px'
            }}
          />
          
          <button 
            className="room-button"
            onClick={handleCreateRoom}
            style={{
              width: '100%',
              padding: '15px',
              background: '#ff0000',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ✨ Buat Room
          </button>
          
          {lastRoom && (
            <div className="last-room-container" style={{
              marginTop: '20px',
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '12px'
            }}>
              <p className="last-room-text" style={{ marginBottom: '10px', color: '#666' }}>
                Room terakhir: <strong>{lastRoom}</strong>
              </p>
              <button 
                className="use-last-button"
                onClick={() => {
                  setRoomName(lastRoom)
                  handleCreateRoom()
                }}
                style={{
                  background: 'none',
                  border: '2px solid #ff0000',
                  color: '#ff0000',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ↻ Pakai lagi
              </button>
            </div>
          )}
          
          <p className="room-note" style={{ marginTop: '20px', color: '#999', fontSize: '12px' }}>
            Setelah room dibuat, silakan isi nama kamu di chat
          </p>
        </div>
      </div>
    )
  }
  
  // CHAT SCREEN (IFRAME FULLSCREEN)
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <iframe
        ref={iframeRef}
        src={`https://account.soeparnocorp.workers.dev?userId=${userData?.userId}&email=${userData?.email}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        title="READTalk Chat"
      />
      
      <button 
        onClick={() => setStep('room')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          background: '#ff0000',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '600',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
      >
        ← Ganti Room
      </button>
    </div>
  )
}

export default App
