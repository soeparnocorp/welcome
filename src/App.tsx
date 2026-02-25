import { useState, useEffect } from 'react'  
import viteLogo from '/vite.svg'  
import './App.css'  

function App() {  
  const [count, setCount] = useState(0)  

  useEffect(() => {
    // Tangani OpenAuth callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code') // OpenAuth kirim code/token

    if (code) {
      localStorage.setItem('readtalk_token', code)
      // Bersihkan URL callback
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleAgree = () => {
    const token = localStorage.getItem('readtalk_token')
    if (!token) {
      // Redirect ke OpenAuth
      const openAuthUrl = "https://openauth.soeparnocorp.workers.dev/password/authorize"
      const redirectUri = encodeURIComponent("https://id-readtalk.pages.dev/")
      window.location.href = `${openAuthUrl}?redirect_uri=${redirectUri}`
    }
  }

  return (  
    <>  
      <div>  
        <a href="#" target="_blank">  
          <img src={viteLogo} className="logo spin" alt="Vite logo" />  
        </a>  
      </div>  
      <h1>Welcome to READTalk</h1>  
      <div className="card">  
        <p>  
          Read our <code>Privacy Policies</code> Tap "Aggree and   
          continue" to accept our <code>Terms of Service</code>  
        </p>  
        <button onClick={() => { setCount((c) => c + 1); handleAgree() }}>  
          Agree and Countinue {count}  
        </button>  
      </div>  
      <p className="read-the-docs">  
        © 2026  SOEPARNO ENTERPRISE Corp.  
      </p>  
    </>  
  )  
}  

export default App
