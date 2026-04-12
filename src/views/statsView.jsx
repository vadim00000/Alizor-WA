import { useState } from 'react';
import { useStats } from '../reactjs/statsContext';

export default function StatsView({
  activeTab: propActiveTab,
  statsData: propStatsData,
  viewMode: propViewMode,
  onTabChange: propOnTabChange,
  onViewModeChange: propOnViewModeChange,
}) {
  // If parent didn't pass props, fallback to context so other modules can update
  const { statsData: ctxStatsData, updateStats } = useStats();
  const activeTab = propActiveTab ?? 'overview';
  const statsData = propStatsData ?? ctxStatsData;
  const [viewMode, setViewMode] = useState(propViewMode ?? 'month');
  const onTabChange = propOnTabChange ?? (() => {});
  const onViewModeChange = propOnViewModeChange ?? ((mode) => setViewMode(mode));
  try { console.log('[StatsView] render', { activeTab, viewMode, statsData }); } catch (e) {}
  if (activeTab === 'overview') {
  const totalVolume = statsData?.totalVolume ?? 0;
    const thousands = Math.floor(totalVolume / 1000);
    const remainder = totalVolume % 1000;

    return (
      <div className="stats-container">
        {/* Header avec tabs */}
        <div className="stats-header">
          <h2>YOUR NUMBERS</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => onTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'muscles' ? 'active' : ''}`}
              onClick={() => onTabChange('muscles')}
            >
              Muscles
            </button>
            <button
              className={`tab ${activeTab === 'prs' ? 'active' : ''}`}
              onClick={() => onTabChange('prs')}
            >
              PRs
            </button>
            <button
              className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => onTabChange('compare')}
            >
              Compare
            </button>
          </div>
        </div>

        {/* Total Volume Card */}
        <div className="total-volume-card">
          <div className="volume-number">
            {thousands}
            <span className="volume-unit">{String(remainder).padStart(3, '0')} kg</span>
          </div>
          <p className="volume-label">Total volume this month</p>
          <p className={`volume-comparison ${statsData.comparison > 0 ? 'positive' : 'negative'}`}>
            {statsData.comparison > 0 ? '↑' : '↓'} {Math.abs(statsData.comparison)}% vs last month
          </p>
        </div>

        {/* Monthly Volume Chart */}
        <div className="monthly-chart-card">
          <div className="chart-header">
            <h3>Monthly volume</h3>
            <div className="view-mode-toggle">
              <button
                className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => onViewModeChange('month')}
              >
                Month
              </button>
              <button
                className={`toggle-btn ${viewMode === 'year' ? 'active' : ''}`}
                onClick={() => onViewModeChange('year')}
              >
                Year
              </button>
            </div>
          </div>
          <div className="chart-placeholder">
            {/* Ici tu peux ajouter une vraie librairie de graphiques comme Chart.js ou Recharts */}
            <p>Chart for {viewMode} view</p>
            <div className="bars">
              {statsData.monthlyData.map((data, idx) => (
                <div
                  key={idx}
                  className="bar"
                  style={{ height: `${(data.volume / 4000) * 100}%` }}
                  title={`${data.month}: ${data.volume}kg`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Sessions */}
          <div className="stat-card">
            <p className="stat-label">Total sessions</p>
            <p className="stat-value">{statsData.totalSessions}</p>
            <p className="stat-subtitle">this year</p>
          </div>

          {/* Avg per Week */}
          <div className="stat-card">
            <p className="stat-label">Avg per week</p>
            <p className="stat-value">{statsData.avgPerWeek}</p>
            <p className="stat-subtitle improving">↑ improving</p>
          </div>

          {/* Total Time */}
          <div className="stat-card">
            <p className="stat-label">Total time</p>
            <p className="stat-value">{statsData.totalTime}h</p>
            <p className="stat-subtitle">→ stable</p>
          </div>

          {/* Best Streak */}
          <div className="stat-card">
            <p className="stat-label">Best streak</p>
            <p className="stat-value">{statsData.bestStreak}d</p>
            <p className="stat-subtitle fire">🔥 your best</p>
          </div>
        </div>
      </div>
    );
  }

    if (activeTab === 'muscles') {
      try { console.log('[StatsView] muscles branch, musclePercentages:', statsData.musclePercentages); } catch (e) {}
    const DEFAULT_MUSCLES = ['Chest','Back','Shoulders','Biceps','Triceps','Legs','Core','Glutes'];

    // Prefer explicitly provided percentages, else compute from sessions if available
    let musclePercentages = statsData.musclePercentages || {};

    if ((!musclePercentages || Object.keys(musclePercentages).length === 0) && Array.isArray(statsData.sessions)) {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const sessionsThisMonth = statsData.sessions.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
      const total = sessionsThisMonth.length || 0;
      const counts = {};
      DEFAULT_MUSCLES.forEach(m => counts[m] = 0);
      sessionsThisMonth.forEach(s => (s.muscles || []).forEach(m => counts[m] = (counts[m]||0) + 1));
      musclePercentages = {};
      DEFAULT_MUSCLES.forEach(m => {
        musclePercentages[m] = total > 0 ? Math.round((counts[m] / total) * 100) : 0;
      });
    }

    // If still empty, fallback to demo values
    if (!musclePercentages || Object.keys(musclePercentages).length === 0) {
      musclePercentages = {
        Chest:85, Back:72, Shoulders:68, Biceps:60, Triceps:55, Legs:40, Core:50, Glutes:30
      };
    }

    const undertrained = Object.entries(musclePercentages).filter(([m,p]) => p < 50).map(([m]) => m);

    return (
      <div className="stats-container">
        <div className="stats-header">
          <h2>Training frequency by muscle group this month</h2>
          <div className="tabs">
            <button className={`tab ${activeTab === 'overview' ? '' : ''}`} onClick={() => onTabChange('overview')}>Overview</button>
            <button className={`tab active`}>Muscles</button>
            <button className={`tab`} onClick={() => onTabChange('prs')}>PRs</button>
            <button className={`tab`} onClick={() => onTabChange('compare')}>Compare</button>
          </div>
        </div>

        <div className="muscles-grid">
          {Object.keys(musclePercentages).map((muscle) => {
            const pct = musclePercentages[muscle];
            const isUnder = pct < 50;
            return (
              <div key={muscle} className={`muscle-card ${isUnder ? 'under' : ''}`}>
                <div className="muscle-name">{muscle}</div>
                <div className="muscle-bar" title={`${pct}%`}>
                  <div className="muscle-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className={`muscle-pct ${isUnder ? 'danger' : 'ok'}`}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {undertrained.length > 0 && (
          <div className="tip-card">
            <p>💡 Tip</p>
            <p>You're under-training {undertrained.join(' & ')}. Add 1–2 sessions per week focusing on those muscles to balance your physique.</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'prs') {
    const prs = statsData.prs || [];
    return (
      <div className="stats-container">
        <div className="stats-header">
          <h2>Personal records</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? '': ''}`}
              onClick={() => onTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'muscles' ? '' : ''}`}
              onClick={() => onTabChange('muscles')}
            >
              Muscles
            </button>
            <button
              className={`tab ${activeTab === 'prs' ? 'active' : ''}`}
              onClick={() => onTabChange('prs')}
            >
              PRs
            </button>
            <button
              className={`tab ${activeTab === 'compare' ? '' : ''}`}
              onClick={() => onTabChange('compare')}
            >
              Compare
            </button>
          </div>
        </div>

        <div className="prs-list">
          {prs.map((pr, idx) => (
            <div key={idx} className="pr-item">
              <div className="pr-left">
                <div className="pr-name">{pr.name}</div>
                <div className="pr-date">{pr.date}</div>
                {pr.allTime && <div className="pr-badge">🏆 All time PR</div>}
              </div>
              <div className="pr-right">
                <div className="pr-value">
                  {pr.note ? pr.note : pr.value}
                  <span className="pr-unit"> {pr.unit ?? 'kg'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'compare') {
    return (
      <div className="stats-container">
        <div className="stats-header">
          <h2>Compare</h2>
          <div className="tabs">
            <button className={`tab ${activeTab === 'overview' ? '' : ''}`} onClick={() => onTabChange('overview')}>Overview</button>
            <button className={`tab ${activeTab === 'muscles' ? '' : ''}`} onClick={() => onTabChange('muscles')}>Muscles</button>
            <button className={`tab ${activeTab === 'prs' ? '' : ''}`} onClick={() => onTabChange('prs')}>PRs</button>
            <button className={`tab active`} onClick={() => onTabChange('compare')}>Compare</button>
          </div>
        </div>

        <div className="compare-card">Compare Tab</div>
      </div>
    );
  }
}