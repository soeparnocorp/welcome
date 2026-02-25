// App.tsx
import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showAgree, setShowAgree] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("readtalk_token");

    if (!token) {
      setShowAgree(true);
      setIsCheckingAuth(false);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  const handleAgree = () => {
    const openAuthUrl = "https://openauth.soeparnocorp.workers.dev/password/authorize";
    const redirectUri = encodeURIComponent("https://id-readtalk.pages.dev/");
    window.location.href = `${openAuthUrl}?redirect_uri=${redirectUri}`;
  };

  if (isCheckingAuth) {
    return (
      <div className="loading-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="logo-wrapper">
        <img src={viteLogo} className="logo spin" alt="Vite logo" />
      </div>
      <h1 className="title">Welcome to READTalk</h1>
      {showAgree && (
        <div className="card">
          <button className="agree-btn" onClick={handleAgree}>
            Agree and Continue
          </button>
          <p className="agreement-text">
            Read our <code>Privacy Policies</code>. Tap "Agree and Continue" to accept our <code>Terms of Service</code>.
          </p>
        </div>
      )}
      <p className="footer">SOEPARNO Technology</p>
    </div>
  );
}

export default App;
