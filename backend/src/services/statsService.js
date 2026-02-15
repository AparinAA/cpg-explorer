import { getDb } from '../db.js';

export function getCounts() {
  const db = getDb();

  const nodeCount = db.prepare(`SELECT COUNT(*) as count FROM nodes`).get();
  const edgeCount = db.prepare(`SELECT COUNT(*) as count FROM edges`).get();
  const functionCount = db
    .prepare(`SELECT COUNT(*) as count FROM nodes WHERE kind = 'function'`)
    .get();
  const packageCount = db
    .prepare(`SELECT COUNT(DISTINCT package) as count FROM nodes WHERE package IS NOT NULL`)
    .get();
  const fileCount = db.prepare(`SELECT COUNT(*) as count FROM sources`).get();

  return {
    nodes: nodeCount.count,
    edges: edgeCount.count,
    functions: functionCount.count,
    packages: packageCount.count,
    files: fileCount.count,
  };
}

export function getEdgeTypes() {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT kind, COUNT(*) as count 
    FROM edges 
    GROUP BY kind 
    ORDER BY count DESC
  `
    )
    .all();
}

export function getNodeTypes(limit = 10) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT kind, COUNT(*) as count 
    FROM nodes 
    GROUP BY kind 
    ORDER BY count DESC
    LIMIT ?
  `
    )
    .all(limit);
}

export function getMostComplexFunctions(limit = 10) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT 
      n.id,
      n.name,
      n.package,
      m.cyclomatic_complexity as complexity
    FROM metrics m
    JOIN nodes n ON m.function_id = n.id
    WHERE m.cyclomatic_complexity IS NOT NULL
    ORDER BY m.cyclomatic_complexity DESC
    LIMIT ?
  `
    )
    .all(limit);
}

export function getFullStats() {
  const counts = getCounts();
  const edgeTypes = getEdgeTypes();
  const nodeTypes = getNodeTypes();
  const complexFunctions = getMostComplexFunctions();

  return {
    ...counts,
    edgeTypes,
    nodeTypes,
    complexFunctions,
  };
}
