function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
      <div className="flex items-center gap-2 text-[#8b949e] text-sm mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold text-[#c9d1d9]">{value || '—'}</div>
    </div>
  );
}

export function SummaryCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Nodes" value={stats.nodes?.toLocaleString()} icon="○" />
      <StatCard label="Edges" value={stats.edges?.toLocaleString()} icon="→" />
      <StatCard label="Functions" value={stats.functions?.toLocaleString()} icon="ƒ" />
      <StatCard label="Packages" value={stats.packages?.toLocaleString()} icon="📦" />
    </div>
  );
}
