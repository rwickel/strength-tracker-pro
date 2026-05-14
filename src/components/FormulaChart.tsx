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
    <div className="h-[240px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(249, 115, 22, 0.1)" />
          <XAxis 
            dataKey="reps" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#f97316", fontWeight: 500 }}
            label={{ 
              value: "REPETITIONS", 
              position: "insideBottom", 
              offset: -15, 
              fontSize: 9, 
              fill: "#f97316", 
              fontWeight: 700, 
              letterSpacing: "0.1em",
              opacity: 0.8
            }}
          />
          <YAxis 
            domain={[50, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: "#f97316", fontWeight: 500 }}
            label={{ 
              value: "% OF MAX", 
              angle: -90, 
              position: "insideLeft", 
              fontSize: 9, 
              fill: "#f97316", 
              fontWeight: 700, 
              letterSpacing: "0.1em", 
              offset: 15,
              opacity: 0.8
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#1a1a1a", 
              borderColor: "#f97316",
              borderRadius: "12px",
              fontSize: "13px",
              color: "#fff",
              boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.3)"
            }}
            itemStyle={{ color: "#f97316" }}
            labelStyle={{ color: "#fff", fontWeight: "bold" }}
            formatter={(value: number) => [`${value}%`, "Load"]}
            labelFormatter={(label) => `${label} Reps`}
          />
          <Area 
            type="monotone" 
            dataKey="pct" 
            stroke="#f97316" 
            fillOpacity={1} 
            fill="url(#colorPct)" 
            strokeWidth={3}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
