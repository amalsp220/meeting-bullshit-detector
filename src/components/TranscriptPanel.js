import React, { useEffect, useRef } from 'react';
import './TranscriptPanel.css';

const TranscriptPanel = ({ transcript, isRecording }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <div className="transcript-empty">
        <div className="transcript-empty__icon">📋</div>
        <h3>No Transcript Yet</h3>
        <p>{isRecording ? 'Start speaking — words will appear here in real-time' : 'Start recording a meeting to see the live transcript'}</p>
      </div>
    );
  }

  return (
    <div className="transcript">
      <div className="transcript__header">
        <h3 className="transcript__title">Live Transcript</h3>
        <span className="transcript__count">{transcript.length} entries</span>
      </div>
      <div className="transcript__list">
        {transcript.map((entry, index) => (
          <div key={entry.id} className="transcript__entry animate-fade">
            <div className="transcript__entry-meta">
              <span className="transcript__index">#{index + 1}</span>
              <span className="transcript__time">{entry.timestamp}</span>
            </div>
            <p className="transcript__text">{entry.text}</p>
          </div>
        ))}
        {isRecording && (
          <div className="transcript__listening">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontSize: 13 }}>Listening...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TranscriptPanel;
