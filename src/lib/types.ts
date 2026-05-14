export type FormulaId = "epley" | "brzycki" | "lombardi" | "oconner";

export type ExerciseKind = "standard" | "bodyweight";

export interface Exercise {
  id: string;
  name: string;
  kind: ExerciseKind;
  /** for bodyweight-style exercises, used as default added to load */
  bodyweight?: number;
  notes?: string;
  createdAt: number;
}

export interface SetLog {
  id: string;
  exerciseId: string;
  date: number;
  /** weight added/loaded (excluding bodyweight) */
  weight: number;
  reps: number;
  /** bodyweight at the time of the set, if exercise.kind === "bodyweight" */
  bodyweight?: number;
  rpe?: number;
}

export interface AppSettings {
  formula: FormulaId;
  unit: "kg" | "lb";
}
