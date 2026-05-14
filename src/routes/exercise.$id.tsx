import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useExercises, useSets, useSettings, deleteSet, deleteExercise } from "@/lib/store";
import { set1RM, formatWeight, totalLoad } from "@/lib/oneRm";
import { PercentageTable } from "@/components/PercentageTable";
import { ProgressionChart } from "@/components/ProgressionChart";
import { QuickLogger } from "@/components/QuickLogger";
import { ExerciseFormDialog } from "@/components/ExerciseFormDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/exercise/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Lift — OneRep` },
      { name: "description", content: `Estimated 1RM, training zones, and progression for ${params.id}.` },
    ],
  }),
  component: ExercisePage,
  notFoundComponent: () => <p>Lift not found.</p>,
  errorComponent: ({ error }) => <p className="text-destructive">{error.message}</p>,
});

function ExercisePage() {
  const { id } = Route.useParams();
  const exercises = useExercises();
  const sets = useSets();
  const settings = useSettings();
  const navigate = useNavigate();

  const exercise = exercises.find((e) => e.id === id);

  const exSets = useMemo(
    () => sets.filter((s) => s.exerciseId === id).sort((a, b) => b.date - a.date),
    [sets, id],
  );

  const oneRm = useMemo(() => {
    if (!exercise) return 0;
    if (exSets.length === 0) return 0;
    return Math.max(...exSets.map((s) => set1RM(s, exercise, settings.formula)));
  }, [exSets, exercise, settings.formula]);

  const chartData = useMemo(() => {
    if (!exercise) return [];
    return [...exSets]
      .reverse()
      .map((s) => ({ date: s.date, oneRm: set1RM(s, exercise, settings.formula) }));
  }, [exSets, exercise, settings.formula]);

  if (!exercise) {
    return (
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <p>Lift not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> All lifts
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${exercise.kind === "bodyweight" ? "bg-zone-light/15 text-zone-light" : "bg-zone-mod/15 text-zone-mod"}`}>
              {exercise.kind === "bodyweight" ? "BW + load" : "Standard"}
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{exercise.name}</h1>
            {exercise.notes && <p className="mt-1 max-w-prose text-sm text-muted-foreground">{exercise.notes}</p>}
          </div>
          <div className="flex gap-1">
            <ExerciseFormDialog
              initial={exercise}
              trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lift?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the lift and all {exSets.length} logged set{exSets.length === 1 ? "" : "s"}. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground"
                    onClick={() => { deleteExercise(exercise.id); navigate({ to: "/" }); }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-gradient-surface p-6 shadow-card">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Estimated 1RM</p>
            <p className="mt-1 font-mono text-5xl font-bold tabular text-gradient-ember">
              {oneRm ? formatWeight(oneRm, settings.unit) : "—"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">via {settings.formula}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <QuickLogger
            exercise={exercise}
            formula={settings.formula}
            unit={settings.unit}
            defaultBodyweight={exercise.bodyweight}
          />

          <section>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Progression
            </h2>
            <ProgressionChart data={chartData} />
          </section>

          <section>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent sets
            </h2>
            {exSets.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
                No sets yet. Log one above.
              </p>
            ) : (
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-card">
                {exSets.slice(0, 12).map((s) => {
                  const total = totalLoad(s, exercise);
                  const e1 = set1RM(s, exercise, settings.formula);
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-mono text-sm tabular">
                          <span className="font-semibold">{s.weight}</span>
                          {exercise.kind === "bodyweight" && s.bodyweight ? (
                            <span className="text-muted-foreground"> + {s.bodyweight} BW</span>
                          ) : null}
                          <span className="text-muted-foreground"> × {s.reps}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(s.date), "PP p")}
                          {exercise.kind === "bodyweight" && (
                            <span> · total {formatWeight(total, settings.unit)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">e1RM</div>
                          <div className="font-mono text-sm font-semibold tabular text-primary">
                            {formatWeight(e1, settings.unit)}
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteSet(s.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Percentage zones
          </h2>
          <PercentageTable oneRm={oneRm} unit={settings.unit} />
          <p className="text-xs text-muted-foreground">
            Loads recalculate automatically as you log new sets. Reps shown are typical training ranges.
          </p>
        </div>
      </div>
    </div>
  );
}
