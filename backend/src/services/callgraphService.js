import { getDb } from '../db.js';

export function getNodeById(id) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT id, name, package, file, line, kind
    FROM nodes WHERE id = ?
  `
    )
    .get(id);
}

export function getOutgoingCalls(nodeId, limit = 20) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT 
      n.id, n.name, n.package, n.file, n.line, n.kind,
      e.source, e.target
    FROM edges e
    JOIN nodes n ON e.target = n.id
    WHERE e.source = ? AND e.kind = 'call'
    LIMIT ?
  `
    )
    .all(nodeId, limit);
}

export function getIncomingCalls(nodeId, limit = 20) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT 
      n.id, n.name, n.package, n.file, n.line, n.kind,
      e.source, e.target
    FROM edges e
    JOIN nodes n ON e.source = n.id
    WHERE e.target = ? AND e.kind = 'call'
    LIMIT ?
  `
    )
    .all(nodeId, limit);
}

export function buildCallGraph(rootId, { depth = 2, direction = 'both', maxNodes = 60 }) {
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

  while (queue.length > 0 && nodes.size < Number(maxNodes)) {
    const { nodeId, currentDepth } = queue.shift();

    if (currentDepth >= Number(depth)) continue;

    if (direction === 'both' || direction === 'outgoing') {
      const callees = getOutgoingCalls(nodeId);

      for (const callee of callees) {
        edges.push({
          source: callee.source,
          target: callee.target,
          kind: 'call',
        });

        if (!visited.has(callee.id) && nodes.size < Number(maxNodes)) {
          visited.add(callee.id);
          nodes.set(callee.id, {
            id: callee.id,
            name: callee.name,
            package: callee.package,
            file: callee.file,
            line: callee.line,
            kind: callee.kind,
          });
          queue.push({ nodeId: callee.id, currentDepth: currentDepth + 1 });
        }
      }
    }

    if (direction === 'both' || direction === 'incoming') {
      const callers = getIncomingCalls(nodeId);

      for (const caller of callers) {
        edges.push({
          source: caller.source,
          target: caller.target,
          kind: 'call',
        });

        if (!visited.has(caller.id) && nodes.size < Number(maxNodes)) {
          visited.add(caller.id);
          nodes.set(caller.id, {
            id: caller.id,
            name: caller.name,
            package: caller.package,
            file: caller.file,
            line: caller.line,
            kind: caller.kind,
          });
          queue.push({ nodeId: caller.id, currentDepth: currentDepth + 1 });
        }
      }
    }
  }

  return {
    nodes,
    edges,
    rootId,
    truncated: nodes.size >= Number(maxNodes),
  };
}

export function formatGraphResponse(graphData) {
  if (!graphData) return null;

  const { nodes, edges, rootId, truncated } = graphData;

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
    truncated,
  };
}
