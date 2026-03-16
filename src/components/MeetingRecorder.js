import React, { useState } from 'react';
import './MeetingRecorder.css';

const MeetingRecorder = ({
  isRecording,
  startRecording,
  stopRecording,
  clearSession,
  handleManualAnalyze,
  setFullText,
  setAnalysis,
  isAnalyzing,
  hasContent,
  apiKey
}) => {
  const [manualText, setManualText] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      setFullText(manualText);
      setAnalysis(null);
      handleManualAnalyze(manualText);
    }
  };

  return (
    <div className="recorder">
      <div className="recorder__hero">
        <div className={`recorder__orb ${isRecording ? 'recorder__orb--active' : ''}`}>
          <div className="recorder__orb-inner">
            <span className="recorder__orb-icon">
              {isRecording ? '\u{1F3A4}' : '\u{1F7E2}'}
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
          <h2 className="recorder__title">
            {isRecording ? 'Recording...' : 'Ready to Record'}
          </h2>
          <p className="recorder__subtitle">
            {isRecording
              ? 'Meeting is in progress. Click to stop.'
              : 'Click the microphone to start recording your meeting.'}
          </p>
        </div>
        <div className="recorder__controls">
          <button
            className={`recorder__btn ${isRecording ? 'recorder__btn--recording' : 'recorder__btn--start'}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          {hasContent && (
            <button
              className="recorder__btn recorder__btn--secondary"
              onClick={clearSession}
              disabled={isAnalyzing || isRecording}
            >
              Clear Session
            </button>
          )}
        </div>
      </div>

      <div className="recorder__manual">
        <button
          className="recorder__toggle"
          onClick={() => setShowManual(!showManual)}
          disabled={isRecording || isAnalyzing}
        >
          {showManual ? '\u{1F645} Hide Manual Input' : '\u{270D} Enter Text Manually'}
        </button>
        {showManual && (
          <div className="recorder__manual-panel">
            <textarea
              className="recorder__textarea"
              placeholder="Paste or type your meeting transcript here..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={8}
            />
            <div className="recorder__manual-actions">
              <button
                className="action-btn"
                onClick={handleManualSubmit}
                disabled={!manualText.trim() || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Meeting'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingRecorder;
