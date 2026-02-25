import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div id="root">
      {/* Logo center dengan animasi floating ala WA */}
      <div className="logo-container">
        <img src={viteLogo} className="logo" alt="READTalk Logo" />
      </div>

      <h1 className="welcome-text">Welcome to READTalk</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)} className="agree-btn">
          Agree and Continue {count}
        </button>
        <p className="tos-text">
          Read our <code>Privacy Policies</code>. Tap "Agree and Continue" to accept our <code>Terms of Service</code>.
        </p>
      </div>

      <p className="footer-text">SOEPARNO Technology</p>
    </div>
  );
}

export default App;
