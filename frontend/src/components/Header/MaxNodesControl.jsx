import { useAppStore } from '../../store';

export function MaxNodesControl() {
  const maxNodes = useAppStore(state => state.maxNodes);
  const setMaxNodes = useAppStore(state => state.setMaxNodes);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#8b949e]">Nodes:</span>
      <button
        onClick={() => setMaxNodes(Math.max(10, maxNodes - 10))}
        className="w-6 h-6 rounded bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] text-sm"
      >
        −
      </button>
      <span className="text-sm text-white w-8 text-center">{maxNodes}</span>
      <button
        onClick={() => setMaxNodes(Math.min(200, maxNodes + 10))}
        className="w-6 h-6 rounded bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] text-sm"
      >
        +
      </button>
    </div>
  );
}
