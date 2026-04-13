import { reaction } from "mobx";

let persistenceConnected = false;

/**
 * Connect train model to Firestore lifecycle using MobX reaction.
 * It reloads workouts whenever auth user changes.
 */
export function connectToPersistence(model, sessionModel, watchFunction = reaction) {
  if (persistenceConnected) return;
  persistenceConnected = true;

  watchFunction(
    () => sessionModel.user?.uid ?? null,
    (userId) => {
      model.currentUserId = userId;
      model.loadWorkouts(userId);
    },
    { fireImmediately: true }
  );
}
