import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSet } from "@/lib/store";
import type { SetLog, Exercise } from "@/lib/types";
import { Pencil } from "lucide-react";
import { format } from "date-fns";

export function SetFormDialog({
  set,
  exercise,
  trigger,
}: {
  set: SetLog;
  exercise: Exercise;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());
  const [bw, setBw] = useState(set.bodyweight?.toString() ?? "");
  const [date, setDate] = useState(format(set.date, "yyyy-MM-dd"));

  function save() {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    const b = exercise.kind === "bodyweight" ? parseFloat(bw) || 0 : undefined;
    
    // Parse the date and maintain the original time if possible, 
    // or just use the start of the day for simplicity.
    const newDate = new Date(date);
    const d = newDate.getTime();

    updateSet({
      ...set,
      weight: w,
      reps: r,
      bodyweight: b,
      date: isNaN(d) ? set.date : d,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="icon" variant="ghost">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Edit set</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-weight">{exercise.kind === "bodyweight" ? "Added (kg)" : "Weight (kg)"}</Label>
              <Input
                id="edit-weight"
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-reps">Reps</Label>
              <Input
                id="edit-reps"
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
          </div>

          {exercise.kind === "bodyweight" && (
            <div className="space-y-1.5">
              <Label htmlFor="edit-bw">Bodyweight (kg)</Label>
              <Input
                id="edit-bw"
                type="number"
                inputMode="decimal"
                value={bw}
                onChange={(e) => setBw(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button onClick={save} className="w-full bg-primary text-primary-foreground sm:w-auto">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
