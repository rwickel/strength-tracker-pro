import type { FormulaId, Exercise, SetLog } from "./types";

export const FORMULAS: { id: FormulaId; name: string; desc: string }[] = [
  { id: "epley", name: "Epley", desc: "w × (1 + reps/30)" },
  { id: "brzycki", name: "Brzycki", desc: "w × 36 / (37 − reps)" },
  { id: "lombardi", name: "Lombardi", desc: "w × reps^0.10" },
  { id: "oconner", name: "O'Conner", desc: "w × (1 + reps/40)" },
];

export function estimate1RM(weight: number, reps: number, formula: FormulaId): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  switch (formula) {
    case "epley":
      return weight * (1 + reps / 30);
    case "brzycki":
      if (reps >= 37) return weight;
      return (weight * 36) / (37 - reps);
    case "lombardi":
      return weight * Math.pow(reps, 0.1);
    case "oconner":
      return weight * (1 + reps / 40);
  }
}

/** total system load for a set (adds bodyweight for bodyweight-kind exercises) */
export function totalLoad(set: SetLog, exercise: Exercise): number {
  if (exercise.kind === "bodyweight") {
    const bw = set.bodyweight ?? exercise.bodyweight ?? 0;
    return set.weight + bw;
  }
  return set.weight;
}

export function set1RM(set: SetLog, exercise: Exercise, formula: FormulaId): number {
  return estimate1RM(totalLoad(set, exercise), set.reps, formula);
}

/** percentages from 60% to 105% in 5% increments */
export const PERCENTAGES = [60, 65, 70, 75, 80, 85, 90, 95, 100, 105];

export function repTargetFor(pct: number): string {
  if (pct <= 65) return "8–12";
  if (pct <= 75) return "5–8";
  if (pct <= 85) return "3–5";
  if (pct <= 92) return "2–3";
  return "1";
}

export function zoneFor(pct: number): "light" | "mod" | "heavy" | "max" {
  if (pct < 75) return "light";
  if (pct < 85) return "mod";
  if (pct < 95) return "heavy";
  return "max";
}

export function formatWeight(n: number, unit: "kg" | "lb" = "kg"): string {
  if (!isFinite(n)) return "—";
  return `${(Math.round(n * 10) / 10).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;
}
