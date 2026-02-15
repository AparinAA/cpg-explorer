export function EmptySource() {
  return (
    <div className="h-full flex items-center justify-center text-[#8b949e] bg-[#0d1117]">
      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto mb-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <p>Click a node to view source code</p>
      </div>
    </div>
  );
}
