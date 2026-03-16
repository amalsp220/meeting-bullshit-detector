import React, { useState } from 'react';
import { summarizeYouTubeVideo } from '../utils/openaiService';

function YouTubeSummarizer({ apiKey }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSummarize = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key first.');
      return;
    }
    if (!videoUrl) {
      setError('Please enter a YouTube video URL.');
      return;
    }
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid video link.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await summarizeYouTubeVideo(videoId, apiKey);
      setSummary(result);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="youtube-summarizer">
      <h2><span className="icon">📺</span> YouTube Video Summarizer</h2>
      <div className="input-group">
        <input
          type="text"
          className="text-input"
          placeholder="Paste YouTube video URL here..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button
          className={`action-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleSummarize}
          disabled={isLoading}
        >
          {isLoading ? 'Summarizing...' : 'Summarize'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {summary && (
        <div className="summary-panel">
          <h3>Summary</h3>
          <div className="summary-content">{summary}</div>
        </div>
      )}
    </div>
  );
}

export default YouTubeSummarizer;
