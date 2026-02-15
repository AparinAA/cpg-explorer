import { useAppStore } from '../../store';
import SourceViewer from '../SourceViewer/index';

export function SourcePanel() {
  const sourceData = useAppStore(state => state.sourceData);
  const highlightLine = useAppStore(state => state.highlightLine);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-10 flex items-center px-4 bg-[#161b22] border-b border-[#30363d]">
        <span className="text-sm text-[#8b949e] truncate">
          {sourceData ? sourceData.file : 'No file selected'}
        </span>
      </div>
      <div className="flex-1">
        <SourceViewer source={sourceData} highlightLine={highlightLine} />
      </div>
    </div>
  );
}
