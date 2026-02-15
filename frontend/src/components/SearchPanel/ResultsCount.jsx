export function ResultsCount({ loading, total, shown }) {
  const text = shown < total ? `${shown} of ${total} functions` : `${total} functions found`;

  return (
    <div className="px-3 py-2 text-xs text-[#8b949e] border-b border-[#30363d]">
      {loading ? 'Searching...' : text}
    </div>
  );
}
