import { NODE_COLORS } from '../../shared/constants';

export const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 5,
      'font-size': '11px',
      color: '#c9d1d9',
      'text-outline-color': '#0d1117',
      'text-outline-width': 2,
      'background-color': NODE_COLORS.function,
      width: 30,
      height: 30,
      'border-width': 2,
      'border-color': '#30363d',
    },
  },
  {
    selector: 'node.root',
    style: {
      'background-color': NODE_COLORS.root,
      width: 40,
      height: 40,
      'border-width': 3,
      'border-color': '#3fb950',
      'font-weight': 'bold',
    },
  },
  {
    selector: 'node.external',
    style: {
      'background-color': NODE_COLORS.external,
      shape: 'diamond',
      width: 25,
      height: 25,
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-color': '#f0883e',
      'border-width': 3,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': '#30363d',
      'target-arrow-color': '#58a6ff',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'arrow-scale': 0.8,
    },
  },
  {
    selector: 'edge[kind = "call"]',
    style: {
      'line-color': '#484f58',
      'target-arrow-color': '#58a6ff',
    },
  },
  {
    selector: 'edge[kind = "dfg"]',
    style: {
      'line-color': '#a371f7',
      'line-style': 'dashed',
      'target-arrow-color': '#a371f7',
    },
  },
];

export const dagreLayoutOptions = {
  name: 'dagre',
  rankDir: 'TB',
  nodeSep: 50,
  rankSep: 80,
  padding: 30,
  animate: true,
  animationDuration: 300,
};
