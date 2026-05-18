const DEFAULT_MUSCLES = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Glutes', 'Waist', 'Neck', 'Cardio'];

const MUSCLE_KEYWORDS = {
  Chest: ['chest', 'pectoral', 'pec'],
  Back: ['back', 'lats', 'latissimus', 'trap', 'trapezius'],
  Shoulders: ['shoulder', 'deltoid', 'delts'],
  Arms: ['arm', 'biceps', 'triceps', 'forearm', 'upper arm', 'lower arm'],
  Legs: ['upper leg', 'lower leg', 'quad', 'quads', 'hamstring', 'calf', 'thigh'],
  Core: ['core', 'abs', 'abdominal', 'ab'],
  Waist: ['waist'],
  Glutes: ['glute', 'butt', 'gluteus'],
  Neck: ['neck'],
  Cardio: ['cardio', 'run', 'bike', 'row', 'treadmill', 'elliptical'],
};

function normalizeModelList(values) {
  if (Array.isArray(values)) return values;
  if (values && typeof values[Symbol.iterator] === 'function') return Array.from(values);
  if (values && typeof values === 'object') return Object.values(values);
  return [];
}

function getSessionTimestamp(session) {
  const raw = session?.performedAt || session?.date || Date.now();
  const timestamp = Number(raw);
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function buildTemplateStats(templates, sessions) {
  const countsByTemplateId = new Map();

  for (const template of templates) {
    countsByTemplateId.set(template.id, {
      templateId: template.id,
      templateName: template.name,
      count: 0,
      exists: true,
    });
  }

  for (const session of sessions) {
    const existing = countsByTemplateId.get(session.templateId);
    if (existing) {
      existing.count += 1;
    } else {
      countsByTemplateId.set(session.templateId, {
        templateId: session.templateId,
        templateName: session.templateName,
        count: 1,
        exists: false,
      });
    }
  }

  return Array.from(countsByTemplateId.values()).sort((a, b) => b.count - a.count);
}

function computeMuscleCounts(sessions = [], options = { all: false }) {
  const now = new Date();
  const sessionsToCount = options.all
    ? sessions
    : sessions.filter((session) => {
        const date = new Date(getSessionTimestamp(session));
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

  const counts = {};
  DEFAULT_MUSCLES.forEach((muscle) => {
    counts[muscle] = 0;
  });

  sessionsToCount.forEach((session) => {
    const musclesInSession = new Set();

    if (Array.isArray(session.muscles) && session.muscles.length) {
      session.muscles.forEach((muscle) => musclesInSession.add(muscle));
    } else if (Array.isArray(session.exercises)) {
      session.exercises.forEach((exercise) => {
        const bodyPart = String(exercise.bodyPart || '').toLowerCase();

        for (const [muscle, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
          for (const keyword of keywords) {
            if (bodyPart.includes(keyword)) {
              musclesInSession.add(muscle);
              break;
            }
          }
        }
      });
    }

    musclesInSession.forEach((muscle) => {
      if (counts[muscle] !== undefined) counts[muscle] += 1;
    });
  });

  return counts;
}

function buildPrGroups(sessions = []) {
  const prsMap = new Map();

  sessions.forEach((session) => {
    if (!Array.isArray(session.exercises)) return;

    session.exercises.forEach((exercise) => {
      const exerciseName = exercise.name || exercise.id || '<unknown>';
      if (!Array.isArray(exercise.sets)) return;

      exercise.sets.forEach((set) => {
        const weight = Number(set.weight || 0);
        const reps = Number(set.reps || 0);
        const current = prsMap.get(exerciseName);

        if (!current) {
          prsMap.set(exerciseName, { name: exerciseName, weight, reps });
          return;
        }

        if (weight > current.weight || (weight === current.weight && reps > current.reps)) {
          prsMap.set(exerciseName, { name: exerciseName, weight, reps });
        }
      });
    });
  });

  const prs = Array.from(prsMap.values()).sort((a, b) => b.weight - a.weight || b.reps - a.reps);
  const prsByExercise = prs.reduce((accumulator, pr) => {
    const key = pr.name || 'Unknown';
    if (!accumulator[key]) accumulator[key] = [];
    accumulator[key].push(pr);
    return accumulator;
  }, {});

  return { prs, prsByExercise };
}

function buildWeightPoints(profileModel) {
  if (!profileModel || !Array.isArray(profileModel.weightHistory)) return [];

  return profileModel.weightHistory
    .map((entry) => {
      const timestamp = Number(entry.ts);
      const date = new Date(Number.isFinite(timestamp) ? timestamp : Date.now());
      return { x: date, y: Number(entry.weightKg) };
    })
    .sort((a, b) => a.x - b.x);
}

function buildExerciseSeries(sessions = []) {
  const exerciseMap = new Map();

  sessions.forEach((session) => {
    const sessionDate = new Date(getSessionTimestamp(session));
    if (!Array.isArray(session.exercises)) return;

    session.exercises.forEach((exercise) => {
      const exerciseName = exercise.name || exercise.id || '<unknown>';
      if (!Array.isArray(exercise.sets) || exercise.sets.length === 0) return;

      const maxWeight = exercise.sets.reduce((currentMax, set) => {
        const weight = Number(set.weight || 0);
        return weight > currentMax ? weight : currentMax;
      }, 0);

      if (maxWeight <= 0) return;

      const currentSeries = exerciseMap.get(exerciseName) || [];
      currentSeries.push({ x: sessionDate, y: maxWeight });
      exerciseMap.set(exerciseName, currentSeries);
    });
  });

  const exerciseSeries = {};
  exerciseMap.forEach((series, name) => {
    exerciseSeries[name] = series.sort((a, b) => a.x - b.x);
  });

  return exerciseSeries;
}

// Simple MobX model for stats. Presenter will read derived data from here;
// persistence is handled in src/models/firestoreModel.js via a watch function.
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

  getViewData(trainModel, profileModel) {
    const templates = normalizeModelList(trainModel?.templates);
    const sessions = normalizeModelList(trainModel?.sessions);
    const existingTemplateIds = new Set(templates.map((template) => String(template.id)));

    const sessionsNonDeleted = templates.length === 0 && sessions.length > 0
      ? sessions
      : sessions.filter((session) => existingTemplateIds.has(String(session.templateId)));

    const stats = buildTemplateStats(templates, sessionsNonDeleted);
    const totalSessions = sessionsNonDeleted.length;
    const totalVolume = sessionsNonDeleted.reduce((total, session) => {
      if (typeof session.volume === 'number') return total + session.volume;

      if (!Array.isArray(session.exercises)) return total;

      const sessionVolume = session.exercises.reduce((exerciseTotal, exercise) => {
        if (!Array.isArray(exercise.sets)) return exerciseTotal;

        return exerciseTotal + exercise.sets.reduce((setTotal, set) => {
          const reps = Number(set.reps || 0);
          const weight = Number(set.weight || 0);
          return setTotal + (reps * weight);
        }, 0);
      }, 0);

      return total + sessionVolume;
    }, 0);

    const exerciseSeries = buildExerciseSeries(sessionsNonDeleted);
    const { prs, prsByExercise } = buildPrGroups(sessionsNonDeleted);
    const muscleCounts = computeMuscleCounts(sessionsNonDeleted);
    const muscleEntries = Object.entries(muscleCounts)
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => b[1] - a[1]);

    return {
      stats,
      totalSessions,
      totalVolume,
      summaryCards: [
        { label: 'Sessions', value: totalSessions, unit: 'logged' },
        { label: 'Volume', value: totalVolume, unit: 'kg lifted' },
      ],
      overviewText: `Overview: ${totalSessions} sessions, total volume ${totalVolume}`,
      prsText: `PRs: ${prs.length} exercises`,
      muscleCounts,
      muscleEntries,
      prs,
      prsByExercise,
      exerciseNames: Object.keys(exerciseSeries).sort(),
      prExerciseNames: Object.keys(prsByExercise).sort(),
      weightPoints: buildWeightPoints(profileModel),
      exerciseSeries,
    };
  },

  // persistence for stats is handled by src/models/firestoreModel.js
};

export default statsModel;
