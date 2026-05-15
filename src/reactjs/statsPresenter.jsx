import { useEffect, useMemo, useState, useContext } from 'react';
import StatsView from '../views/statsView';
import StatsContext from './statsContext';

const DEFAULT_MUSCLES = ['Chest','Back','Shoulders','Biceps','Triceps','Legs','Core','Glutes'];

function computeMusclePercentagesFromSessions(sessions = [], forDate = new Date()) {
  const month = forDate.getMonth();
  const year = forDate.getFullYear();

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

  return { percentages, totalSessionsThisMonth: total };
}

export default function StatsPresenter({ trainModel } = {}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('month');

  // Try to read the StatsContext without throwing. If no provider is present,
  // fall back to deriving data from the injected trainModel prop (passed by App).
  const ctx = useContext(StatsContext);
  const statsDataFromCtx = ctx?.statsData;
  const updateStats = ctx?.updateStats;
  const ctxAddSession = ctx?.addSession;

  const statsData = statsDataFromCtx ?? (trainModel ? {
    totalVolume: trainModel.totalVolume,
    comparison: trainModel.comparison,
    monthlyData: trainModel.monthlyData,
    totalSessions: trainModel.totalSessions ?? (trainModel.sessions ? trainModel.sessions.length : 0),
    avgPerWeek: trainModel.avgPerWeek,
    totalTime: trainModel.totalTime,
    bestStreak: trainModel.bestStreak,
    prs: trainModel.prs,
    sessions: trainModel.sessions,
    musclePercentages: trainModel.musclePercentages,
  } : {});

  // Helper for external callers (if needed) — keep context API available
  const addSession = (session) => {
    const next = [...(statsData.sessions || []), session];
    if (typeof updateStats === 'function') {
      updateStats({ sessions: next });
    } else if (typeof ctxAddSession === 'function') {
      try { ctxAddSession(session); } catch (e) { console.warn('ctxAddSession failed', e); }
    } else if (trainModel && typeof trainModel.notify === 'function') {
      // best-effort: notify listeners on the model
      try { trainModel.notify({ type: 'workoutSaved', session }); } catch (e) { console.warn('trainModel.notify failed', e); }
    } else {
      console.warn('No updateStats/ctxAddSession/trainModel available to add session');
    }
  };

  // Compute derived display values memoized on statsData
  const derived = useMemo(() => {
    const totalVolume = statsData.totalVolume ?? 0;
    const thousands = Math.floor(totalVolume / 1000);
    const remainder = totalVolume % 1000;

    const monthlyData = Array.isArray(statsData.monthlyData) ? statsData.monthlyData : [];

    // muscle percentages: prefer explicit, else compute from sessions, else fallback demo
    let musclePercentages = statsData.musclePercentages || {};
    if (!musclePercentages || Object.keys(musclePercentages).length === 0) {
      const { percentages } = computeMusclePercentagesFromSessions(statsData.sessions || [], new Date());
      musclePercentages = percentages;
    }
    if (!musclePercentages || Object.keys(musclePercentages).length === 0) {
      musclePercentages = { Chest:85, Back:72, Shoulders:68, Biceps:60, Triceps:55, Legs:40, Core:50, Glutes:30 };
    }

    const undertrained = Object.entries(musclePercentages).filter(([m,p]) => p < 50).map(([m]) => m);

    return {
      totalVolume, thousands, remainder,
      comparison: statsData.comparison ?? 0,
      monthlyData,
      totalSessions: statsData.totalSessions ?? 0,
      avgPerWeek: statsData.avgPerWeek ?? 0,
      totalTime: statsData.totalTime ?? 0,
      bestStreak: statsData.bestStreak ?? 0,
      prs: statsData.prs || [],
      musclePercentages,
      undertrained,
    };
  }, [statsData]);

  // Keep context-derived muscle percentage synced into statsData if missing
  useEffect(() => {
    if (typeof updateStats === 'function') {
      if ((!statsData.musclePercentages || Object.keys(statsData.musclePercentages).length === 0) && derived.musclePercentages) {
        updateStats({ musclePercentages: derived.musclePercentages });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derived.musclePercentages]);

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
      derived={derived}
      addSession={addSession}
    />
  );
}
