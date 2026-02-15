import Split from 'react-split';
import { Header } from './components/Header/index';
import { GraphPanel, SourcePanel } from './components/Panels/index';
import SearchPanel from './components/SearchPanel/index';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-[#0d1117]">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-[#30363d] overflow-hidden flex flex-col">
          <SearchPanel />
        </div>

        <Split
          className="flex-1 flex"
          sizes={[60, 40]}
          minSize={200}
          gutterSize={4}
          gutterStyle={() => ({
            backgroundColor: '#30363d',
            cursor: 'col-resize',
          })}
        >
          <GraphPanel />
          <SourcePanel />
        </Split>
      </div>
    </div>
  );
}
