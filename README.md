# Meeting BS Detector

🎯 **AI-powered real-time meeting analyzer** that tracks productive vs circular discussions using Speech-to-text, NLP sentiment analysis, and a live dashboard.

## 🌟 Features

- **Real-time Speech Recognition**: Capture meeting transcripts using Web Speech API
- **AI Analysis**: Powered by OpenAI GPT-4 Mini to detect:
  - Productivity score (0-100)
  - "BS" Score (circular, vague, unproductive talk)
  - Sentiment analysis
  - Key decisions and action items
  - Circular topics (repeated discussions)
  - Recommendations

- **Live Dashboard**: Real-time metrics including:
  - Meeting duration
  - Recording indicator
  - Productivity metrics
  - Sentiment tracking
  - BS detection alerts

- **Manual Input**: Paste meeting transcripts for analysis
- **Dark Theme**: Modern, eye-friendly interface

## 📋 Project Structure

```
src/
├── components/
│   ├── Header.js           # Header with API key input & status
│   ├── Dashboard.js        # Metrics display component
│   ├── MeetingRecorder.js  # Recording & manual input UI
│   ├── TranscriptPanel.js  # Live transcript display
│   ├── AnalysisPanel.js    # Analysis results display
│   └── [CSS files]         # Component styling
├── utils/
│   └── openaiService.js    # OpenAI API integration
├── App.js                  # Main app component
├── App.css                 # App styling
├── index.js                # React entry point
└── index.css               # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amalsp220/meeting-bullshit-detector.git
cd meeting-bullshit-detector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📖 Usage

### 1. Set API Key
- Click "Change Key" or enter your OpenAI API key in the header
- The app stores it locally for convenience

### 2. Record a Meeting
- Click "Start Recording" to begin capturing audio
- The app uses Web Speech API (Chrome recommended)
- Click "Stop Recording" to end
- Analysis runs automatically

### 3. Manual Input
- Click "Enter Text Manually" tab
- Paste your meeting transcript
- Click "Analyze Meeting"

### 4. View Analysis
- Switch to "AI Analysis" tab
- See:
  - Productivity & BS scores
  - Sentiment analysis
  - Key decisions
  - Action items
  - Recommended improvements

## 🛠️ Technology Stack

- **Frontend**: React 18
- **API**: OpenAI GPT-4 Mini
- **Speech**: Web Speech API (Browser native)
- **Styling**: CSS3 with CSS Variables
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🔑 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "lucide-react": "^0.294.0",
  "framer-motion": "^10.16.0",
  "react-circular-progressbar": "^2.1.0"
}
```

## 📊 API Integration

The app uses OpenAI's Chat Completions API with detailed prompts for meeting analysis:

```javascript
// Analyzes meeting transcripts and returns:
- Productivity score
- BS/circular discussion score
- Sentiment analysis
- Decisions and action items
- Circular topics
- Recommendations
```

## ⚙️ Environment Variables

Currently, the OpenAI API key is stored in browser's localStorage for convenience.

**Future Enhancement**: Move to environment variables or backend authentication.

## 🎨 UI/UX Features

- Dark theme optimized for long meetings
- Real-time metrics with smooth animations
- Responsive design for desktop and tablet
- Accessibility-friendly color contrasts
- Intuitive tab navigation

## 📝 API Response Format

The OpenAI service returns structured JSON with:

```json
{
  "productiveScore": 75,
  "bsScore": 25,
  "sentimentScore": 80,
  "sentiment": "positive",
  "decisionsCount": 3,
  "circularTopics": 2,
  "summary": "Overall productive meeting...",
  "decisions": [...],
  "actionItems": [...],
  "circularTopics": [...],
  "recommendations": [...],
  "keywords": [...],
  "alerts": [...]
}
```

## 🐛 Known Issues & Future Work

- Web Speech API support varies across browsers (Chrome recommended)
- Real-time transcription accuracy depends on audio quality and microphone
- Consider adding:
  - Backend API for secure key storage
  - Multiple language support
  - Export reports (PDF/CSV)
  - Meeting history & analytics
  - Integration with calendar apps

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push and open a PR

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

**Amal SP** - AI/Data Science Developer
- GitHub: [@amalsp220](https://github.com/amalsp220)

## 🙏 Acknowledgments

- OpenAI for GPT-4 Mini API
- React team for the excellent framework
- GitHub for free hosting

---

**Live Demo**: [https://amalsp220.github.io/meeting-bullshit-detector](https://amalsp220.github.io/meeting-bullshit-detector)

⭐ If you find this helpful, please star the repository!
