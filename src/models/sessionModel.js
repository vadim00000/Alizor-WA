import { makeAutoObservable } from "mobx";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export const sessionModel = {
  user: null,
  authReady: false,

  setSession(firebaseUser) {
    this.user = firebaseUser;
    this.authReady = true;
  }
};

makeAutoObservable(sessionModel);

onAuthStateChanged(auth, (firebaseUser) => {
  sessionModel.setSession(firebaseUser);
});
