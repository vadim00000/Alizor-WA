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
  // promise state holder used by firestore persistence to surface save status
  saveStatsPromiseState: {},
  // load promise state holder used by firestore persistence to surface load status
  loadStatsPromiseState: {},
  // UI state (moved here so views don't need useState)
  uiActiveTab: 'overview',
  uiSelectedExercise: null,
  uiSelectedExerciseSeries: [],

  setUiActiveTab(tab) {
    this.uiActiveTab = tab;
  },

  setUiSelectedExercise(ex) {
    this.uiSelectedExercise = ex;
  },

  setUiSelectedExerciseSeries(series) {
    this.uiSelectedExerciseSeries = Array.isArray(series) ? series : [];
  },

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

  // persistence for stats is handled by src/models/firestoreModel.js
};

export default statsModel;
