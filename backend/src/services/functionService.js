import { getDb } from '../db.js';

export function searchFunctions({ search, package: pkg, limit = 50, offset = 0 }) {
  const db = getDb();

  let query = `
    SELECT 
      n.id,
      n.name,
      n.package,
      n.file,
      n.line,
      n.kind,
      COALESCE(m.cyclomatic_complexity, 0) as complexity,
      COALESCE(m.loc, 0) as loc
    FROM nodes n
    LEFT JOIN metrics m ON n.id = m.function_id
    WHERE n.kind = 'function'
  `;

  const params = [];

  if (search) {
    query += ` AND n.name LIKE ?`;
    params.push(`%${search}%`);
  }

  if (pkg) {
    query += ` AND n.package = ?`;
    params.push(pkg);
  }

  query += ` ORDER BY n.name LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const functions = db.prepare(query).all(...params);

  return functions;
}

export function countFunctions({ search, package: pkg }) {
  const db = getDb();

  let countQuery = `SELECT COUNT(*) as total FROM nodes WHERE kind = 'function'`;
  const countParams = [];

  if (search) {
    countQuery += ` AND name LIKE ?`;
    countParams.push(`%${search}%`);
  }
  if (pkg) {
    countQuery += ` AND package = ?`;
    countParams.push(pkg);
  }

  const { total } = db.prepare(countQuery).get(...countParams);
  return total;
}

export function getFunctionById(id) {
  const db = getDb();

  const func = db
    .prepare(
      `
    SELECT 
      n.*,
      m.cyclomatic_complexity,
      m.fan_in,
      m.fan_out,
      m.loc,
      m.num_params
    FROM nodes n
    LEFT JOIN metrics m ON n.id = m.function_id
    WHERE n.id = ?
  `
    )
    .get(id);

  return func;
}

export function getFunctionCallers(id, limit = 20) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT n.id, n.name, n.package, n.file, n.line
    FROM edges e
    JOIN nodes n ON e.source = n.id
    WHERE e.target = ? AND e.kind = 'call'
    LIMIT ?
  `
    )
    .all(id, limit);
}

export function getFunctionCallees(id, limit = 20) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT DISTINCT n.id, n.name, n.package, n.file, n.line
    FROM edges e
    JOIN nodes n ON e.target = n.id
    WHERE e.source = ? AND e.kind = 'call'
    LIMIT ?
  `
    )
    .all(id, limit);
}

export function getFunctionDetails(id) {
  const func = getFunctionById(id);

  if (!func) {
    return null;
  }

  const callers = getFunctionCallers(id);
  const callees = getFunctionCallees(id);

  return { ...func, callers, callees };
}
