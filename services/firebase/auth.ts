import { SESSION_COOKIE } from "@/lib/constants";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { User } from "@/domain/user";
import type { AuthCredentials, AuthService } from "@/services/types";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";

function writeCookie(userId: string) {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(userId)}; path=/; max-age=${60 * 60 * 24 * 14}; SameSite=Lax`;
}

function clearCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

function mapUser(uid: string, email: string | null, displayName: string | null): User {
  return {
    id: uid,
    role: "citizen",
    displayName: displayName || email?.split("@")[0] || "Citizen",
    email: email || "",
    preferredLanguage: "en",
  };
}

function firebaseErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password")) {
    return "Email or password is not correct.";
  }
  if (code.includes("email-already-in-use")) {
    return "That email already has an account. Try signing in.";
  }
  if (code.includes("weak-password")) {
    return "Use a password of at least 6 characters.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  return "Could not complete that request. Check your connection and try again.";
}

async function persistProfile(user: User) {
  const db = getFirestoreDb();
  if (!db) return;
  await setDoc(
    doc(db, "users", user.id),
    {
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export const firebaseAuthService: AuthService = {
  async signIn(credentials: AuthCredentials) {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { ok: false, code: "unavailable", message: "Firebase is not configured." };
    }
    if (!credentials.password) {
      return { ok: false, code: "invalid", message: "Enter your password." };
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = mapUser(cred.user.uid, cred.user.email, cred.user.displayName);
      writeCookie(user.id);
      return { ok: true, data: user };
    } catch (error) {
      return { ok: false, code: "invalid", message: firebaseErrorMessage(error) };
    }
  },
  async signUp(credentials: AuthCredentials) {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { ok: false, code: "unavailable", message: "Firebase is not configured." };
    }
    if (!credentials.password) {
      return { ok: false, code: "invalid", message: "Choose a password." };
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      if (credentials.displayName) {
        await updateProfile(cred.user, { displayName: credentials.displayName });
      }
      const user = mapUser(cred.user.uid, cred.user.email, credentials.displayName || cred.user.displayName);
      await persistProfile(user);
      writeCookie(user.id);
      return { ok: true, data: user };
    } catch (error) {
      return { ok: false, code: "invalid", message: firebaseErrorMessage(error) };
    }
  },
  async requestPasswordReset(email: string) {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { ok: false, code: "unavailable", message: "Firebase is not configured." };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        ok: true,
        data: { message: "If that email is registered, Firebase will send a reset link." },
      };
    } catch (error) {
      return { ok: false, code: "invalid", message: firebaseErrorMessage(error) };
    }
  },
  async signOut() {
    const auth = getFirebaseAuth();
    if (auth) await firebaseSignOut(auth);
    clearCookie();
  },
  async getSession() {
    const auth = getFirebaseAuth();
    if (!auth) return null;
    const current = auth.currentUser;
    if (current) {
      writeCookie(current.uid);
      return mapUser(current.uid, current.email, current.displayName);
    }
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (fbUser) => {
        unsub();
        if (!fbUser) {
          resolve(null);
          return;
        }
        writeCookie(fbUser.uid);
        resolve(mapUser(fbUser.uid, fbUser.email, fbUser.displayName));
      });
    });
  },
};
