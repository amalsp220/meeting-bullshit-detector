import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MeetingRecorder from './components/MeetingRecorder';
import TranscriptPanel from './components/TranscriptPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { analyzeMeetingText } from './utils/openaiService';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [fullText, setFullText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [metrics, setMetrics] = useState({
    productiveScore: 0,
    bsScore: 0,
    decisionsCount: 0,
    circularTopics: 0,
    speakingTime: {},
    sentimentTrend: [],
    topKeywords: [],
    alerts: []
  });
  const [activeTab, setActiveTab] = useState('recorder');
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const analysisTimerRef = useRef(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (isRecording) {
      setMeetingStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
      analysisTimerRef.current = setInterval(() => {
        if (fullText.trim().length > 50) {
          runAnalysis(fullText);
        }
      }, 30000);
    } else {
      clearInterval(timerRef.current);
      clearInterval(analysisTimerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(analysisTimerRef.current);
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      if (finalTranscript) {
        const entry = {
          id: Date.now(),
          text: finalTranscript,
          timestamp: new Date().toLocaleTimeString(),
          type: 'final'
        };
        setTranscript(prev => [...prev, entry]);
        setFullText(prev => prev + ' ' + finalTranscript);
      }
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsRecording(false);
      }
    };
    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setMeetingDuration(0);
  }, [isRecording]);

  const stopRecording = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (fullText.trim()) {
      await runAnalysis(fullText, true);
    }
  }, [fullText]);

  const runAnalysis = async (text, isFinal = false) => {
    if (!apiKey || !text.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMeetingText(text, apiKey, isFinal);
      setAnalysis(result);
      setMetrics(prev => ({
        ...prev,
        productiveScore: result.productiveScore || prev.productiveScore,
        bsScore: result.bsScore || prev.bsScore,
        decisionsCount: result.decisionsCount || prev.decisionsCount,
        circularTopics: result.circularTopics || prev.circularTopics,
        topKeywords: result.keywords || prev.topKeywords,
        alerts: result.alerts || prev.alerts,
        sentimentTrend: [...prev.sentimentTrend, { time: new Date().toLocaleTimeString(), score: result.sentimentScore || 50 }]
      }));
    } catch (err) {
      console.error('Analysis error:', err);
    }
    setIsAnalyzing(false);
  };

  const handleManualAnalyze = () => {
    if (fullText.trim()) runAnalysis(fullText, true);
    else if (transcript.length > 0) {
      const text = transcript.map(t => t.text).join(' ');
      runAnalysis(text, true);
    }
  };

  const clearSession = () => {
    setTranscript([]);
    setFullText('');
    setAnalysis(null);
    setMeetingDuration(0);
    setMetrics({
      productiveScore: 0,
      bsScore: 0,
      decisionsCount: 0,
      circularTopics: 0,
      speakingTime: {},
      sentimentTrend: [],
      topKeywords: [],
      alerts: []
    });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <Header
        apiKey={apiKey}
        setApiKey={setApiKey}
        isRecording={isRecording}
        meetingDuration={formatTime(meetingDuration)}
      />
      <main className="main-content">
        <Dashboard metrics={metrics} isAnalyzing={isAnalyzing} meetingDuration={meetingDuration} />
        <div className="bottom-section">
          <div className="tab-nav">
            <button className={`tab-btn ${activeTab === 'recorder' ? 'active' : ''}`} onClick={() => setActiveTab('recorder')}>Meeting Recorder</button>
            <button className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`} onClick={() => setActiveTab('transcript')}>Live Transcript</button>
            <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>AI Analysis</button>
          </div>
          <div className="tab-content">
            {activeTab === 'recorder' && (
              <MeetingRecorder
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                clearSession={clearSession}
                handleManualAnalyze={handleManualAnalyze}
                isAnalyzing={isAnalyzing}
                hasContent={transcript.length > 0}
                apiKey={apiKey}
              />
            )}
            {activeTab === 'transcript' && (
              <TranscriptPanel transcript={transcript} isRecording={isRecording} />
            )}
            {activeTab === 'analysis' && (
              <AnalysisPanel analysis={analysis} metrics={metrics} isAnalyzing={isAnalyzing} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
