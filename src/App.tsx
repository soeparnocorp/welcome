import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("readtalk_token");
    if (!token) {
      setAgreed(false);
    } else {
      setAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("readtalk_token", "agreed");
    setAgreed(true);
  };

  if (!agreed) {
    return (
      <div className="welcome-screen">
        <img src={viteLogo} className="logo" alt="Logo" />
        <h1>Welcome to READTalk</h1>
        <div className="card">
          <button onClick={handleAgree}>Agree and Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-screen">
      <h1>READTalk Home</h1>
      <p>Your PWA content goes here.</p>
    </div>
  );
}

export default App;
