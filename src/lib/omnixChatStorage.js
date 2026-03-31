/**
 * Per-user chat persistence (Firebase uid). Legacy unscoped keys leaked data across accounts.
 */

export const LEGACY_SESSIONS_KEY = "omnix_sessions";
export const LEGACY_ACTIVE_KEY = "omnix_active";
export const LEGACY_CHAT_HISTORY_KEY = "omnix_chat_history";

export function sessionsKey(uid) {
  return `omnix_sessions:${uid}`;
}

export function activeChatKey(uid) {
  return `omnix_active:${uid}`;
}

export function chatHistoryKey(uid) {
  return `omnix_chat_history:${uid}`;
}

export function readSessions(uid) {
  if (!uid || typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(sessionsKey(uid)) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeSessions(uid, sessions) {
  if (!uid || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(sessionsKey(uid), JSON.stringify(sessions));
  } catch {
    /* ignore quota */
  }
}

export function readActiveChatId(uid) {
  if (!uid || typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(activeChatKey(uid));
    return v || null;
  } catch {
    return null;
  }
}

export function writeActiveChatId(uid, id) {
  if (!uid || typeof window === "undefined") return;
  try {
    if (id == null || id === "") window.localStorage.removeItem(activeChatKey(uid));
    else window.localStorage.setItem(activeChatKey(uid), String(id));
  } catch {
    /* ignore */
  }
}

/** Remove pre–per-user keys so switching accounts cannot resurrect shared blobs. */
export function clearLegacySharedChatStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEGACY_SESSIONS_KEY);
    window.localStorage.removeItem(LEGACY_ACTIVE_KEY);
    window.localStorage.removeItem(LEGACY_CHAT_HISTORY_KEY);
  } catch {
    /* ignore */
  }
}
