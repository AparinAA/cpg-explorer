export function GraphLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-[#161b22] border border-[#30363d] rounded-md p-3 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
        <span className="text-[#8b949e]">Root function</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-[#58a6ff]" />
        <span className="text-[#8b949e]">Function</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rotate-45 bg-[#8b949e]" />
        <span className="text-[#8b949e]">External</span>
      </div>
    </div>
  );
}
