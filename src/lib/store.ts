import { useEffect, useState, useSyncExternalStore } from "react";
import type { AppSettings, Exercise, SetLog } from "./types";

const KEYS = {
  exercises: "rm.exercises.v1",
  sets: "rm.sets.v1",
  settings: "rm.settings.v1",
};

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }
function subscribe(l: Listener) { listeners.add(l); return () => listeners.delete(l); }

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

const DEFAULT_SETTINGS: AppSettings = { formula: "epley", unit: "kg" };

const SEED_EXERCISES: Exercise[] = [
  { id: "seed-pullup", name: "Weighted Pull-Up", kind: "bodyweight", bodyweight: 80, createdAt: Date.now() - 86400000 * 7 },
  { id: "seed-dip", name: "Weighted Dip", kind: "bodyweight", bodyweight: 80, createdAt: Date.now() - 86400000 * 6 },
  { id: "seed-squat", name: "Back Squat", kind: "standard", createdAt: Date.now() - 86400000 * 5 },
  { id: "seed-bench", name: "Bench Press", kind: "standard", createdAt: Date.now() - 86400000 * 4 },
];

const SEED_SETS: SetLog[] = [
  { id: "s1", exerciseId: "seed-pullup", date: Date.now() - 86400000 * 7, weight: 20, reps: 5, bodyweight: 80 },
  { id: "s2", exerciseId: "seed-pullup", date: Date.now() - 86400000 * 4, weight: 25, reps: 5, bodyweight: 80 },
  { id: "s3", exerciseId: "seed-pullup", date: Date.now() - 86400000 * 1, weight: 30, reps: 6, bodyweight: 80 },
  { id: "s4", exerciseId: "seed-squat", date: Date.now() - 86400000 * 5, weight: 140, reps: 3 },
  { id: "s5", exerciseId: "seed-squat", date: Date.now() - 86400000 * 2, weight: 150, reps: 2 },
  { id: "s6", exerciseId: "seed-bench", date: Date.now() - 86400000 * 4, weight: 100, reps: 3 },
];

let seeded = false;
function ensureSeed() {
  if (seeded || typeof window === "undefined") return;
  seeded = true;
  if (!localStorage.getItem(KEYS.exercises)) localStorage.setItem(KEYS.exercises, JSON.stringify(SEED_EXERCISES));
  if (!localStorage.getItem(KEYS.sets)) localStorage.setItem(KEYS.sets, JSON.stringify(SEED_SETS));
  if (!localStorage.getItem(KEYS.settings)) localStorage.setItem(KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
}

function useStored<T>(key: string, fallback: T): T {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { ensureSeed(); setHydrated(true); }, []);
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const raw = localStorage.getItem(key);
      return raw ?? "__null__";
    },
    () => "__null__",
  );
  if (!hydrated) return fallback;
  if (value === "__null__") return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export function useExercises(): Exercise[] {
  return useStored<Exercise[]>(KEYS.exercises, []);
}
export function useSets(): SetLog[] {
  return useStored<SetLog[]>(KEYS.sets, []);
}
export function useSettings(): AppSettings {
  return useStored<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(s: AppSettings) { write(KEYS.settings, s); }

export function upsertExercise(ex: Exercise) {
  const list = read<Exercise[]>(KEYS.exercises, []);
  const i = list.findIndex((e) => e.id === ex.id);
  if (i >= 0) list[i] = ex; else list.push(ex);
  write(KEYS.exercises, list);
}
export function deleteExercise(id: string) {
  write(KEYS.exercises, read<Exercise[]>(KEYS.exercises, []).filter((e) => e.id !== id));
  write(KEYS.sets, read<SetLog[]>(KEYS.sets, []).filter((s) => s.exerciseId !== id));
}

export function addSet(set: SetLog) {
  const list = read<SetLog[]>(KEYS.sets, []);
  list.push(set);
  write(KEYS.sets, list);
}
export function updateSet(set: SetLog) {
  const list = read<SetLog[]>(KEYS.sets, []);
  const i = list.findIndex((s) => s.id === set.id);
  if (i >= 0) {
    list[i] = set;
    write(KEYS.sets, list);
  }
}
export function deleteSet(id: string) {
  write(KEYS.sets, read<SetLog[]>(KEYS.sets, []).filter((s) => s.id !== id));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
