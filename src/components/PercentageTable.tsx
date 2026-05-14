import { PERCENTAGES, repTargetFor, zoneFor, formatWeight } from "@/lib/oneRm";

export function PercentageTable({ oneRm, unit = "kg" }: { oneRm: number; unit?: "kg" | "lb" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>%</span>
        <span>Load</span>
        <span className="text-right">Reps</span>
      </div>
      <ul className="divide-y divide-border">
        {PERCENTAGES.map((pct) => {
          const load = (oneRm * pct) / 100;
          const z = zoneFor(pct);
          const zoneClass =
            z === "light" ? "bg-zone-light" :
            z === "mod"   ? "bg-zone-mod" :
            z === "heavy" ? "bg-zone-heavy" :
                            "bg-zone-max";
          return (
            <li key={pct} className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-2 px-4 py-2.5 text-sm">
              <span className="flex items-center gap-2 tabular">
                <span className={`h-1.5 w-1.5 rounded-full ${zoneClass}`} />
                <span className="font-medium">{pct}%</span>
              </span>
              <span className="font-mono tabular text-foreground">{formatWeight(load, unit)}</span>
              <span className="text-right tabular text-muted-foreground">{repTargetFor(pct)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
