import { useState, useEffect, createContext, useContext, useReducer } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import './App.css'

// ========== TYPES ==========
interface User {
  id: string
  email: string
  name: string
}

interface Room {
  id: string
  name: string
  type: 'public' | 'private'
  participantCount: number
}

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: number
}

// ========== CONTEXT ==========
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  language: 'id' | 'en'
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'id' | 'en' }

const initialState: AppState = {
  user: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  language: (localStorage.getItem('lang') as 'id' | 'en') || 'id'
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
}>({ state: initialState, dispatch: () => null })

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_THEME':
      localStorage.setItem('theme', action.payload)
      document.body.className = action.payload
      return { ...state, theme: action.payload }
    case 'SET_LANGUAGE':
      localStorage.setItem('lang', action.payload)
      return { ...state, language: action.payload }
    default:
      return state
  }
}

// ========== CUSTOM HOOKS ==========
function useApi() {
  const { state } = useContext(AppContext)
  const baseUrl = import.meta.env.VITE_API_URL || 'https://api.workers.dev'

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(state.user?.id && { 'X-User-ID': state.user.id }),
      ...options.headers
    }

    const res = await fetch(`${baseUrl}${endpoint}`, { ...options, headers })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  return {
    getRooms: () => fetchWithAuth('/rooms'),
    createRoom: (name: string, type: 'public' | 'private') => 
      fetchWithAuth('/rooms', { method: 'POST', body: JSON.stringify({ name, type }) }),
    getUser: (email: string) => fetchWithAuth(`/user?email=${encodeURIComponent(email)}`),
  }
}

// ========== COMPONENTS ==========

