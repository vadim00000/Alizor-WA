import { useEffect, useState } from 'react';
import StatsView from '../views/statsView';
import { useStats } from './statsContext';

const DEFAULT_MUSCLES = ['Chest','Back','Shoulders','Biceps','Triceps','Legs','Core','Glutes'];

export default function StatsPresenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('month');

  const { statsData, updateStats } = useStats();

  // helper to add a session coming from other modules
  const addSession = (session) => {
    const next = [...(statsData.sessions || []), session];
    updateStats({ sessions: next });
  };

  // recompute muscle percentages whenever sessions change
  useEffect(() => {
    const sessions = statsData.sessions || [];
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const sessionsThisMonth = sessions.filter(s => {
      const d = new Date(s.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const total = sessionsThisMonth.length || 0;
    const counts = {};
    DEFAULT_MUSCLES.forEach(m => counts[m] = 0);
    sessionsThisMonth.forEach(s => (s.muscles || []).forEach(m => counts[m] = (counts[m]||0) + 1));

    const percentages = {};
    DEFAULT_MUSCLES.forEach(m => {
      percentages[m] = total > 0 ? Math.round((counts[m] / total) * 100) : 0;
    });

    // only update if changed to avoid unnecessary renders
    const prev = statsData.musclePercentages || {};
    const changed = DEFAULT_MUSCLES.some(m => prev[m] !== percentages[m]);
    if (changed) {
      updateStats({ musclePercentages: percentages });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsData.sessions]);

  const handleTabChange = (tab) => {
    try { console.log('[StatsPresenter] handleTabChange ->', tab); } catch (e) {}
    setActiveTab(tab);
  };

  const handleViewModeChange = (mode) => {
    try { console.log('[StatsPresenter] handleViewModeChange ->', mode); } catch (e) {}
    setViewMode(mode);
  };

  return (
    <StatsView
      activeTab={activeTab}
      statsData={statsData}
      viewMode={viewMode}
      onTabChange={handleTabChange}
      onViewModeChange={handleViewModeChange}
    />
  );
}
