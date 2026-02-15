import Database from 'better-sqlite3';
import path from 'path';
import { configEnv } from './config.js';

let db = null;

export function initDb() {
  const dbPath = path.join(configEnv.envPath, configEnv.dbPath || 'cpg.db');
  db = new Database(dbPath, {
    readonly: true,
    fileMustExist: true,
  });

  db.pragma('cache_size = -64000');
  db.pragma('mmap_size = 268435456');

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function paginate(query, params = {}, limit = 50, offset = 0) {
  const limitedQuery = `${query} LIMIT ? OFFSET ?`;
  return db.prepare(limitedQuery).all(...Object.values(params), limit, offset);
}
