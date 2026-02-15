import { useAppStore } from '../../store';
import { VIEWS } from '../../shared/constants';
import GraphViewer from '../GraphViewer/index';
import { StatsPanelSuspense } from '../StatsPanel/index';
import { GraphPanelHeader } from './GraphPanelHeader';

export function GraphPanel() {
  const view = useAppStore(state => state.view);
  const selectedFunction = useAppStore(state => state.selectedFunction);
  const graphData = useAppStore(state => state.graphData);
  const graphLoading = useAppStore(state => state.graphLoading);
  const graphError = useAppStore(state => state.graphError);
  const packageGraphData = useAppStore(state => state.packageGraphData);
  const packageGraphLoading = useAppStore(state => state.packageGraphLoading);
  const handleNodeClick = useAppStore(state => state.handleNodeClick);
  const handleNodeDoubleClick = useAppStore(state => state.handleNodeDoubleClick);

  const currentGraphData = view === VIEWS.PACKAGES ? packageGraphData : graphData;
  const currentLoading = view === VIEWS.PACKAGES ? packageGraphLoading : graphLoading;
  const showStats = view === VIEWS.CALLGRAPH && !graphData && !selectedFunction;

  const renderContent = () => {
    if (graphError && view === VIEWS.CALLGRAPH) {
      return (
        <div className="flex items-center justify-center h-full text-[#f85149]">{graphError}</div>
      );
    }

    if (currentGraphData) {
      return (
        <GraphViewer
          data={currentGraphData}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
        />
      );
    }

    if (showStats) {
      return <StatsPanelSuspense />;
    }

    if (currentLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="spinner" />
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center text-[#8b949e]">
        {view === VIEWS.PACKAGES
          ? 'Loading package graph...'
          : 'Select a function to view its call graph'}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <GraphPanelHeader />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
