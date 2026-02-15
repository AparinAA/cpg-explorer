import { useAppStore } from '../../store';
import { VIEWS } from '../../shared/constants';

export function GraphPanelHeader() {
  const view = useAppStore(state => state.view);
  const selectedFunction = useAppStore(state => state.selectedFunction);
  const selectedPackage = useAppStore(state => state.selectedPackage);
  const graphLoading = useAppStore(state => state.graphLoading);
  const packageGraphLoading = useAppStore(state => state.packageGraphLoading);

  const isLoading = view === VIEWS.PACKAGES ? packageGraphLoading : graphLoading;

  const renderTitle = () => {
    if (view === VIEWS.PACKAGES) {
      return selectedPackage ? (
        <>
          <span className="text-[#58a6ff]">{selectedPackage}</span>
          <span className="mx-2">•</span>
          <span>Dependencies</span>
        </>
      ) : (
        'Package Dependencies'
      );
    }

    return selectedFunction ? (
      <>
        <span className="text-[#58a6ff]">{selectedFunction.name}</span>
        <span className="mx-2">•</span>
        <span>{selectedFunction.package}</span>
      </>
    ) : (
      'Select a function to explore'
    );
  };

  return (
    <div className="h-10 flex items-center px-4 bg-[#161b22] border-b border-[#30363d]">
      <span className="text-sm text-[#8b949e]">{renderTitle()}</span>
      {isLoading && <div className="spinner ml-2" />}
    </div>
  );
}
