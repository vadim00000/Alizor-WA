import { reaction } from "mobx";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { resolvePromise } from "../resolvePromise";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

let trainPersistenceConnected = false;
let profilePersistenceConnected = false;

/**
 * Connect train model to Firestore lifecycle using MobX reactions.
 * Loads templates and sessions on auth change, persists template
 * saves/deletes and session saves whenever the model exposes a new
 * intent (templateToSave, templateToDeleteId, sessionToSave).
 */
export function connectToPersistence(model, sessionModel, watchFunction = reaction) {
  if (trainPersistenceConnected) return;
  trainPersistenceConnected = true;

  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      model.currentUserId = userId;

      if (userId) {
        const templatesPromise = getDocs(
          collection(db, "users", userId, "templates")
        ).then((snapshot) => {
          const loaded = snapshot.docs.map((d) => d.data());
          model.setTemplates(loaded);
          return loaded;
        });

        resolvePromise(templatesPromise, model.loadTemplatesPromiseState);

        const sessionsPromise = getDocs(
          collection(db, "users", userId, "sessions")
        ).then((snapshot) => {
          const loaded = snapshot.docs.map((d) => d.data());
          model.setSessions(loaded);
          return loaded;
        });

        resolvePromise(sessionsPromise, model.loadSessionsPromiseState);
      } else {
        model.setTemplates([]);
        model.setSessions([]);
        model.loadTemplatesPromiseState = {};
        model.loadSessionsPromiseState = {};
      }
    },
    { fireImmediately: true }
  );
  watchFunction(
    () => model.templateToSave,
    (template) => {
      const userId = sessionModel.user?.uid;
      if (userId && template) {
        const promise = setDoc(doc(db, "users", userId, "templates", String(template.id)), template).then(() => {
          model.templateToSave = null;
          return template;
        });
        resolvePromise(promise, model.saveTemplatePromiseState);
      }
    }
  );

  watchFunction(
    () => model.templateToDeleteId,
    (templateId) => {
      const userId = sessionModel.user?.uid;
      if (userId && templateId) {
        const promise = deleteDoc(doc(db, "users", userId, "templates", String(templateId))).then(() => {
          model.templateToDeleteId = null;
          return templateId;
        });
        resolvePromise(promise, model.saveTemplatePromiseState);
      }
    }
  );

  watchFunction(
    () => model.sessionToSave,
    (session) => {
      const userId = sessionModel.user?.uid;
      if (userId && session) {
        const promise = setDoc(doc(db, "users", userId, "sessions", String(session.id)), session).then(() => {
          model.sessions = [...model.sessions, session];
          model.activeSession = null;
          model.sessionToSave = null;
          return session;
        });
        resolvePromise(promise, model.saveSessionPromiseState);
      }
    }
  );
}

export function connectProfilePersistence(model, sessionModel, watchFunction = reaction) {
  if (profilePersistenceConnected) return;
  profilePersistenceConnected = true;

  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      model.setCurrentUserId(userId);

      if (userId) {
        const promise = getDoc(doc(db, "users", userId)).then((snap) => {
          if (snap.exists()) {
            model.setProfileData(snap.data());
          } else {
            model.setProfileData(null);
          }
          return snap;
        });

        resolvePromise(promise, model.loadProfilePromiseState);
      } else {
        model.setProfileData(null);
      }
    },
    { fireImmediately: true }
  );

  watchFunction(
    () => model.setToSave,
    (shouldSave) => {
      const userId = sessionModel.user?.uid;
      if (userId && shouldSave) {

        // Append/update weight history per-minute: if the last entry has the same
        // minute (YYYY-MM-DD HH:MM) then replace it, otherwise append a new entry.
        try {
          const hist = Array.isArray(model.weightHistory) ? model.weightHistory.slice() : [];
          const now = new Date();
          const last = hist.length ? hist[hist.length - 1] : null;
          const sameMinute = last && (() => {
            try {
              const lastDate = new Date(Number(last.ts));
              return lastDate.getFullYear() === now.getFullYear() && lastDate.getMonth() === now.getMonth() && lastDate.getDate() === now.getDate() && lastDate.getHours() === now.getHours() && lastDate.getMinutes() === now.getMinutes();
            } catch (e) { return false; }
          })();

          if (model.weightKg != null) {
            const point = { ts: now.getTime(), weightKg: Number(model.weightKg) };
            if (sameMinute) {
              hist[hist.length - 1] = point;
            } else {
              hist.push(point);
            }
          }

          model.weightHistory = hist;

          const profileData = {
            age: model.age,
            sex: model.sex,
            weightKg: model.weightKg,
            targetWeightKg: model.targetWeightKg,
            weightHistory: model.weightHistory,
            lastModifiedAt: serverTimestamp(),
          };

          const promise = setDoc(doc(db, "users", userId), profileData, { merge: true })
            .then(() => {
              model.setToSave = false;
              return profileData;
            });

          resolvePromise(promise, model.saveProfilePromiseState);
          return;
        } catch (e) {
          // fall back to naive save if anything fails
          console.warn('weightHistory append failed', e);
        }

        const profileData = {
          age: model.age,
          sex: model.sex,
          weightKg: model.weightKg,
          targetWeightKg: model.targetWeightKg,
        };

        const promise = setDoc(doc(db, "users", userId), profileData, { merge: true })
          .then(() => {
            model.setToSave = false;
            return profileData;
          });

        resolvePromise(promise, model.saveProfilePromiseState);
      }
    }
  );
}

export function connectAuthPersistence(sessionModel) {
  onAuthStateChanged(auth, (firebaseUser) => {
    sessionModel.setSession(firebaseUser);
  });
}

export function connectStatsPersistence(statsModel, sessionModel, watchFunction = reaction) {
  // Keep idempotent
  if (!statsModel || !sessionModel) return;

  // Watch for user changes and load stats for user
  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      statsModel.currentUserId = userId;
      if (userId) {
        // delegate loading to the model (which may call persistence layer)
        try { statsModel.loadStats(userId); } catch (e) { console.warn('statsModel.loadStats failed', e); }
      }
    },
    { fireImmediately: true }
  );

  // Watch for changes in statsModel and persist them
  watchFunction(
    () => [statsModel.sessions.length, statsModel.totalVolume, JSON.stringify(statsModel.musclePercentages)],
    () => {
      const uid = sessionModel.user?.uid;
      if (!uid) return;
      try {
        const statsData = {
          sessions: statsModel.sessions,
          monthlyData: statsModel.monthlyData,
          totalVolume: statsModel.totalVolume,
          comparison: statsModel.comparison,
          totalSessions: statsModel.totalSessions,
          avgPerWeek: statsModel.avgPerWeek,
          totalTime: statsModel.totalTime,
          bestStreak: statsModel.bestStreak,
          prs: statsModel.prs,
          musclePercentages: statsModel.musclePercentages,
          lastModifiedAt: serverTimestamp(),
        };

        const promise = setDoc(doc(db, 'users', uid, 'stats', 'summary'), statsData, { merge: true })
          .then(() => {
            // return the saved payload for consistency with resolvePromise handlers
            return statsData;
          });

        // expose a promise state on the model similarly to templates/sessions
        resolvePromise(promise, statsModel.saveStatsPromiseState);
      } catch (e) { console.warn('saveStats failed', e); }
    }
  );
}

// stats persistence is performed inline inside connectStatsPersistence using setDoc
