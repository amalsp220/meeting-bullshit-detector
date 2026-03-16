import React from 'react';
import './AnalysisPanel.css';

const AnalysisPanel = ({ analysis, metrics, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="analysis-loading">
        <div className="analysis-spinner"></div>
        <h3>AI is analyzing your meeting...</h3>
        <p>Using GPT-4 to detect BS, circular discussions and extract insights</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="analysis-empty">
        <div className="analysis-empty__icon">🤖</div>
        <h3>No Analysis Yet</h3>
        <p>Record a meeting or paste text and click Analyze to get AI-powered insights</p>
        <div className="analysis-features">
          <div className="af-item">
            <span>💩</span>
            <div>
              <strong>BS Detection</strong>
              <p>Identifies circular, vague and unproductive talk</p>
            </div>
          </div>
          <div className="af-item">
            <span>🎯</span>
            <div>
              <strong>Decision Tracking</strong>
              <p>Extracts clear decisions and action items</p>
            </div>
          </div>
          <div className="af-item">
            <span>📊</span>
            <div>
              <strong>Sentiment Analysis</strong>
              <p>Tracks meeting mood and engagement levels</p>
            </div>
          </div>
          <div className="af-item">
            <span>⚡</span>
            <div>
              <strong>Efficiency Score</strong>
              <p>Measures how productively time was spent</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis animate-fade">
      <div className="analysis__header">
        <h3 className="analysis__title">🤖 AI Meeting Analysis</h3>
        <span className="analysis__badge">GPT-4 Powered</span>
      </div>

      {analysis.summary && (
        <div className="analysis__section">
          <h4 className="section-title">📋 Executive Summary</h4>
          <p className="section-content">{analysis.summary}</p>
        </div>
      )}

      <div className="analysis__scores">
        <div className="score-box score-box--productive">
          <div className="score-box__value">{metrics.productiveScore}</div>
          <div className="score-box__label">Productive</div>
          <div className="score-box__bar">
            <div style={{ width: `${metrics.productiveScore}%` }}></div>
          </div>
        </div>
        <div className="score-box score-box--bs">
          <div className="score-box__value">{metrics.bsScore}</div>
          <div className="score-box__label">BS Score</div>
          <div className="score-box__bar">
            <div style={{ width: `${metrics.bsScore}%` }}></div>
          </div>
        </div>
      </div>

      {analysis.decisions && analysis.decisions.length > 0 && (
        <div className="analysis__section">
          <h4 className="section-title">✅ Decisions Made ({analysis.decisions.length})</h4>
          <ul className="decision-list">
            {analysis.decisions.map((d, i) => (
              <li key={i} className="decision-item">{d}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.actionItems && analysis.actionItems.length > 0 && (
        <div className="analysis__section">
          <h4 className="section-title">📌 Action Items</h4>
          <ul className="action-list">
            {analysis.actionItems.map((item, i) => (
              <li key={i} className="action-item">
                <span className="action-num">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.circularTopics && analysis.circularTopics.length > 0 && (
        <div className="analysis__section">
          <h4 className="section-title">🔄 Circular Discussions Detected</h4>
          <div className="circular-list">
            {analysis.circularTopics.map((topic, i) => (
              <div key={i} className="circular-item">
                <span className="circular-icon">⚠️</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="analysis__section">
          <h4 className="section-title">💡 Recommendations</h4>
          <ul className="rec-list">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="rec-item">
                <span className="rec-bullet">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.sentiment && (
        <div className="analysis__section">
          <h4 className="section-title">🌡️ Meeting Sentiment</h4>
          <div className={`sentiment-badge sentiment--${analysis.sentiment.toLowerCase()}`}>
            {analysis.sentiment === 'positive' ? '😄' : analysis.sentiment === 'negative' ? '😟' : '😐'}
            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
