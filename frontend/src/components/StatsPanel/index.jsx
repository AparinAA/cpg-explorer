import { Suspense, use } from 'react';
import { statsApi } from '../../api';
import { SummaryCards } from './SummaryCards';
import { EdgeTypesList } from './EdgeTypesList';
import { ComplexFunctionsList } from './ComplexFunctionsList';

export default function StatsPanel() {
  const stats = use(statsApi.get());

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center text-[#f85149]">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 bg-[#0d1117]">
      <h2 className="text-xl font-semibold mb-6 text-[#c9d1d9]">CPG Database Overview</h2>

      <SummaryCards stats={stats} />
      <EdgeTypesList edgeTypes={stats.edgeTypes} />
      <ComplexFunctionsList functions={stats.complexFunctions} />
    </div>
  );
}

export function StatsPanelSuspense() {
  return (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    >
      <StatsPanel />
    </Suspense>
  );
}
