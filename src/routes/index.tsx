import { createFileRoute, Link } from "@tanstack/react-router";
import { useExercises, useSets, useSettings } from "@/lib/store";
import { set1RM, formatWeight } from "@/lib/oneRm";
import { ExerciseFormDialog } from "@/components/ExerciseFormDialog";
import { ChevronRight, Activity, Dumbbell } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your lifts — OneRep" },
      { name: "description", content: "Your tracked lifts with current estimated 1RM and recent progression." },
    ],
  }),
  component: Index,
});

function Index() {
  const exercises = useExercises();
  const sets = useSets();
  const settings = useSettings();

  const cards = useMemo(() => {
    return [...exercises]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((ex) => {
        const exSets = sets
          .filter((s) => s.exerciseId === ex.id)
          .sort((a, b) => a.date - b.date);
        const oneRms = exSets.map((s) => set1RM(s, ex, settings.formula));
        const best = oneRms.length ? Math.max(...oneRms) : 0;
        const last = oneRms.length ? oneRms[oneRms.length - 1] : 0;
        const prev = oneRms.length > 1 ? oneRms[oneRms.length - 2] : last;
        const delta = last - prev;
        return { ex, count: exSets.length, best, last, delta };
      });
  }, [exercises, sets, settings.formula]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Strength tracker</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your lifts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimated 1RM and percentage zones, recalculated on every set.
          </p>
        </div>
        <ExerciseFormDialog />
      </section>

      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map(({ ex, count, best, last, delta }) => (
            <Link
              key={ex.id}
              to="/exercise/$id"
              params={{ id: ex.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-surface p-5 shadow-card transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${ex.kind === "bodyweight" ? "bg-zone-light/15 text-zone-light" : "bg-zone-mod/15 text-zone-mod"}`}>
                      {ex.kind === "bodyweight" ? "BW + load" : "Standard"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-semibold leading-tight">{ex.name}</h2>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <Stat label="Best e1RM" value={best ? formatWeight(best, settings.unit) : "—"} accent />
                <Stat label="Last" value={last ? formatWeight(last, settings.unit) : "—"} />
                <Stat
                  label="Δ"
                  value={count > 1 ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}` : "—"}
                  trend={delta}
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5" />
                {count} set{count === 1 ? "" : "s"} logged
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent, trend }: { label: string; value: string; accent?: boolean; trend?: number }) {
  const trendColor =
    trend === undefined ? "" :
    trend > 0 ? "text-success" :
    trend < 0 ? "text-destructive" : "text-muted-foreground";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-mono text-lg font-semibold tabular ${accent ? "text-primary" : trend !== undefined ? trendColor : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/40 px-4 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-ember shadow-glow">
        <Dumbbell className="h-6 w-6 text-primary-foreground" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold">No lifts yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first lift — barbell or bodyweight + load — and start logging sets.
      </p>
      <div className="mt-5">
        <ExerciseFormDialog />
      </div>
    </div>
  );
}
