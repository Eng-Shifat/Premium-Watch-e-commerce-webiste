/**
 * Browser-side account system for the login / signup / OTP pages.
 *
 * Accounts, the session and the pending signup live in the visitor's browser (localStorage /
 * sessionStorage) — the same way the cart and orders already work in this project.
 *
 * NOTE: there is no email service connected yet, so the 4-digit OTP cannot be emailed.
 * While SHOW_DEMO_OTP is true the code is shown in a toast so the flow can be tested.
 * Set it to false once real email delivery is wired up.
 */
import { useSyncExternalStore } from "react";

export const SHOW_DEMO_OTP = true;
export const OTP_LENGTH = 4;
export const OTP_RESEND_SECONDS = 60;
const OTP_TTL_MS = 10 * 60 * 1000;

const USERS_KEY = "urbantick-users";
const SESSION_KEY = "urbantick-session";
const PENDING_KEY = "urbantick-pending-signup";
const CHANGE_EVENT = "urbantick-auth-change";

export type SessionUser = { id: string; username: string; email: string };
type StoredUser = SessionUser & { salt: string; hash: string; createdAt: string };
export type PendingSignup = {
  username: string;
  email: string;
  salt: string;
  hash: string;
  otp: string;
  sentAt: number;
  expiresAt: number;
  redirect?: string;
};

/* ─── storage helpers ───────────────────────────────── */
function readJSON<T>(store: Storage | undefined, key: string, fallback: T): T {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

const ls = () => (typeof window === "undefined" ? undefined : window.localStorage);
const ss = () => (typeof window === "undefined" ? undefined : window.sessionStorage);

const normEmail = (e: string) => e.trim().toLowerCase();

/* ─── crypto ────────────────────────────────────────── */
function randomHex(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // crypto.subtle only exists on https / localhost — simple fallback so the demo still works elsewhere
  let h = 5381;
  for (const b of data) h = ((h << 5) + h + b) >>> 0;
  return `fallback-${h.toString(16)}`;
}

function makeOtp() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return String(a[0] % 10 ** OTP_LENGTH).padStart(OTP_LENGTH, "0");
}

/* ─── users ─────────────────────────────────────────── */
const listUsers = () => readJSON<StoredUser[]>(ls(), USERS_KEY, []);

export function emailExists(email: string) {
  const e = normEmail(email);
  return listUsers().some((u) => u.email === e);
}

/* ─── signup + OTP ──────────────────────────────────── */
export async function startSignup(input: {
  username: string;
  email: string;
  password: string;
  redirect?: string;
}): Promise<PendingSignup> {
  const salt = randomHex();
  const now = Date.now();
  const pending: PendingSignup = {
    username: input.username.trim(),
    email: normEmail(input.email),
    salt,
    hash: await hashPassword(input.password, salt),
    otp: makeOtp(),
    sentAt: now,
    expiresAt: now + OTP_TTL_MS,
    redirect: input.redirect,
  };
  ss()?.setItem(PENDING_KEY, JSON.stringify(pending));
  return pending;
}

export function getPendingSignup(): PendingSignup | null {
  return readJSON<PendingSignup | null>(ss(), PENDING_KEY, null);
}

export function resendOtp(): PendingSignup | null {
  const p = getPendingSignup();
  if (!p) return null;
  const now = Date.now();
  const next = { ...p, otp: makeOtp(), sentAt: now, expiresAt: now + OTP_TTL_MS };
  ss()?.setItem(PENDING_KEY, JSON.stringify(next));
  return next;
}

export type VerifyResult =
  | { ok: true; redirect?: string }
  | { ok: false; reason: "no-signup" | "expired" | "wrong" | "taken" };

export function verifyOtp(code: string): VerifyResult {
  const p = getPendingSignup();
  if (!p) return { ok: false, reason: "no-signup" };
  if (Date.now() > p.expiresAt) return { ok: false, reason: "expired" };
  if (code !== p.otp) return { ok: false, reason: "wrong" };
  if (emailExists(p.email)) return { ok: false, reason: "taken" };

  const user: StoredUser = {
    id: `u-${randomHex(6)}`,
    username: p.username,
    email: p.email,
    salt: p.salt,
    hash: p.hash,
    createdAt: new Date().toISOString(),
  };
  ls()?.setItem(USERS_KEY, JSON.stringify([...listUsers(), user]));
  ls()?.setItem(SESSION_KEY, JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  ss()?.removeItem(PENDING_KEY);
  emitChange();
  return { ok: true, redirect: p.redirect };
}

/* ─── login / logout ────────────────────────────────── */
export type LoginResult =
  | { ok: true }
  | { ok: false; field: "email" | "password"; error: string };

export async function loginLocal(email: string, password: string): Promise<LoginResult> {
  const user = listUsers().find((u) => u.email === normEmail(email));
  if (!user) return { ok: false, field: "email", error: "No account found with this email." };
  if ((await hashPassword(password, user.salt)) !== user.hash) {
    return { ok: false, field: "password", error: "Incorrect password." };
  }
  ls()?.setItem(SESSION_KEY, JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  emitChange();
  return { ok: true };
}

export function logoutLocal() {
  ls()?.removeItem(SESSION_KEY);
  emitChange();
}

/* ─── session hook ──────────────────────────────────── */
let cachedRaw: string | null | undefined;
let cachedUser: SessionUser | null = null;

function getSnapshot(): SessionUser | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SESSION_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Non-hook read of the current session (client only). */
export function getLocalUser(): SessionUser | null {
  return typeof window === "undefined" ? null : getSnapshot();
}

/** The signed-in user (null when signed out, and on the server). */
export function useLocalUser(): SessionUser | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
