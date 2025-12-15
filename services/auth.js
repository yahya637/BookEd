import { auth } from "../firebase";
import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
} from "firebase/auth";

export async function ensureSignedIn() {
  if (auth.currentUser) return auth.currentUser;
  const res = await signInAnonymously(auth);
  return res.user;
}

export async function signUpOrLink(email, password) {
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
  const e = (email || "").trim();
  const p = (password || "").trim();
  const res = await signInWithEmailAndPassword(auth, e, p);
  return res.user;
}

export async function logout() {
  await signOut(auth);
}

