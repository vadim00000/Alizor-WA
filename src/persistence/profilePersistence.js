import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export function fetchUserProfile(userId) {
  return getDoc(doc(db, "users", userId)).then((snap) => snap.data() ?? null);
}

export function saveUserProfile(userId, payload) {
  return setDoc(doc(db, "users", userId), payload, { merge: true });
}