// Landing Page
function LandingPage() {
  const { state, dispatch } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const navigate = useNavigate()
  const api = useApi()

  const urlParams = new URLSearchParams(window.location.search)
  const oauthEmail = urlParams.get('email')

  useEffect(() => {
    if (oauthEmail) {
      setEmail(oauthEmail)
      checkUser(oauthEmail)
    }
  }, [oauthEmail])

  const checkUser = async (email: string) => {
    try {
      const user = await api.getUser(email)
      if (user) {
        dispatch({ type: 'SET_USER', payload: user })
        navigate('/rooms')
      }
    } catch (error) {
      console.error('User not found:', error)
    }
  }

  const handleAgree = () => {
    if (!agreed) return
    localStorage.setItem('lang', state.language)
    localStorage.setItem('agreed', 'true')
    const authUrl = `https://openauth.workers.dev?redirect=${encodeURIComponent(window.location.origin)}&lang=${state.language}`
    window.location.href = authUrl
  }

  return (
    <div className="landing">
      <header>
        <h1>READTalk</h1>
        <div className="header-controls">
          <select 
            value={state.language} 
            onChange={(e) => dispatch({ 
              type: 'SET_LANGUAGE', 
              payload: e.target.value as 'id' | 'en' 
            })}
          >
            <option value="id">🇮🇩 Indonesia</option>
            <option value="en">🇬🇧 English</option>
          </select>
          <button 
            className="theme-toggle"
            onClick={() => dispatch({ 
              type: 'SET_THEME', 
              payload: state.theme === 'light' ? 'dark' : 'light' 
            })}
          >
            {state.theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main>
        <div className="hero">
          <h2>Chat Pribadi di Cloudflare Edge</h2>
          <p>WebSocket real-time • Durable Objects • Private & Public Rooms</p>
        </div>

        <div className="card terms-card">
          <h3>Sebelum melanjutkan</h3>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">🔒</span>
              <span>Private room dengan link unik</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌐</span>
              <span>Public room dengan nama kustom</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>WebSocket real-time tanpa delay</span>
            </div>
          </div>

          <div className="terms-text">
            <p>
              Dengan melanjutkan, Anda setuju dengan{' '}
              <a href="/terms">Syarat & Ketentuan</a> dan{' '}
              <a href="/privacy">Kebijakan Privasi</a> READTalk.
            </p>
          </div>

          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>Saya telah membaca dan menyetujui</span>
          </label>

          <button 
            onClick={handleAgree}
            disabled={!agreed}
            className="agree-button"
          >
            Setuju & Lanjutkan
          </button>
        </div>
      </main>

      <footer className="read-the-docs">
        <p>© 2026 SOEPARNO Technology • Powered by Cloudflare</p>
      </footer>
    </div>
  )
}

// Rooms Page
function RoomsPage() {
  const { state, dispatch } = useContext(AppContext)
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const api = useApi()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.user) {
      navigate('/')
      return
    }
    loadRooms()
  }, [state.user])

  const loadRooms = async () => {
    try {
      const data = await api.getRooms()
      setRooms(data)
    } catch (error) {
      console.error('Failed to load rooms:', error)
    }
  }

  const createRoom = async (type: 'public' | 'private') => {
    if (type === 'public' && !newRoomName) return

    try {
      const room = await api.createRoom(
        type === 'public' ? newRoomName : '',
        type
      )
      navigate(`/room/${room.id}`)
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null })
    navigate('/')
  }

  return (
    <div className="rooms-page">
      <header>
        <h1>READTalk</h1>
        <div className="user-info">
          <span>👤 {state.user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main>
        <div className="card create-room-card">
          <h3>Buat Room Baru</h3>
          
          <div className="public-room-form">
            <input
              type="text"
              placeholder="Nama room (max 12 chars)"
              maxLength={12}
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            />
            <button onClick={() => createRoom('public')}>
              Buat Public Room
            </button>
          </div>

          <div className="private-room-form">
            <button onClick={() => createRoom('private')} className="private-btn">
              Buat Private Room
            </button>
          </div>
        </div>

        <div className="rooms-list">
          <h3>Public Rooms</h3>
          {rooms.map(room => (
            <div key={room.id} className="room-item card">
              <span className="room-name">#{room.name}</span>
              <span className="room-count">{room.participantCount} online</span>
              <button onClick={() => navigate(`/room/${room.id}`)}>Join</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// Chat Room Component
function ChatRoom() {
  const { roomId } = useParams()
  const { state } = useContext(AppContext)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.user || !roomId) {
      navigate('/')
      return
    }

    const websocket = new WebSocket(
      `${import.meta.env.VITE_WS_URL || 'wss://api.workers.dev'}/room/${roomId}`
    )

    websocket.onopen = () => {
      setIsConnected(true)
      websocket.send(JSON.stringify({ 
        type: 'auth', 
        userId: state.user?.id 
      }))
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.payload])
      }
    }

    websocket.onclose = () => setIsConnected(false)

    setWs(websocket)

    return () => websocket.close()
  }, [roomId, state.user])

  const sendMessage = () => {
    if (!input.trim() || !isConnected || !ws) return

    const message: Message = {
      id: Date.now().toString(),
      userId: state.user?.id || '',
      userName: state.user?.name || '',
      content: input,
      timestamp: Date.now()
    }

    ws.send(JSON.stringify({
      type: 'message',
      payload: message
    }))

    setMessages(prev => [...prev, message])
    setInput('')
  }

  if (!roomId) return null

  return (
    <div className="chat-room">
      <header>
        <div className="room-info">
          <button onClick={() => navigate('/rooms')} className="back-btn">←</button>
          <h2>Room #{roomId.slice(0, 8)}</h2>
        </div>
        <div className={`connection-status ${isConnected ? 'connected' : ''}`}>
          {isConnected ? '🟢 Online' : '🔴 Offline'}
        </div>
      </header>

      <div className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.userId === state.user?.id ? 'own' : ''}`}
          >
            <div className="message-header">
              <span className="message-user">{msg.userName}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ketik pesan..."
          maxLength={256}
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Kirim
        </button>
      </div>
    </div>
  )
}

// ========== MAIN APP ==========
function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    document.body.className = state.theme
  }, [state.theme])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
