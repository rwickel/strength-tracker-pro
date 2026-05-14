import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSet, uid } from "@/lib/store";
import type { Exercise, FormulaId, SetLog } from "@/lib/types";
import { estimate1RM, formatWeight, totalLoad } from "@/lib/oneRm";
import { Plus } from "lucide-react";

export function QuickLogger({
  exercise,
  formula,
  unit,
  defaultBodyweight,
}: {
  exercise: Exercise;
  formula: FormulaId;
  unit: "kg" | "lb";
  defaultBodyweight?: number;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [bw, setBw] = useState(defaultBodyweight?.toString() ?? "");

  const preview = useMemo(() => {
    const w = Number(weight) || 0;
    const r = Number(reps) || 0;
    if (!w || !r) return 0;
    const fakeSet: SetLog = {
      id: "preview", exerciseId: exercise.id, date: Date.now(),
      weight: w, reps: r,
      bodyweight: exercise.kind === "bodyweight" ? Number(bw) || 0 : undefined,
    };
    return estimate1RM(totalLoad(fakeSet, exercise), r, formula);
  }, [weight, reps, bw, exercise, formula]);

  function log() {
    const w = Number(weight);
    const r = Number(reps);
    if (!w || !r) return;
    addSet({
      id: uid(),
      exerciseId: exercise.id,
      date: Date.now(),
      weight: w,
      reps: r,
      bodyweight: exercise.kind === "bodyweight" ? Number(bw) || 0 : undefined,
    });
    setWeight(""); setReps("");
  }

  return (
    <div className="rounded-xl border border-border bg-gradient-surface p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick log</h3>
        {preview > 0 && (
          <span className="text-xs text-muted-foreground">
            est. 1RM <span className="font-mono font-semibold text-primary">{formatWeight(preview, unit)}</span>
          </span>
        )}
      </div>
      <div className={`grid gap-2 ${exercise.kind === "bodyweight" ? "grid-cols-3" : "grid-cols-2"}`}>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Added ({unit})</Label>
          <Input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" className="h-11 font-mono text-base" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Reps</Label>
          <Input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="5" className="h-11 font-mono text-base" />
        </div>
        {exercise.kind === "bodyweight" && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">BW ({unit})</Label>
            <Input type="number" inputMode="decimal" value={bw} onChange={(e) => setBw(e.target.value)} placeholder="80" className="h-11 font-mono text-base" />
          </div>
        )}
      </div>
      <Button onClick={log} disabled={!weight || !reps} className="mt-3 w-full bg-gradient-ember text-primary-foreground shadow-glow hover:opacity-90">
        <Plus className="mr-1.5 h-4 w-4" /> Log set
      </Button>
    </div>
  );
}
