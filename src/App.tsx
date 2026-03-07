import { useState, useEffect, useRef } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // ==================== STATE ====================
  const [step, setStep] = useState<'welcome' | 'room' | 'chat'>('welcome')
  const [userData, setUserData] = useState<{userId: string; email: string} | null>(null)
  const [roomName, setRoomName] = useState('')
  const [lastRoom, setLastRoom] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // ==================== DETEK PARAMETER ====================
  useEffect(() => {
    // Cek parameter di URL (saat balik dari OpenAuth)
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const email = params.get('email')
    
    if (userId && email) {
      console.log('✅ Detek parameter dari OpenAuth:', { userId, email })
      
      // Simpan data user
      setUserData({ userId, email })
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', email)
      
      // Cek apakah ada room tersimpan
      const savedRoom = localStorage.getItem('lastRoom')
      if (savedRoom) {
        console.log('📁 Ada room tersimpan:', savedRoom)
        setLastRoom(savedRoom)
        setRoomName(savedRoom)
        setStep('chat') // Langsung ke chat
      } else {
        console.log('🏠 Belum ada room, tampilkan form')
        setStep('room') // Tampilkan form create room
      }
      
      // Bersihkan URL dari parameter (opsional)
      // window.history.replaceState({}, '', '/')
    }
  }, [])
  
  // ==================== KIRIM PERINTAH KE IFRAME ====================
  useEffect(() => {
    if (step === 'chat' && iframeRef.current && roomName) {
      const iframe = iframeRef.current
      
      const handleIframeLoad = () => {
        console.log('🔄 Iframe loaded, kirim perintah OPEN_ROOM:', roomName)
        iframe.contentWindow?.postMessage({
          type: 'OPEN_ROOM',
          roomName: roomName
        }, 'https://account.soeparnocorp.workers.dev')
      }
      
      iframe.addEventListener('load', handleIframeLoad)
      return () => iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [step, roomName])
  
  // ==================== LISTENER DARI IFRAME ====================
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://account.soeparnocorp.workers.dev') return
      
      console.log('📨 Pesan dari chatroom:', event.data)
      
      if (event.data.type === 'BACK_TO_ROOMS') {
        setStep('room')
      }
      
      if (event.data.type === 'USER_JOINED') {
        console.log('👤 User joined:', event.data.username)
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  
  // ==================== HANDLERS ====================
  
  const handleAgree = () => {
    console.log('👉 User klik Agree, redirect ke OpenAuth')
    // Redirect ke OpenAuth
    window.location.href = 'https://openauth.soeparnocorp.workers.dev/'
  }
  
  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      alert('Nama room harus diisi!')
      return
    }
    
    console.log('🏗️ Membuat room:', roomName)
    
    // Simpan di localStorage
    localStorage.setItem('lastRoom', roomName)
    setLastRoom(roomName)
    
    // Pindah ke chat
    setStep('chat')
  }
  
  // ==================== RENDER ====================
  
  // WELCOME SCREEN (halaman agree)
  if (step === 'welcome') {
    return (
      <>
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

          <p className="read-the-docs">
            © 2026 SOEPARNO ENTERPRISE Corp.
          </p>
        </div>
      </>
    )
  }
  
  // ROOM SCREEN (FORM CREATE ROOM - MIRROR)
  if (step === 'room') {
    return (
      <div className="room-screen">
        <div className="room-card">
          <h1 className="room-title">READTalk</h1>
          <h2 className="room-subtitle">Buat Room Baru</h2>
          
          <input
            type="text"
            className="room-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Nama room..."
            maxLength={14}
            autoFocus
          />
          
          <button 
            className="room-button"
            onClick={handleCreateRoom}
          >
            ✨ Buat Room
          </button>
          
          {lastRoom && (
            <div className="last-room-container">
              <p className="last-room-text">
                Room terakhir: <strong>{lastRoom}</strong>
              </p>
              <button 
                className="use-last-button"
                onClick={() => {
                  setRoomName(lastRoom)
                  handleCreateRoom()
                }}
              >
                ↻ Pakai lagi
              </button>
            </div>
          )}
          
          <p className="room-note">
            Setelah room dibuat, silakan isi nama kamu di chat
          </p>
        </div>
      </div>
    )
  }
  
  // CHAT SCREEN (IFRAME FULLSCREEN)
  return (
    <div className="chat-screen">
      {/* IFRAME KE CHATROOM (account.soeparnocorp.workers.dev) */}
      <iframe
        ref={iframeRef}
        src={`https://account.soeparnocorp.workers.dev?userId=${userData?.userId}&email=${userData?.email}`}
        className="chat-iframe"
        title="READTalk Chat"
      />
      
      {/* FLOATING BUTTON KEMBALI KE ROOM FORM */}
      <button 
        className="chat-back-button"
        onClick={() => setStep('room')}
      >
        ← Ganti Room
      </button>
    </div>
  )
}

export default App
