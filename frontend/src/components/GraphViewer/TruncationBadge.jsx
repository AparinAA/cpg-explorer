export function TruncationBadge({ nodeCount }) {
  return (
    <div className="absolute top-4 right-4 bg-[#d29922]/20 text-[#d29922] text-xs px-2 py-1 rounded">
      Graph truncated ({nodeCount} nodes shown)
    </div>
  );
}
