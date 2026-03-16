import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');

  return (
    <div className="app" style={{color:'white'}}>
      <Header apiKey={apiKey} setApiKey={setApiKey} isRecording={false} meetingDuration="00:00" />
      <main className="main-content">
        <h2>Meeting BS Detector is loading...</h2>
        <p>Full features coming soon. Please wait or refresh the page.</p>
      </main>
    </div>
  );
}

export default App;
