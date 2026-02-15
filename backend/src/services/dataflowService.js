import { getDb } from '../db.js';

export function getNodeById(id) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT id, name, package, file, line, kind, parent_function
    FROM nodes WHERE id = ?
  `
    )
    .get(id);
}

export function getBackwardDfgEdges(nodeId, limit = 15) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT 
      n.id, n.name, n.package, n.file, n.line, n.kind, n.parent_function,
      e.source, e.target
    FROM edges e
    JOIN nodes n ON e.source = n.id
    WHERE e.target = ? AND e.kind = 'dfg'
    LIMIT ?
  `
    )
    .all(nodeId, limit);
}

export function getForwardDfgEdges(nodeId, limit = 15) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT 
      n.id, n.name, n.package, n.file, n.line, n.kind, n.parent_function,
      e.source, e.target
    FROM edges e
    JOIN nodes n ON e.target = n.id
    WHERE e.source = ? AND e.kind = 'dfg'
    LIMIT ?
  `
    )
    .all(nodeId, limit);
}

export function buildDataFlowGraph(rootId, { direction = 'backward', depth = 5, maxNodes = 50 }) {
  const rootNode = getNodeById(rootId);

  if (!rootNode) {
    return null;
  }

  const nodes = new Map();
  const edges = [];
  const visited = new Set();
  const queue = [{ nodeId: rootId, currentDepth: 0 }];

  nodes.set(rootId, { ...rootNode, isRoot: true });
  visited.add(rootId);

  const getDfgEdges = direction === 'backward' ? getBackwardDfgEdges : getForwardDfgEdges;

  while (queue.length > 0 && nodes.size < Number(maxNodes)) {
    const { nodeId, currentDepth } = queue.shift();

    if (currentDepth >= Number(depth)) continue;

    const neighbors = getDfgEdges(nodeId);

    for (const neighbor of neighbors) {
      edges.push({
        source: neighbor.source,
        target: neighbor.target,
        kind: 'dfg',
      });

      if (!visited.has(neighbor.id) && nodes.size < Number(maxNodes)) {
        visited.add(neighbor.id);
        nodes.set(neighbor.id, {
          id: neighbor.id,
          name: neighbor.name,
          package: neighbor.package,
          file: neighbor.file,
          line: neighbor.line,
          kind: neighbor.kind,
          parent_function: neighbor.parent_function,
        });
        queue.push({ nodeId: neighbor.id, currentDepth: currentDepth + 1 });
      }
    }
  }

  return {
    nodes,
    edges,
    rootId,
    direction,
    truncated: nodes.size >= Number(maxNodes),
  };
}

export function formatDataFlowResponse(graphData) {
  if (!graphData) return null;

  const { nodes, edges, rootId, direction, truncated } = graphData;

  const nodeIds = new Set(nodes.keys());
  const uniqueEdges = Array.from(
    new Map(
      edges
        .filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
        .map(e => [`${e.source}->${e.target}`, e])
    ).values()
  );

  return {
    nodes: Array.from(nodes.values()),
    edges: uniqueEdges,
    rootId,
    direction,
    truncated,
  };
}
