import React, { useEffect, useState } from 'react';
import '../../App.css';
import './Home.css';

const HomePage: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<{userId: string; email: string} | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const email = params.get('email');
    
    if (userId && email) {
      setUser({ userId, email });
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
    }
  }, []);

  const archivedChats = [
    { id: 1, name: 'SETOR RESI', avatar: '📦', message: 'Kakang Sayang❤️: Gpp, Masi bany...', time: '08/12/25' },
    { id: 2, name: 'Dalduk Pak Deni', avatar: '👤', message: 'Foto', time: '20.19' },
    { id: 3, name: 'Kakang Sayang❤️', avatar: '❤️', message: '✅ Kakang lagi apa', time: '20.18' },
    { id: 4, name: 'Teh Mitha', avatar: '👩', message: 'Sieun tepa pasti nage ..', time: '19.32' },
    { id: 5, name: 'Afish', avatar: '🐟', message: '✅ Iyah sama" afish', time: '19.17' },
    { id: 6, name: 'Azog', avatar: '👤', message: '✅ Gak dapet cun', time: '9.9' },
    { id: 7, name: 'Ayahanda', avatar: '👨', message: '❤️ Talannn ciara tak teriawah', time: '' }
  ];

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <div className="header-top">
          <h1>READTalk</h1>
          <div className="header-icons">
            <span>📷</span>
            <span onClick={() => setShowMenu(!showMenu)}>⋯</span>
          </div>
        </div>
        <div className="search-bar">
          <span>🔍</span>
          <input type="text" placeholder="Tanya Meta AI atau Cari" />
        </div>
      </div>

      {/* FLOATING MENU */}
      {showMenu && (
        <div className="floating-menu">
          <div className="menu-item" onClick={() => window.location.href = '/settings'}>
            <span>👥</span> Grup baru
          </div>
          <div className="menu-item">
            <span>👤</span> Komunitas baru
          </div>
          <div className="menu-item">
            <span>📢</span> Daftar siaran
          </div>
          <div className="menu-item">
            <span>💻</span> Perangkat tertaut
          </div>
          <div className="menu-item">
            <span>⭐</span> Berbintang
          </div>
          <div className="menu-item">
            <span>✓</span> Baca semua
          </div>
          <div className="menu-item" onClick={() => window.location.href = '/settings'}>
            <span>⚙️</span> Pengaturan
          </div>
        </div>
      )}

      {/* DIARSIPKAN SECTION */}
      <div className="archived-section">
        <div className="archived-header">
          <span>Diarsipkan</span>
          <span>⌄</span>
        </div>
        <div className="archived-items">
          {archivedChats.map(chat => (
            <div key={chat.id} className="archived-item">
              <div className="archived-avatar">{chat.avatar}</div>
              <div className="archived-info">
                <div className="archived-name">{chat.name}</div>
                <div className="archived-message">{chat.message}</div>
              </div>
              {chat.time && <div className="archived-time">{chat.time}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT AREA - KOSONG */}
      <div className="chat-area">
        <div className="empty-state">
          <p>Belum ada chat</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Mulai percakapan dengan menekan tombol +
          </p>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <span>💬</span> Chat
        </div>
        <div className="nav-item">
          <span>🔄</span> Pembaruan
        </div>
        <div className="nav-item">
          <span>👥</span> Komunitas
        </div>
        <div className="nav-item">
          <span>📞</span> Panggilan
        </div>
      </div>
    </div>
  );
};

export default HomePage;
