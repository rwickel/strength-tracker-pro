import { Link, useLocation } from "@tanstack/react-router";
import { Dumbbell, Settings } from "lucide-react";

export function AppHeader() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="OneRep Logo" className="h-8 w-8 rounded-lg shadow-glow" />
          <span className="font-display text-lg font-semibold tracking-tight">
            One<span className="text-gradient-ember">Rep</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className={`rounded-md px-3 py-1.5 transition-colors ${loc.pathname === "/" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Lifts
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${loc.pathname === "/settings" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
