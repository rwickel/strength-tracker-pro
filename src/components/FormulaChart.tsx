import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { FormulaId } from "@/lib/types";

interface DataPoint {
  reps: number;
  pct: number;
}

export function FormulaChart({ formula }: { formula: FormulaId }) {
  const data: DataPoint[] = [];

  // Calculate % of 1RM for reps 1 to 15
  for (let r = 1; r <= 12; r++) {
    let pct = 0;
    // 1RM = weight * factor
    // weight = 1RM / factor
    // % = 100 / factor
    switch (formula) {
      case "epley":
        pct = 100 / (1 + r / 30);
        break;
      case "brzycki":
        pct = (100 * (37 - r)) / 36;
        break;
      case "lombardi":
        pct = 100 / Math.pow(r, 0.1);
        break;
      case "oconner":
        pct = 100 / (1 + r / 40);
        break;
    }
    data.push({ reps: r, pct: Math.round(pct * 10) / 10 });
  }

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="reps" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            label={{ value: "Reps", position: "insideBottom", offset: -5, fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            domain={[50, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            label={{ value: "% of Max", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            itemStyle={{ color: "hsl(var(--primary))" }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
            formatter={(value: number) => [`${value}%`, "Load"]}
            labelFormatter={(label) => `${label} Reps`}
          />
          <Area 
            type="monotone" 
            dataKey="pct" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1} 
            fill="url(#colorPct)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
