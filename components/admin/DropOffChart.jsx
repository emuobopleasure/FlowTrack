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
  LabelList,
} from "recharts"

/**
 * Color logic:
 * 0%        → #E2E8F0 (light grey — no data yet)
 * 1–25%     → #1B3A6B (navy — healthy)
 * 26–50%    → #D97706 (amber — worth watching)
 * 51–100%   → #DC2626 (red — needs attention)
 */
const getBarColor = (dropOffRate, entered) => {
  if (entered === 0) return "#E2E8F0"
  if (dropOffRate <= 25) return "#1B3A6B"
  if (dropOffRate <= 50) return "#D97706"
  return "#DC2626"
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload

  return (
    <div className="bg-white border border-border-light rounded-xl shadow-[0_4px_16px_rgba(0,0,0,.1)] p-4 text-[.8125rem] min-w-[180px]">
      <p className="font-bold text-text-primary mb-3">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between gap-6">
          <span className="text-text-secondary">Entered</span>
          <span className="font-semibold text-text-primary">{d.entered}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-text-secondary">Completed</span>
          <span className="font-semibold text-text-primary">{d.completed}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-text-secondary">Abandoned</span>
          <span className="font-semibold text-error">{d.abandoned}</span>
        </div>
        <div
          className="flex justify-between gap-6 pt-1.5 mt-1 border-t border-border-light"
        >
          <span className="text-text-secondary">Drop-off rate</span>
          <span
            className="font-bold"
            style={{ color: getBarColor(d.dropOffRate, d.entered) }}
          >
            {d.entered === 0 ? "No data" : `${d.dropOffRate}%`}
          </span>
        </div>
        {d.avgTime > 0 && (
          <div className="flex justify-between gap-6">
            <span className="text-text-secondary">Avg time</span>
            <span className="font-semibold text-text-primary">{d.avgTime}s</span>
          </div>
        )}
      </div>
    </div>
  )
}

const CustomLabel = ({ x, y, width, value, entered }) => {
  if (entered === 0 || value === 0) return null
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#64748B"
      textAnchor="middle"
      fontSize={11}
      fontWeight={600}
    >
      {value}%
    </text>
  )
}

export default function DropOffChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EEF3FB] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1.75" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <p className="text-text-secondary text-[.875rem] text-center">
          No analytics data yet. Data appears once customers start the booking flow.
        </p>
      </div>
    )
  }

  // Check if any data exists at all
  const hasAnyData = data.some((d) => d.entered > 0)

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EEF3FB] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1.75" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <p className="text-text-secondary text-[.875rem] text-center">
          Waiting for first booking session to start.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-5 mb-6 flex-wrap">
        {[
          { color: "#1B3A6B", label: "Low drop-off (0–25%)" },
          { color: "#D97706", label: "Medium (26–50%)" },
          { color: "#DC2626", label: "High (51%+)" },
          { color: "#E2E8F0", label: "No data" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="text-[.75rem] text-text-secondary font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 24, right: 8, left: -20, bottom: 4 }}
          barSize={40}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(27,58,107,.04)" }}
          />
          <Bar
            dataKey="dropOffRate"
            radius={[6, 6, 0, 0]}
            name="Drop-off %"
          >
            <LabelList
              dataKey="dropOffRate"
              content={(props) => (
                <CustomLabel
                  {...props}
                  entered={data[props.index]?.entered || 0}
                />
              )}
            />
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.step}`}
                fill={getBarColor(entry.dropOffRate, entry.entered)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}