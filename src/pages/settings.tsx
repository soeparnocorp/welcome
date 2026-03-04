import React, { useState } from 'react';
import '../../App.css';
import './index.css';

const SettingsPage: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('menu');
  const [selectedMenu, setSelectedMenu] = useState('');

  const menuItems = [
    { id: 'akun', title: 'Akun', subtitle: 'Notifikasi keamanan, ganti nomor' },
    { id: 'privasi', title: 'Privasi', subtitle: 'Blokir kontak, pesan sementara' },
    { id: 'avatar', title: 'Avatar', subtitle: 'Buat, edit, foto profil' },
    { id: 'favorit', title: 'Favorit', subtitle: 'Tambah, susun urutan, hapus' },
    { id: 'chat', title: 'Chat', subtitle: 'Tema, wallpaper, riwayat chat' },
    { id: 'notifikasi', title: 'Notifikasi', subtitle: 'Pesan, grup & nada dering' },
    { id: 'penyimpanan', title: 'Penyimpanan dan data', subtitle: 'Penggunaan jaringan, unduh otomatis' },
    { id: 'aksesibilitas', title: 'Aksesibilitas', subtitle: 'Tingkatkan kontras, animasi' },
    { id: 'bahasa', title: 'Bahasa Aplikasi', subtitle: 'Indonesia (bahasa perangkat)' },
    { id: 'bantuan', title: 'Bantuan dan masukan', subtitle: 'Pusat bantuan, hubungi kami' }
  ];

  const renderContent = () => {
    if (activeLayer === 'menu') {
      return (
        <div className="settings-menu">
          <div className="settings-header">⚙️ Pengaturan</div>
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className="settings-item"
              onClick={() => {
                setSelectedMenu(item.id);
                setActiveLayer('detail');
              }}
            >
              <div className="settings-item-title">{item.title}</div>
              <div className="settings-item-subtitle">{item.subtitle}</div>
            </div>
          ))}
        </div>
      );
    }

    if (activeLayer === 'detail') {
      const item = menuItems.find(i => i.id === selectedMenu);
      return (
        <div className="detail-layer">
          <div className="detail-header">
            <span className="back-button" onClick={() => setActiveLayer('menu')}>←</span>
            <h2>{item?.title}</h2>
          </div>
          <div className="detail-content">
            <p>Detail {item?.title} akan di sini</p>
            {/* Tambahkan form sesuai kebutuhan */}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="settings-container">
      {renderContent()}
    </div>
  );
};

export default SettingsPage;
