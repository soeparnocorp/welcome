import { useState, useEffect } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // Fungsi untuk generate/get device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id')
    
    if (!deviceId) {
      // Generate random device ID
      deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15)
      localStorage.setItem('device_id', deviceId)
    }
    
    return deviceId
  }

  const handleAgree = () => {
    const deviceId = getDeviceId()
    console.log('Device ID:', deviceId)
    
    // Redirect ke openauth dengan device ID
    window.location.href = `https://openauth.soeparnocorp.workers.dev?device_id=${deviceId}`
  }

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

export default App
