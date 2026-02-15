import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const PORT = process.env.BACKEND_PORT || process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

export const configEnv = {
  apiVersion: API_VERSION,
  apiPrefix: API_PREFIX,
  port: PORT,
  envPath: envPath,
  dbPath: process.env.DB_PATH,
};
