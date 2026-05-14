import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export function subscribeAuth(onUserChanged) {
  return onAuthStateChanged(auth, onUserChanged);
}
