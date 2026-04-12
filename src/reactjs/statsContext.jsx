import { createContext, useContext, useState, useEffect } from 'react';
import { model as trainModel } from './trainModel';

const DEFAULT_MUSCLES = ['Chest','Back','Shoulders','Biceps','Triceps','Legs','Core','Glutes'];

const StatsContext = createContext(null);

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

export function StatsProvider({ children, initialData }) {
  const [statsData, setStatsData] = useState(
    initialData ?? {
      totalVolume: 34200,
      comparison: 18,
      monthlyData: [
        { month: 'Jan', volume: 2500 },
        { month: 'Feb', volume: 2800 },
        { month: 'Mar', volume: 2100 },
        { month: 'Apr', volume: 3200 },
        { month: 'May', volume: 2900 },
        { month: 'Jun', volume: 3100 },
        { month: 'Jul', volume: 2600 },
        { month: 'Aug', volume: 3400 },
        { month: 'Sep', volume: 2700 },
        { month: 'Oct', volume: 3300 },
        { month: 'Nov', volume: 2900 },
        { month: 'Dec', volume: 3600 },
      ],
      totalSessions: 47,
      avgPerWeek: 4.2,
      totalTime: 46,
      bestStreak: 18,
        // personal records (PRs)
        prs: initialData?.prs ?? [
          { name: 'Bench Press', date: '2026-03-19', value: 102, unit: 'kg', allTime: true },
          { name: 'Squat', date: '2026-02-28', value: 140, unit: 'kg' },
          { name: 'Deadlift', date: '2026-01-15', value: 170, unit: 'kg' },
          { name: 'OHP', date: '2026-03-10', value: 72, unit: 'kg' },
          { name: 'Pull-ups', date: '2026-03-05', value: 15, unit: 'reps' },
          { name: 'Dips', date: '2026-02-20', value: 30, unit: 'kg', note: '+30' },
        ],
      // optional: sessions array and computed musclePercentages
      sessions: initialData?.sessions ?? [],
      musclePercentages: initialData?.musclePercentages ?? {},
    }
  );

  // Utility to merge partial updates coming from other modules
  const updateStats = (patch) => {
    setStatsData((prev) => ({ ...prev, ...patch }));
  };

  // Append a session and recompute muscle percentages for the current month
  const addSession = (session) => {
    setStatsData((prev) => {
      const nextSessions = [...(prev.sessions || []), session];
      const { percentages } = computeMusclePercentagesFromSessions(nextSessions, new Date());
      return { ...prev, sessions: nextSessions, musclePercentages: percentages, totalSessions: nextSessions.length };
    });
  };

  // Subscribe to the trainModel so external modules (trainer UI) can push workouts
  useEffect(() => {
    if (!trainModel || typeof trainModel.subscribe !== 'function') return;
    const unsub = trainModel.subscribe((event) => {
      try {
        if (!event || !event.type) return;
        if (event.type === 'workoutSaved' && event.session) {
          // when a workout is saved in the model, add it as a stats session
          addSession(event.session);
        }
      } catch (e) {
        console.error('StatsContext: trainModel event handler error', e);
      }
    });

    return () => {
      try { unsub && unsub(); } catch (e) {}
    };
  }, []);

  const addPR = (pr) => {
    setStatsData(prev => ({ ...prev, prs: [...(prev.prs||[]), pr] }));
  };

  const computeMusclePercentages = (forDate = new Date()) => {
    return computeMusclePercentagesFromSessions(statsData.sessions || [], forDate);
  };

  // Compute a simple week vs last week comparison using sessions when available,
  // otherwise provide estimated values from aggregate statsData.
  const computeWeekCompare = (forDate = new Date()) => {
    const oneDay = 24 * 60 * 60 * 1000;
    // Find start of current week (Monday)
    const d = new Date(forDate);
    const day = (d.getDay() + 6) % 7; // 0=Mon
    const startOfWeek = new Date(d.getTime() - day * oneDay);
    startOfWeek.setHours(0,0,0,0);

    const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * oneDay);

    const sumForRange = (start, end) => {
      const sessions = statsData.sessions || [];
      const items = sessions.filter(s => {
        const sd = new Date(s.date);
        return sd >= start && sd < end;
      });
      const totalVolume = items.reduce((acc, it) => acc + (it.volume || 0), 0);
      const totalSessions = items.length;
      const avgDuration = items.length ? Math.round((items.reduce((a,b) => a + (b.duration||0),0) / items.length)) : 0;
      const calories = items.reduce((acc, it) => acc + (it.calories || 0), 0);
      return { totalVolume, totalSessions, avgDuration, calories };
    };

    const thisWeekRaw = sumForRange(startOfWeek, new Date(startOfWeek.getTime() + 7 * oneDay));
    const lastWeekRaw = sumForRange(startOfLastWeek, startOfWeek);

    // Fallback estimates when sessions have no detailed metrics
    const fallbackThisWeekVolume = Math.round((statsData.totalVolume || 0) / 4);
    const fallbackThisWeekSessions = Math.round((statsData.totalSessions || 0) / 4);
    const fallbackAvgDuration = Math.round(((statsData.totalTime || 0) / Math.max(statsData.totalSessions || 1,1)) * 60);
    const fallbackCalories = Math.round((fallbackThisWeekSessions || 1) * 500);

    const thisWeek = {
      volume: thisWeekRaw.totalVolume || fallbackThisWeekVolume,
      sessions: thisWeekRaw.totalSessions || fallbackThisWeekSessions,
      avgDuration: thisWeekRaw.avgDuration || fallbackAvgDuration,
      calories: thisWeekRaw.calories || fallbackCalories,
    };

    const lastWeek = {
      volume: lastWeekRaw.totalVolume || Math.round(thisWeek.volume * 0.9),
      sessions: lastWeekRaw.totalSessions || Math.max(0, thisWeek.sessions - 1),
      avgDuration: lastWeekRaw.avgDuration || Math.max(0, thisWeek.avgDuration - 3),
      calories: lastWeekRaw.calories || Math.max(0, Math.round(thisWeek.calories * 0.85)),
    };

    return { thisWeek, lastWeek };
  };

  return (
    <StatsContext.Provider value={{ statsData, setStatsData, updateStats, addSession, computeMusclePercentages }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return ctx;
}

export default StatsContext;
