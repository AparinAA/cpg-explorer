import { useAppStore } from '../../store';

export function ComplexFunctionsList({ functions }) {
  const selectFunction = useAppStore(state => state.selectFunction);

  if (!functions?.length) return null;

  return (
    <div>
      <h3 className="text-md font-medium mb-3 text-[#8b949e]">Most Complex Functions</h3>
      <div className="bg-[#161b22] rounded-md border border-[#30363d] max-h-64 overflow-y-auto">
        {functions.map(func => (
          <div
            key={func.id}
            onClick={() => selectFunction(func)}
            className="flex items-center justify-between px-4 py-2 border-b border-[#21262d] last:border-0 cursor-pointer hover:bg-[#21262d]"
          >
            <div>
              <span className="text-[#58a6ff] font-mono text-sm">{func.name}</span>
              <span className="text-[#484f58] text-xs ml-2">{func.package}</span>
            </div>
            <span className="text-[#d29922] font-mono">CC:{func.complexity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
