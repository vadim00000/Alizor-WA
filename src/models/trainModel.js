import { searchExercises, getExercisesByBodyPart } from "../exerciseSource";
import { resolvePromise } from "../resolvePromise";

const DEFAULT_SETS_PER_EXERCISE = 3;
const DEFAULT_REPS_PER_SET = 8;

export const trainModel = {
  templates: [],
  selectedTemplateId: null,

  selectedBodyPart: null,
  searchResultsPromiseState: {},
  exercisesPromiseState: {},

  sessions: [],
  activeSession: null,
  selectedHomeSessionId: null,

  loadTemplatesPromiseState: {},
  saveTemplatePromiseState: {},
  loadSessionsPromiseState: {},
  saveSessionPromiseState: {},

  templateToSave: null,
  templateToDeleteId: null,
  sessionToSave: null,

  showHistory: false,

  currentUserId: null,

  setTemplates(loaded) {
    this.templates = loaded;
    if (
      this.selectedTemplateId != null &&
      !loaded.some((t) => t.id === this.selectedTemplateId)
    ) {
      this.selectedTemplateId = null;
    }
  },

  setSessions(loaded) {
    this.sessions = loaded;
  },

  toggleSelectedHomeSessionId(sessionId) {
    this.selectedHomeSessionId =
      this.selectedHomeSessionId === sessionId ? null : sessionId;
  },

  selectTemplate(id) {
    this.selectedTemplateId = id;
  },

  createTemplate(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const now = Date.now();
    const template = {
      id: now,
      createdAt: now,
      name: trimmed,
      exercises: [],
    };

    this.templates = [...this.templates, template];
    this.selectedTemplateId = template.id;
  },

  addExerciseToTemplate(exercise) {
    if (this.selectedTemplateId === null) return;

    this.templates = this.templates.map((t) => {
      if (t.id !== this.selectedTemplateId) return t;
      if (t.exercises.find((e) => e.id === exercise.id)) return t;

      const entry = {
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart ?? null,
        gifUrl: exercise.gifUrl ?? null,
        target: exercise.target ?? null,
        equipment: exercise.equipment ?? null,
        sets: DEFAULT_SETS_PER_EXERCISE,
      };

      return { ...t, exercises: [...t.exercises, entry] };
    });
  },

  removeExerciseFromTemplate(exercise) {
    if (this.selectedTemplateId === null) return;

    this.templates = this.templates.map((t) => {
      if (t.id !== this.selectedTemplateId) return t;
      return {
        ...t,
        exercises: t.exercises.filter((e) => e.id !== exercise.id),
      };
    });
  },

  setExerciseSetsCount(exerciseId, count) {
    if (this.selectedTemplateId === null) return;

    const n = Number(count);
    const clamped = Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;

    this.templates = this.templates.map((t) => {
      if (t.id !== this.selectedTemplateId) return t;
      return {
        ...t,
        exercises: t.exercises.map((e) =>
          e.id === exerciseId ? { ...e, sets: clamped } : e
        ),
      };
    });
  },

  saveSelectedTemplate() {
    const template = this.templates.find(
      (t) => t.id === this.selectedTemplateId
    );
    if (!template) return;

    this.templateToSave = {
      id: template.id,
      name: template.name,
      createdAt: template.createdAt,
      exercises: template.exercises.map((e) => ({ ...e })),
    };
  },

  removeSelectedTemplate() {
    if (this.selectedTemplateId === null) return;

    this.templateToDeleteId = this.selectedTemplateId;

    this.templates = this.templates.filter(
      (t) => t.id !== this.selectedTemplateId
    );
    this.selectedTemplateId = null;
  },

  doSearch() {
    resolvePromise(searchExercises(), this.searchResultsPromiseState);
  },

  setBodyPart(bodyPart) {
    this.selectedBodyPart = bodyPart;

    resolvePromise(
      getExercisesByBodyPart(bodyPart),
      this.exercisesPromiseState
    );
  },

  startSession(templateId) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return;

    const now = Date.now();
    this.activeSession = {
      id: now,
      templateId: template.id,
      templateName: template.name,
      performedAt: now,
      exercises: template.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        bodyPart: ex.bodyPart ?? null,
        gifUrl: ex.gifUrl ?? null,
        sets: Array.from({ length: Math.max(1, ex.sets || 1) }, () => ({
          weight: null,
          reps: DEFAULT_REPS_PER_SET,
        })),
      })),
    };
  },

  updateActiveSet(exerciseId, setIndex, patch) {
    if (!this.activeSession) return;

    let next = { ...patch };
    if ("weight" in next) {
      const raw = next.weight;
      const n = raw === "" || raw == null ? null : Number(raw);
      next.weight = n != null && Number.isFinite(n) ? n : null;
    }
    if ("reps" in next) {
      const r = Number(next.reps);
      next.reps = Number.isFinite(r) && r >= 1 ? Math.floor(r) : 1;
    }

    this.activeSession = {
      ...this.activeSession,
      exercises: this.activeSession.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, i) =>
            i === setIndex ? { ...s, ...next } : s
          ),
        };
      }),
    };
  },

  cancelActiveSession() {
    this.activeSession = null;
  },

  saveActiveSession() {
    if (!this.activeSession) return;

    this.sessionToSave = {
      id: this.activeSession.id,
      templateId: this.activeSession.templateId,
      templateName: this.activeSession.templateName,
      performedAt: this.activeSession.performedAt,
      exercises: this.activeSession.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({ ...s })),
      })),
    };
  },

  getWeekSessions() {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return this.sessions.filter((session) => {
      const timestamp = Number(session.performedAt);
      return Number.isFinite(timestamp) && timestamp >= oneWeekAgo;
    });
  },

  toggleShowHistory() {
    this.showHistory = !this.showHistory;
  }
};
