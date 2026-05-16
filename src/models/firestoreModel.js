import { reaction } from "mobx";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs} from "firebase/firestore";
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
        const promise = setDoc(
          doc(db, "users", userId, "templates", String(template.id)),
          template
        ).then(() => {
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
        const promise = deleteDoc(
          doc(db, "users", userId, "templates", String(templateId))
        ).then(() => {
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
        const promise = setDoc(
          doc(db, "users", userId, "sessions", String(session.id)),
          session
        ).then(() => {
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

/**
 * Load user profile document when auth user changes.
 */
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
