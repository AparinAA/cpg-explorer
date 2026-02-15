import { getDb } from '../db.js';

export function getAllPackages() {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT 
      package,
      COUNT(*) as function_count,
      COUNT(DISTINCT file) as file_count,
      SUM(CASE WHEN kind = 'function' THEN 1 ELSE 0 END) as functions,
      AVG(CASE 
        WHEN m.cyclomatic_complexity IS NOT NULL 
        THEN m.cyclomatic_complexity 
        ELSE NULL 
      END) as avg_complexity
    FROM nodes n
    LEFT JOIN metrics m ON n.id = m.function_id
    WHERE n.package IS NOT NULL AND n.package != ''
    GROUP BY package
    ORDER BY function_count DESC
  `
    )
    .all();
}

export function getPackageFunctions(packageName, { limit = 100, offset = 0 }) {
  const db = getDb();

  const functions = db
    .prepare(
      `
    SELECT 
      n.id,
      n.name,
      n.file,
      n.line,
      n.kind,
      m.cyclomatic_complexity as complexity,
      m.loc
    FROM nodes n
    LEFT JOIN metrics m ON n.id = m.function_id
    WHERE n.package = ? AND n.kind = 'function'
    ORDER BY n.name
    LIMIT ? OFFSET ?
  `
    )
    .all(packageName, Number(limit), Number(offset));

  return functions;
}

export function countPackageFunctions(packageName) {
  const db = getDb();

  const { total } = db
    .prepare(
      `
    SELECT COUNT(*) as total 
    FROM nodes 
    WHERE package = ? AND kind = 'function'
  `
    )
    .get(packageName);

  return total;
}

export function getPackageGraph({ rootPackage = null, depth = 2, maxNodes = 60 } = {}) {
  const db = getDb();

  let allEdges;
  try {
    allEdges = db
      .prepare(
        `
      SELECT source, target, weight FROM dashboard_package_graph
    `
      )
      .all();
  } catch {
    allEdges = db
      .prepare(
        `
      SELECT 
        src.package as source,
        tgt.package as target,
        COUNT(*) as weight
      FROM edges e
      JOIN nodes src ON e.source = src.id
      JOIN nodes tgt ON e.target = tgt.id
      WHERE e.kind = 'call' 
        AND src.package IS NOT NULL 
        AND tgt.package IS NOT NULL
        AND src.package != tgt.package
      GROUP BY src.package, tgt.package
      HAVING COUNT(*) > 2
    `
      )
      .all();
  }

  if (allEdges.length === 0) {
    return { nodes: [], edges: [], truncated: false };
  }

  const adjacency = new Map();
  const incomingCount = new Map();

  allEdges.forEach(e => {
    if (!adjacency.has(e.source)) adjacency.set(e.source, []);
    adjacency.get(e.source).push(e);

    incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1);
    if (!incomingCount.has(e.source)) incomingCount.set(e.source, 0);
  });

  if (!rootPackage) {
    const allPackages = [...new Set(allEdges.flatMap(e => [e.source, e.target]))];
    rootPackage = allPackages.reduce((best, pkg) => {
      const connections = (adjacency.get(pkg)?.length || 0) + (incomingCount.get(pkg) || 0);
      const bestConnections = (adjacency.get(best)?.length || 0) + (incomingCount.get(best) || 0);
      return connections > bestConnections ? pkg : best;
    }, allPackages[0]);
  }

  const visited = new Set();
  const resultNodes = new Map();
  const resultEdges = [];
  const queue = [{ pkg: rootPackage, currentDepth: 0 }];

  visited.add(rootPackage);
  resultNodes.set(rootPackage, {
    id: rootPackage,
    name: rootPackage,
    kind: 'package',
    isRoot: true,
  });

  while (queue.length > 0 && resultNodes.size < maxNodes) {
    const { pkg, currentDepth } = queue.shift();

    if (currentDepth >= depth) continue;

    const outgoing = adjacency.get(pkg) || [];
    for (const edge of outgoing) {
      if (resultNodes.size >= maxNodes) break;

      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        resultNodes.set(edge.target, { id: edge.target, name: edge.target, kind: 'package' });
        queue.push({ pkg: edge.target, currentDepth: currentDepth + 1 });
      }

      if (resultNodes.has(edge.source) && resultNodes.has(edge.target)) {
        resultEdges.push({
          source: edge.source,
          target: edge.target,
          weight: edge.weight || 1,
          kind: 'depends',
        });
      }
    }
  }

  const edgeSet = new Set();
  const uniqueEdges = resultEdges.filter(e => {
    const key = `${e.source}->${e.target}`;
    if (edgeSet.has(key)) return false;
    edgeSet.add(key);
    return true;
  });

  return {
    nodes: Array.from(resultNodes.values()),
    edges: uniqueEdges,
    rootPackage,
    truncated: resultNodes.size >= maxNodes,
  };
}
