const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';
const API_BASE = `${import.meta.env.VITE_API_BASE || '/api'}/${API_VERSION}`;

async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const functionsApi = {
  search: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.package) searchParams.set('package', params.package);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    return fetchApi(`/functions?${searchParams}`);
  },

  getById: id => fetchApi(`/functions/${encodeURIComponent(id)}`),
};

export const callgraphApi = {
  get: (functionId, options = {}) => {
    const params = new URLSearchParams({
      depth: (options.depth || 2).toString(),
      maxNodes: (options.maxNodes || 60).toString(),
    });
    return fetchApi(`/callgraph/${encodeURIComponent(functionId)}?${params}`);
  },
};

export const dataflowApi = {
  get: (functionId, options = {}) => {
    const params = new URLSearchParams({
      depth: (options.depth || 3).toString(),
    });
    return fetchApi(`/dataflow/${encodeURIComponent(functionId)}?${params}`);
  },
};

export const packagesApi = {
  getAll: () => fetchApi('/packages'),

  getFunctions: packageName => fetchApi(`/packages/${encodeURIComponent(packageName)}/functions`),

  getGraph: (options = {}) => {
    const params = new URLSearchParams();
    if (options.root) params.set('root', options.root);
    if (options.depth) params.set('depth', options.depth.toString());
    if (options.maxNodes) params.set('maxNodes', options.maxNodes.toString());
    const query = params.toString();
    return fetchApi(`/packages/graph${query ? '?' + query : ''}`);
  },
};

export const sourceApi = {
  get: filePath => fetchApi(`/source/${encodeURIComponent(filePath)}`),
};

export const statsApi = {
  statsPromise: null,
  get: () => {
    if (statsApi.statsPromise) {
      return statsApi.statsPromise;
    }
    statsApi.statsPromise = fetchApi('/stats');
    return statsApi.statsPromise;
  },
};
