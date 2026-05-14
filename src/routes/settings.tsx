import { createFileRoute } from '@tanstack/react-router'
import { useSettings, saveSettings, exportData } from "@/lib/store";
import { FORMULAS } from "@/lib/oneRm";
import type { FormulaId } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { FormulaChart } from "@/components/FormulaChart";
import { Download, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — OneRep" },
      { name: "description", content: "Choose your 1RM formula and units." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Settings</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Preferences</h1>
      </div>

      <section className="space-y-4">
        <div>
          <Label className="text-sm font-semibold">1RM formula</Label>
          <p className="text-xs text-muted-foreground mt-1">Select the mathematical model used to estimate your strength capacity.</p>
        </div>
        
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMULAS.map((f) => {
            const active = settings.formula === f.id;
            return (
              <button
                key={f.id}
                onClick={() => saveSettings({ ...settings, formula: f.id as FormulaId })}
                className={`rounded-xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-card hover:border-border/80"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold">{f.name}</span>
                  {active && <span className="text-[10px] uppercase tracking-wider text-primary">Active</span>}
                </div>
                <code className="mt-1 block font-mono text-xs text-muted-foreground">{f.desc}</code>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-gradient-surface p-6 shadow-card mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-primary">Formula Curve</h3>
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {settings.formula} model
            </span>
          </div>
          <FormulaChart formula={settings.formula} />
          <p className="text-[10px] text-muted-foreground mt-4 text-center italic opacity-70">
            Shows what percentage of your 1RM you can likely lift for a given number of repetitions.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <Label className="text-sm font-semibold">Units</Label>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {(["kg", "lb"] as const).map((u) => (
            <button
              key={u}
              onClick={() => saveSettings({ ...settings, unit: u })}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${settings.unit === u ? "bg-gradient-ember text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm overflow-hidden relative">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Data & Backup</h3>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Your workout data is stored locally. Export it to JSON for safe-keeping or to move your progress to another device.
            </p>
          </div>
          <Button 
            onClick={exportData}
            variant="outline"
            className="border-primary/50 hover:bg-primary/10 hover:text-primary transition-all group"
          >
            <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Download Data
          </Button>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
}
