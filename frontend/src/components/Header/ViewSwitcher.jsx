import { useAppStore } from '../../store';
import { VIEWS } from '../../shared/constants';

export function ViewSwitcher() {
  const view = useAppStore(state => state.view);
  const setView = useAppStore(state => state.setView);

  const buttonClass = isActive =>
    `px-3 py-1 rounded text-sm ${isActive ? 'bg-[#58a6ff] text-white' : 'bg-[#21262d] text-[#8b949e] hover:text-white'}`;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setView(VIEWS.CALLGRAPH)}
        className={buttonClass(view === VIEWS.CALLGRAPH)}
      >
        Call Graph
      </button>
      <button
        onClick={() => setView(VIEWS.PACKAGES)}
        className={buttonClass(view === VIEWS.PACKAGES)}
      >
        Packages
      </button>
    </div>
  );
}
