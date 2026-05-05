"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-border-light rounded-xl shadow-[0_4px_16px_rgba(0,0,0,.1)] p-4 text-[.8125rem]">
      <p className="font-bold text-text-primary mb-2">{label}</p>
      <div className="flex flex-col gap-1">
        <span className="text-text-secondary">Entered: <strong className="text-text-primary">{d.entered}</strong></span>
        <span className="text-text-secondary">Abandoned: <strong className="text-error">{d.abandoned}</strong></span>
        <span className="text-text-secondary">Drop-off: <strong className="text-text-primary">{d.dropOffRate}%</strong></span>
        <span className="text-text-secondary">Avg time: <strong className="text-text-primary">{d.avgTime}s</strong></span>
      </div>
    </div>
  )
}

export default function DropOffChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-[.875rem]">
        No analytics data yet. Data will appear once customers start the booking flow.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, left: -16, bottom: 4 }}
        barSize={36}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94A3B8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27,58,107,.04)" }} />
        <Bar dataKey="dropOffRate" radius={[6, 6, 0, 0]} name="Drop-off %">
          {data.map((entry) => (
            <Cell
              key={entry.step}
              fill={entry.dropOffRate > 40 ? "#DC2626" : entry.dropOffRate > 20 ? "#D97706" : "#1B3A6B"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}