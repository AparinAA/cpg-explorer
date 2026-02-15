import { getDb } from '../db.js';

export function getSourceByPath(filePath) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT file, content 
    FROM sources 
    WHERE file = ? OR file LIKE ?
  `
    )
    .get(filePath, `%${filePath}`);
}

export function getNodesInFile(file) {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT id, name, kind, line, col, end_line
    FROM nodes
    WHERE file = ?
    ORDER BY line
  `
    )
    .all(file);
}

export function getSourceWithNodes(filePath) {
  const source = getSourceByPath(filePath);

  if (!source) {
    return null;
  }

  const nodes = getNodesInFile(source.file);

  return {
    file: source.file,
    content: source.content,
    nodes,
    language: 'go',
  };
}
