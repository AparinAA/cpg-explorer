import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { initDb } from './db.js';
import functionsRouter from './routes/functions.js';
import callgraphRouter from './routes/callgraph.js';
import dataflowRouter from './routes/dataflow.js';
import packagesRouter from './routes/packages.js';
import sourceRouter from './routes/source.js';
import statsRouter from './routes/stats.js';
import { configEnv } from './config.js';

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

try {
  initDb();
  console.log('Database connected successfully');
} catch (err) {
  console.error('Failed to connect to database:', err.message);
  process.exit(1);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: configEnv.apiVersion, timestamp: new Date().toISOString() });
});

app.use(`${configEnv.apiPrefix}/functions`, functionsRouter);
app.use(`${configEnv.apiPrefix}/callgraph`, callgraphRouter);
app.use(`${configEnv.apiPrefix}/dataflow`, dataflowRouter);
app.use(`${configEnv.apiPrefix}/packages`, packagesRouter);
app.use(`${configEnv.apiPrefix}/source`, sourceRouter);
app.use(`${configEnv.apiPrefix}/stats`, statsRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(configEnv.port, () => {
  console.log(
    `CPG Explorer API running on http://localhost:${configEnv.port}${configEnv.apiPrefix}`
  );
});
