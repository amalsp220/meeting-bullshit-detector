import React from 'react';
import './Dashboard.css';

const MetricCard = ({ title, value, subtitle, icon, color, suffix = '', trend }) => (
  <div className={`metric-card metric-card--${color}`}>
    <div className="metric-card__header">
      <span className="metric-card__icon">{icon}</span>
      <span className="metric-card__title">{title}</span>
    </div>
    <div className="metric-card__value">
      {value}<span className="metric-card__suffix">{suffix}</span>
    </div>
    <div className="metric-card__subtitle">{subtitle}</div>
    {trend !== undefined && (
      <div className="metric-card__bar">
        <div
          className="metric-card__bar-fill"
          style={{
            width: `${Math.min(trend, 100)}%`,
            background:
              color === 'danger'
                ? 'var(--danger)'
                : color === 'success'
                ? 'var(--success)'
                : color === 'warning'
                ? 'var(--warning)'
                : 'var(--primary)',
          }}
        />
      </div>
    )}
  </div>
);

const Dashboard = ({ analysis, isAnalyzing, meetingDuration }) => {
  // Return empty state if no analysis yet
  if (!analysis) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <h2 className="dashboard__title">
            <span className="live-badge">Ready for Analysis</span>
          </h2>
        </div>
        <div className="metrics-grid">
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
            Start recording or paste a transcript to see analysis metrics here.
          </p>
        </div>
      </div>
    );
  }

  const { productiveScore = 0, bsScore = 0, decisionsCount = 0, circularTopics = 0, alerts = [], keywords = [] } = analysis;
  
  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    return m < 1 ? `${s}s` : `${m}m`;
  };
  
  const efficiency =
    productiveScore + bsScore > 0 ? Math.round((productiveScore / (productiveScore + bsScore)) * 100) : 0;
  const timeSaved = Math.round((meetingDuration * (bsScore / 100)) / 60);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__title">
          <span className="live-badge">{isAnalyzing ? <span className="analyzing">Analyzing...</span> : 'Live Metrics'}</span>
        </h2>
        {alerts && alerts.length > 0 && (
          <div className="alert-strip">
            {alerts.map((alert, i) => (
              <div key={i} className={`alert-item alert--${alert.type || 'warning'}`}>
                <span>{alert.icon || '⚠️'}</span>
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="metrics-grid">
        <MetricCard
          title="Productive Score"
          value={productiveScore}
          subtitle="Decision-making quality"
          icon="✅"
          color="success"
          suffix="/100"
          trend={productiveScore}
        />
        <MetricCard
          title="BS Score"
          value={bsScore}
          subtitle="Circular discussions detected"
          icon="💩"
          color="danger"
          suffix="/100"
          trend={bsScore}
        />
        <MetricCard
          title="Decisions Made"
          value={decisionsCount}
          subtitle="Clear action items"
          icon="🎯"
          color="primary"
          suffix=""
        />
        <MetricCard
          title="Circular Topics"
          value={circularTopics}
          subtitle="Topics discussed 3+ times"
          icon="🔄"
          color="warning"
          suffix=""
        />
        <MetricCard
          title="Meeting Efficiency"
          value={efficiency}
          subtitle="Time well spent"
          icon="⚡"
          color="accent"
          suffix="%"
          trend={efficiency}
        />
        <MetricCard
          title="Potential Time Saved"
          value={timeSaved}
          subtitle="By cutting circular talk"
          icon="⏰"
          color="secondary"
          suffix="m"
        />
      </div>
      {keywords && keywords.length > 0 && (
        <div className="keyword-section">
          <h3 className="keyword-title">Hot Topics</h3>
          <div className="keyword-tags">
            {keywords.map((kw, i) => (
              <span key={i} className={`keyword-tag keyword-tag--${kw.type || 'neutral'}`}>
                {kw.word || kw}
                {kw.count && <span className="keyword-count">{kw.count}</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
