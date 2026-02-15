export const NODE_COLORS = {
  function: '#58a6ff',
  method: '#a371f7',
  external: '#8b949e',
  root: '#3fb950',
};

export const THEME = {
  bg: {
    primary: '#0d1117',
    secondary: '#161b22',
    tertiary: '#21262d',
  },
  border: {
    primary: '#30363d',
    secondary: '#21262d',
  },
  text: {
    primary: '#c9d1d9',
    secondary: '#8b949e',
    muted: '#484f58',
  },
  accent: {
    blue: '#58a6ff',
    green: '#3fb950',
    purple: '#a371f7',
    yellow: '#d29922',
    red: '#f85149',
  },
};

export const DEFAULTS = {
  callgraphDepth: 2,
  callgraphMaxNodes: 60,
  dataflowDepth: 3,
  packageGraphDepth: 2,
  packageGraphMaxNodes: 60,
  searchLimit: 50,
  debounceMs: 200,
};

export const VIEWS = {
  CALLGRAPH: 'callgraph',
  DATAFLOW: 'dataflow',
  PACKAGES: 'packages',
};
