import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("readtalk_token");
    if (!token) {
      const openAuthUrl = "https://openauth.soeparnocorp.workers.dev/password/authorize";
      const redirectUri = encodeURIComponent("https://id-readtalk.pages.dev/");
      window.location.href = `${openAuthUrl}?redirect_uri=${redirectUri}`;
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="loading-screen">
        <img src={viteLogo} className="logo" alt="Logo" />
        <div className="logo-motion"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div id="root">
      <img src={viteLogo} className="logo" alt="Logo" />
      <div className="logo-motion"></div>
      <h1>Welcome to READTalk</h1>
      <div className="card">
        <button onClick={() => localStorage.setItem("readtalk_token", "1")}>
          Agree and Continue
        </button>
      </div>
    </div>
  );
}

export default App;
