export function EmptyGraph() {
  return (
    <div className="h-full flex items-center justify-center text-[#8b949e]">
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <p>Select a function to view its call graph</p>
      </div>
    </div>
  );
}
