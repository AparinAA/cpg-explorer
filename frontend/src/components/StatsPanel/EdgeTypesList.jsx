export function EdgeTypesList({ edgeTypes }) {
  if (!edgeTypes?.length) return null;

  return (
    <div className="mb-8">
      <h3 className="text-md font-medium mb-3 text-[#8b949e]">Edge Types</h3>
      <div className="bg-[#161b22] rounded-md border border-[#30363d] overflow-hidden">
        {edgeTypes.slice(0, 8).map(edge => (
          <div
            key={edge.kind}
            className="flex items-center justify-between px-4 py-2 border-b border-[#21262d] last:border-0"
          >
            <span className="text-[#c9d1d9] font-mono text-sm">{edge.kind}</span>
            <span className="text-[#8b949e]">{edge.count?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
