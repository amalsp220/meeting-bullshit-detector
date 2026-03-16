import React, { useState } from 'react';
import './Header.css';

const Header = ({ apiKey, setApiKey, isRecording, meetingDuration }) => {
  const [showApiInput, setShowApiInput] = useState(!apiKey);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setShowApiInput(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">
            <span className="logo-emoji">🎯</span>
          </div>
          <div className="logo-text">
            <h1>Meeting <span className="gradient-text">BS</span> Detector</h1>
            <p>AI-Powered Meeting Intelligence</p>
          </div>
        </div>
      </div>

      <div className="header-center">
        {isRecording && (
          <div className="recording-indicator">
            <div className="rec-dot"></div>
            <span className="rec-text">LIVE</span>
            <span className="rec-timer">{meetingDuration}</span>
          </div>
        )}
      </div>

      <div className="header-right">
        {showApiInput ? (
          <div className="api-key-form">
            <div className="api-input-wrapper">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Enter OpenAI API Key..."
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
                className="api-input"
              />
              <button className="show-btn" onClick={() => setShowKey(!showKey)}>
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
            <button className="save-btn" onClick={handleSaveKey} disabled={!tempKey}>
              Save Key
            </button>
          </div>
        ) : (
          <div className="api-status">
            <div className="status-badge connected">
              <span className="status-dot"></span>
              <span>API Connected</span>
            </div>
            <button className="change-key-btn" onClick={() => setShowApiInput(true)}>
              Change Key
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
