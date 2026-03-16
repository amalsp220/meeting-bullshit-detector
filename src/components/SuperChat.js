import React, { useState } from 'react';
import { generateSuperChat } from '../utils/openaiService';

function SuperChat({ apiKey, transcript }) {
  const [topic, setTopic] = useState('');
  const [superChat, setSuperChat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key first.');
      return;
    }
    if (!transcript || transcript.length === 0) {
      setError('Please record or paste a meeting transcript first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const fullText = transcript.join(' ');
      const result = await generateSuperChat(fullText, topic, apiKey);
      setSuperChat(result);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="super-chat">
      <h2><span className="icon">\u{1F4AC}</span> Super Chat - Meeting Insights</h2>
      <p className="description">Ask any question about the meeting and get AI-powered answers!</p>
      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Ask a question about the meeting..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          className={`action-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Ask'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {superChat && (
        <div className="summary-panel">
          <h3>AI Response</h3>
          <div className="summary-content">{superChat}</div>
        </div>
      )}
    </div>
  );
}

export default SuperChat;
