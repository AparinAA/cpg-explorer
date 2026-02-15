import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { cytoscapeStyles, dagreLayoutOptions } from './cytoscapeConfig';
import { buildElements } from './buildElements';
import { GraphLegend } from './GraphLegend';
import { EmptyGraph } from './EmptyGraph';
import { TruncationBadge } from './TruncationBadge';

cytoscape.use(dagre);

export default function GraphViewer({ data, onNodeClick, onNodeDoubleClick }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    if (!cyRef.current) {
      cyRef.current = cytoscape({
        container: containerRef.current,
        style: cytoscapeStyles,
        layout: { name: 'preset' },
        minZoom: 0.1,
        maxZoom: 3,
      });

      cyRef.current.on('tap', 'node', evt => {
        const node = evt.target.data();
        onNodeClick?.(node);
      });

      cyRef.current.on('dbltap', 'node', evt => {
        const node = evt.target.data();
        onNodeDoubleClick?.(node);
      });
    }

    const elements = buildElements(data);
    cyRef.current.elements().remove();
    cyRef.current.add(elements);

    cyRef.current.layout(dagreLayoutOptions).run();

    setTimeout(() => {
      cyRef.current.fit(undefined, 50);
    }, 350);

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [data, onNodeClick, onNodeDoubleClick]);

  if (!data) {
    return <EmptyGraph />;
  }

  return (
    <div className="h-full relative">
      <div ref={containerRef} className="w-full h-full bg-[#0d1117]" />
      <GraphLegend />
      {data.truncated && <TruncationBadge nodeCount={data.nodes.length} />}
    </div>
  );
}
