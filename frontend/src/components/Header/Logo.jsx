import { useAppStore } from '../../store';

export function Logo() {
  const reset = useAppStore(state => state.reset);

  return (
    <h1
      onClick={reset}
      className="text-lg font-semibold text-white flex items-center gap-2 cursor-pointer hover:text-[#58a6ff] transition-colors"
    >
      <svg className="w-6 h-6 text-[#58a6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      CPG Explorer
    </h1>
  );
}
