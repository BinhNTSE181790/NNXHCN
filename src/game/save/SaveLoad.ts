//SaveLoad
import type { QuizId } from "@/data/questions";

export type MapId = 1 | 2 | 3;

export type ScoreState = {
  // Score phụ (map 1 + 2)
  sideTotalTimeMs: number;
  sideAttempts: number;

  // Score chính (final)
  mainTotalTimeMs: number;
  mainAttempts: number;
};

export type SaveStateV1 = {
  v: 1;
  playerName: string;
  mapId: MapId;
  // spawn in world coords
  px: number;
  py: number;
  score: ScoreState;
  completed: Partial<Record<QuizId, boolean>>;
  helpShown: boolean;
  lastSavedAt: number;
};

const KEY = "btls_save_v1";

export function defaultScoreState(): ScoreState {
  return {
    sideTotalTimeMs: 0,
    sideAttempts: 0,
    mainTotalTimeMs: 0,
    mainAttempts: 0,
  };
}

export function defaultSave(playerName = "") : SaveStateV1 {
  return {
    v: 1,
    playerName,
    mapId: 1,
    px: 140,
    py: 360,
    score: defaultScoreState(),
    completed: {},
    helpShown: false,
    lastSavedAt: Date.now(),
  };
}

export function hasSave() {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(KEY);
}

export function loadSave(): SaveStateV1 | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveStateV1;
    if (!parsed || parsed.v !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(s: SaveStateV1) {
  if (typeof window === "undefined") return;
  s.lastSavedAt = Date.now();
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSave() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
