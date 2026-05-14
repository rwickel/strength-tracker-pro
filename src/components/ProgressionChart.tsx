import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";

export interface ProgressionPoint {
  date: number;
  oneRm: number;
}

export function ProgressionChart({ data }: { data: ProgressionPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="grid h-48 place-items-center rounded-xl border border-dashed border-border bg-card/50 text-sm text-muted-foreground">
        Log a set to see progression.
      </div>
    );
  }
  return (
    <div className="h-56 rounded-xl border border-border bg-card p-4 shadow-card">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="emberLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.72 0.19 45)" />
              <stop offset="100%" stopColor="oklch(0.65 0.21 25)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="oklch(0.28 0.014 250)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(t) => format(new Date(t), "MMM d")}
            stroke="oklch(0.66 0.018 250)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="oklch(0.66 0.018 250)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.21 0.014 250)",
              border: "1px solid oklch(0.28 0.014 250)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(t) => format(new Date(t as number), "PP")}
            formatter={(v: number) => [`${v.toFixed(1)} kg`, "e1RM"]}
          />
          <Line
            type="monotone"
            dataKey="oneRm"
            stroke="url(#emberLine)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "oklch(0.72 0.19 45)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
