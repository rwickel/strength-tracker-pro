import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { upsertExercise, uid } from "@/lib/store";
import type { Exercise, ExerciseKind } from "@/lib/types";
import { Plus } from "lucide-react";

export function ExerciseFormDialog({
  trigger,
  initial,
  onSaved,
}: {
  trigger?: React.ReactNode;
  initial?: Exercise;
  onSaved?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<ExerciseKind>(initial?.kind ?? "standard");
  const [bw, setBw] = useState<string>(initial?.bodyweight?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const id = useMemo(() => initial?.id ?? uid(), [initial?.id]);

  function save() {
    if (!name.trim()) return;
    upsertExercise({
      id,
      name: name.trim(),
      kind,
      bodyweight: kind === "bodyweight" ? Number(bw) || 0 : undefined,
      notes: notes.trim() || undefined,
      createdAt: initial?.createdAt ?? Date.now(),
    });
    onSaved?.(id);
    setOpen(false);
    if (!initial) {
      setName(""); setBw(""); setNotes(""); setKind("standard");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-gradient-ember text-primary-foreground shadow-glow hover:opacity-90">
            <Plus className="mr-1.5 h-4 w-4" /> New lift
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit lift" : "New lift"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ex-name">Name</Label>
            <Input id="ex-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Weighted Pull-Up" />
          </div>

          <div className="space-y-1.5">
            <Label>Loading style</Label>
            <RadioGroup value={kind} onValueChange={(v) => setKind(v as ExerciseKind)} className="grid grid-cols-2 gap-2">
              <Label className={`cursor-pointer rounded-lg border border-border p-3 text-sm ${kind === "standard" ? "border-primary bg-primary/10" : ""}`}>
                <RadioGroupItem value="standard" className="sr-only" />
                <div className="font-medium">Standard</div>
                <div className="text-xs text-muted-foreground">External weight only</div>
              </Label>
              <Label className={`cursor-pointer rounded-lg border border-border p-3 text-sm ${kind === "bodyweight" ? "border-primary bg-primary/10" : ""}`}>
                <RadioGroupItem value="bodyweight" className="sr-only" />
                <div className="font-medium">Bodyweight + load</div>
                <div className="text-xs text-muted-foreground">Pull-ups, dips…</div>
              </Label>
            </RadioGroup>
          </div>

          {kind === "bodyweight" && (
            <div className="space-y-1.5">
              <Label htmlFor="ex-bw">Default bodyweight (kg)</Label>
              <Input id="ex-bw" type="number" inputMode="decimal" value={bw} onChange={(e) => setBw(e.target.value)} placeholder="80" />
              <p className="text-xs text-muted-foreground">Used as the default added to external load when logging sets.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ex-notes">Notes</Label>
            <Textarea id="ex-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Cues, grip, tempo…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} className="bg-gradient-ember text-primary-foreground">{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
