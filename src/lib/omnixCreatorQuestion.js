/**
 * Detect “who made you / OMNIX” style questions (incl. common typos) and fix the canonical answer.
 */

export const OMNIX_CREATOR_REPLY =
  "I was made by **Akshay Chaudhari** — he created OMNIX.";

export function matchesOmnixCreatorQuestion(text) {
  if (!text || typeof text !== "string") return false;

  const s = text.toLowerCase().replace(/\s+/g, " ").trim();

  const aboutAssistant =
    /\b(you|your|omnix)\b/.test(s) ||
    /\bthis\s+(ai|app|assistant|chatbot|bot)\b/.test(s);

  if (!aboutAssistant) return false;

  if (/\bwho\s+made\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+makes\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+(create[ds]?|creates|creat)\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+develop(s|ed)?\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+develop(s|ed)?\s+omnix\b/.test(s)) return true;
  if (/\bwho\s+builds?\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+built\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+design(s|ed)?\s+(you|omnix)\b/.test(s)) return true;
  if (/\bwho\s+founded\s+omnix\b/.test(s)) return true;
  if (/\bwho\s+owns?\s+omnix\b/.test(s)) return true;
  if (/\bwho(\s+is|'s)?\s+your\s+creator\b/.test(s)) return true;
  if (/\bwhos\s+your\s+creator\b/.test(s)) return true;
  if (/\bwho\s+is\s+(the\s+)?creator\s+of\s+omnix\b/.test(s)) return true;
  if (/\bwho\s+is\s+omnix\s+('s|s)?\s*creator\b/.test(s)) return true;

  if (/\b(who|whom)\b/.test(s) && /\bcreator\b/.test(s) && /\b(your|you|omnix)\b/.test(s))
    return true;

  return false;
}
