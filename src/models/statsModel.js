import { makeAutoObservable } from 'mobx';

// Simple MobX model for stats. Presenter will modify this model; persistence
// is handled in src/models/firestoreModel.js via a watch function.
export const statsModel = {
  currentUserId: null,
  sessions: [], // array of { date, muscles, volume, duration, calories }
  monthlyData: [],
  totalVolume: 0,
  comparison: 0,
  totalSessions: 0,
  avgPerWeek: 0,
  totalTime: 0,
  bestStreak: 0,
  prs: [],
  musclePercentages: {},

  // called by presenter to add a session
  addSession(session) {
    this.sessions = [...this.sessions, session];
    this.totalSessions = this.sessions.length;
    this.totalVolume = this.sessions.reduce((s, it) => s + (it.volume || 0), 0);
  },

  setMonthlyData(data) {
    this.monthlyData = data;
  },

  setMusclePercentages(pct) {
    this.musclePercentages = { ...pct };
  },

  setPRs(prs) {
    this.prs = prs;
  },

  // Persistence API: load/save are no-ops here; firestoreModel will call loadStats
  // and may call saveStats on changes — implement as placeholders to be replaced
  loadStats(userId) {
    // placeholder: in real app this would return a promise
    console.info('statsModel.loadStats called for user', userId);
    return Promise.resolve();
  },

  saveStats(userId) {
    console.info('statsModel.saveStats called for user', userId);
    return Promise.resolve();
  },
};

makeAutoObservable(statsModel);

export default statsModel;
