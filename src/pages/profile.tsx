import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Profile.css';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    avatar: null as string | null
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId') || localStorage.getItem('userId');
    
    if (userId) {
      // Ambil profile dari API
      fetch(`/api/profile?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setProfile({
            displayName: data.displayName || '',
            bio: data.bio || '',
            avatar: data.avatar || null
          });
        });
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...profile })
    });
    
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <span className="back-button" onClick={() => window.history.back()}>←</span>
        <h2>Profile</h2>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="profile-avatar">
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" />
        ) : (
          <div className="avatar-placeholder">
            {profile.displayName?.charAt(0) || '👤'}
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={e => setProfile({...profile, displayName: e.target.value})}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell something about yourself"
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                // Upload ke R2
              }}
            />
          </div>
          <button type="submit">Save Profile</button>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-row">
            <strong>Name:</strong> {profile.displayName || 'Not set'}
          </div>
          <div className="info-row">
            <strong>Bio:</strong> {profile.bio || 'No bio'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
