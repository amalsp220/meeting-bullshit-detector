import React, { useState } from 'react';
import './MeetingRecorder.css';

const MeetingRecorder = ({
  isRecording, startRecording, stopRecording,
  clearSession, handleManualAnalyze,
  isAnalyzing, hasContent, apiKey
}) => {
  const [manualText, setManualText] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      handleManualAnalyze(manualText);
    }
  };

  return (
    <div className="recorder">
      <div className="recorder__hero">
        <div className={`recorder__orb ${isRecording ? 'recorder__orb--active' : ''}`}>
          <div className="recorder__orb-inner">
            <span className="recorder__orb-icon">
              {isRecording ? '🎤' : '🟢'}
            </span>
          </div>
          {isRecording && (
            <>
              <div className="recorder__ripple recorder__ripple--1"></div>
              <div className="recorder__ripple recorder__ripple--2"></div>
              <div className="recorder__ripple recorder__ripple--3"></div>
            </>
          )}
        </div>

        <div className="recorder__status">
          <h3 className={`recorder__status-title ${isRecording ? 'recording' : ''}`}>
            {isRecording ? 'Recording in Progress...' : 'Ready to Analyze'}
          </h3>
          <p className="recorder__status-desc">
            {isRecording
              ? 'AI is listening and analyzing your meeting in real-time'
              : 'Start recording to detect BS, circular discussions and track productivity'}
          </p>
        </div>

        <div className="recorder__actions">
          {!isRecording ? (
            <button
              className="btn btn--primary btn--lg"
              onClick={startRecording}
              disabled={!apiKey}
            >
              <span className="btn__icon">🎤</span>
              Start Recording
            </button>
          ) : (
            <button
              className="btn btn--danger btn--lg"
              onClick={stopRecording}
            >
              <span className="btn__icon">⏹️</span>
              Stop & Analyze
            </button>
          )}

          {hasContent && !isRecording && (
            <button
              className="btn btn--secondary"
              onClick={handleManualAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <><span className="spinner"></span> Analyzing...</>
              ) : (
                <><span className="btn__icon">🤖</span> Re-Analyze</>
              )}
            </button>
          )}

          {hasContent && (
            <button className="btn btn--ghost" onClick={clearSession}>
              <span className="btn__icon">🗑️</span>
              Clear Session
            </button>
          )}
        </div>

        {!apiKey && (
          <div className="no-api-warning">
            <span>⚠️</span>
            <span>Please enter your OpenAI API key in the header to enable AI analysis</span>
          </div>
        )}
      </div>

      <div className="recorder__divider">
        <span>OR</span>
      </div>

      <div className="recorder__manual">
        <button
          className="toggle-manual-btn"
          onClick={() => setShowManual(!showManual)}
        >
          <span>{showManual ? '▼' : '▶'}</span>
          Paste Meeting Text Manually
        </button>

        {showManual && (
          <div className="manual-input-section animate-fade">
            <textarea
              className="manual-textarea"
              placeholder="Paste meeting notes, transcript, or discussion text here..."
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              rows={8}
            />
            <div className="manual-actions">
              <span className="char-count">{manualText.length} characters</span>
              <button
                className="btn btn--primary"
                onClick={handleManualSubmit}
                disabled={!manualText.trim() || isAnalyzing || !apiKey}
              >
                {isAnalyzing ? (
                  <><span className="spinner"></span> Analyzing...</>
                ) : (
                  <>🤖 Analyze This Text</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="recorder__features">
        <div className="feature-chip">
          <span>🎤</span>
          <span>Speech-to-Text</span>
        </div>
        <div className="feature-chip">
          <span>🧠</span>
          <span>NLP Analysis</span>
        </div>
        <div className="feature-chip">
          <span>📊</span>
          <span>Real-time Dashboard</span>
        </div>
        <div className="feature-chip">
          <span>⚡</span>
          <span>GPT-4 Powered</span>
        </div>
      </div>
    </div>
  );
};

export default MeetingRecorder;
