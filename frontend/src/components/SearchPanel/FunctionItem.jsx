export function FunctionItem({ func, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 h-15 cursor-pointer border-b border-[#21262d] hover:bg-[#21262d] ${
        isSelected ? 'bg-[#21262d] border-l-2 border-l-[#58a6ff]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#58a6ff] font-mono text-sm truncate">{func.name}</span>
        {func.complexity > 10 && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#d29922]/20 text-[#d29922]">
            CC:{func.complexity}
          </span>
        )}
      </div>
      <div className="text-xs text-[#8b949e] truncate mt-0.5">{func.package}</div>
      <div className="text-xs text-[#484f58] truncate">
        {func.file}:{func.line}
      </div>
    </div>
  );
}

export function VirtualFunctionItem({ index, style, functions, selectedId, selectFunction }) {
  const func = functions[index];
  if (!func) return null;
  return (
    <div style={style}>
      <FunctionItem
        func={func}
        isSelected={selectedId === func.id}
        onClick={() => selectFunction(func)}
      />
    </div>
  );
}
