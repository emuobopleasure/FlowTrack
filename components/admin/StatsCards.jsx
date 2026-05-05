const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)

const stats_config = [
  {
    key: "totalBookings",
    label: "Total bookings",
    format: (v) => v.toString(),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: "totalRevenue",
    label: "Total revenue",
    format: (v) => formatCurrency(v),
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    key: "completionRate",
    label: "Completion rate",
    format: (v) => `${v}%`,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {stats_config.map((cfg) => (
        <div
          key={cfg.key}
          className="bg-white rounded-[20px] border border-border-light p-6 flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EEF3FB] text-navy flex items-center justify-center">
            {cfg.icon}
          </div>
          <div>
            <p className="text-[.8125rem] font-medium text-text-secondary mb-1">
              {cfg.label}
            </p>
            <p className="text-[1.75rem] font-bold text-text-primary tracking-tight leading-none">
              {cfg.format(stats[cfg.key] ?? 0)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}