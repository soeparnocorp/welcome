// App.tsx
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("readtalk_token");

    if (!token) {
      // Redirect ke OpenAuth login
      const openAuthUrl = "https://openauth.soeparnocorp.workers.dev/password/authorize";
      const redirectUri = encodeURIComponent(
        "https://id-readtalk.pages.dev/"
      );
      window.location.href = `${openAuthUrl}?redirect_uri=${redirectUri}`;
    } else {
      // User sudah login
      setIsCheckingAuth(false);
    }
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="loading-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
      <div className="logos">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Welcome to READTalk</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          Agree and Continue {count}
        </button>
        <p>
          Read our <code>Privacy Policies</code>. Tap "Agree and Continue" to
          accept our <code>Terms of Service</code>.
        </p>
      </div>

      <p className="read-the-docs">SOEPARNO Technology</p>
    </>
  );
}

export default App;
