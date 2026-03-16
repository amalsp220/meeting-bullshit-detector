import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MeetingRecorder from './components/MeetingRecorder';
import TranscriptPanel from './components/TranscriptPanel';
import AnalysisPanel from './components/AnalysisPanel';
import YouTubeSummarizer from './components/YouTubeSummarizer';
import SuperChat from './components/SuperChat';
import { analyzeMeetingText, summarizeYouTubeVideo, generateSuperChat } from './utils/openaiService';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [fullText, setFullText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('recorder');
  const [youTubeUrl, setYouTubeUrl] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [superChatData, setSuperChatData] = useState(null);
  const [isGeneratingSuperChat, setIsGeneratingSuperChat] = useState(false);
  const [superChatText, setSuperChatText] = useState('');
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (apiKey) localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setMeetingDuration(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript;
          setTranscript(prev => [...prev, { id: Date.now(), text, timestamp: new Date().toLocaleTimeString(), type: 'final' }]);
          setFullText(prev => prev + ' ' + text);
        }
      }
    };
    recognition.onend = () => { if (isRecording) recognition.start(); };
    recognition.start();
    setIsRecording(true);
    setMeetingDuration(0);
  }, [isRecording]);

  const stopRecording = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    if (fullText.trim()) await runAnalysis(fullText);
  };

  const runAnalysis = async (text) => {
    if (!apiKey || !text.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMeetingText(text, apiKey);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (err) { console.error('Analysis error:', err); }
    setIsAnalyzing(false);
  };

  const handleYouTubeSummarize = async (url) => {
    if (!url || !apiKey) { alert('Please enter a YouTube URL and API key'); return; }
    setIsSummarizing(true);
    try {
      const result = await summarizeYouTubeVideo(url, apiKey);
      setSuperChatData(result);
    } catch (err) { alert('Failed to summarize: ' + err.message); }
    setIsSummarizing(false);
  };

  const handleSuperChat = async (text) => {
    if (!text || !apiKey) return;
    setIsGeneratingSuperChat(true);
    try {
      const result = await generateSuperChat(text, '', apiKey);
      setSuperChatData(result);
    } catch (err) { alert('Failed to generate Super Chat: ' + err.message); }
    setIsGeneratingSuperChat(false);
  };

  const clearSession = () => {
    setTranscript([]); setFullText(''); setAnalysis(null); setMeetingDuration(0);
    setYouTubeUrl(''); setSuperChatData(null); setSuperChatText('');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <Header apiKey={apiKey} setApiKey={setApiKey} isRecording={isRecording} meetingDuration={formatTime(meetingDuration)} />
      <main className="main-content">
        <Dashboard analysis={analysis} />
        <div className="bottom-section">
          <div className="tab-nav">
            <button className={`tab-btn ${activeTab === 'recorder' ? 'active' : ''}`} onClick={() => setActiveTab('recorder')}>Meeting Recorder</button>
            <button className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`} onClick={() => setActiveTab('transcript')}>Live Transcript</button>
            <button className={`tab-btn ${activeTab === 'youtube' ? 'active' : ''}`} onClick={() => setActiveTab('youtube')}>YouTube Summarizer</button>
            <button className={`tab-btn ${activeTab === 'superchat' ? 'active' : ''}`} onClick={() => setActiveTab('superchat')}>Super Chat</button>
            <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>AI Analysis</button>
          </div>
          <div className="tab-content">
            {activeTab === 'recorder' && <MeetingRecorder isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} clearSession={clearSession} handleManualAnalyze={runAnalysis} setFullText={setFullText} setAnalysis={setAnalysis} isAnalyzing={isAnalyzing} hasContent={transcript.length > 0} apiKey={apiKey} />}
            {activeTab === 'transcript' && <TranscriptPanel transcript={transcript} isRecording={isRecording} />}
            {activeTab === 'youtube' && <YouTubeSummarizer apiKey={apiKey} />}
            {activeTab === 'superchat' && <SuperChat apiKey={apiKey} transcript={transcript} />}
            {activeTab === 'analysis' && <AnalysisPanel analysis={analysis} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
