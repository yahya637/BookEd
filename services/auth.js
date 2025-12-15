// services/auth.js
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

let _authReadyPromise;

// Vent til Firebase har restored auth state fra AsyncStorage
export function waitForAuthReady() {
  if (_authReadyPromise) return _authReadyPromise;

  _authReadyPromise = new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, () => {
      unsub();
      resolve(true);
    });
  });

  return _authReadyPromise;
}

export async function ensureSignedIn() {
  await waitForAuthReady();

  if (auth.currentUser) return auth.currentUser;

  const res = await signInAnonymously(auth);
  return res.user;
}

export async function signUpOrLink(email, password) {
  await waitForAuthReady();

  const e = (email || "").trim();
  const p = (password || "").trim();
  if (!e || !p) throw new Error("Email og password mangler.");

  const user = auth.currentUser;

  if (user && user.isAnonymous) {
    const cred = EmailAuthProvider.credential(e, p);
    const res = await linkWithCredential(user, cred);
    return res.user;
  }

  const res = await createUserWithEmailAndPassword(auth, e, p);
  return res.user;
}

export async function login(email, password) {
  await waitForAuthReady();

  const e = (email || "").trim();
  const p = (password || "").trim();
  const res = await signInWithEmailAndPassword(auth, e, p);
  return res.user;
}

export async function logout() {
  await signOut(auth);

  // ryd lokal cache så du ikke ser gamle bookings efter logout
  await AsyncStorage.removeItem("@bookings");
}

