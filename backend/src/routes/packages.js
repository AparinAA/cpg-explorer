import { Router } from 'express';
import * as packageService from '../services/packageService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const packages = packageService.getAllPackages();
    res.json({ packages, total: packages.length });
  } catch (err) {
    next(err);
  }
});

router.get('/graph', (req, res, next) => {
  try {
    const { root: rootPackage, depth = 2, maxNodes = 60 } = req.query;

    const graph = packageService.getPackageGraph({
      rootPackage: rootPackage || null,
      depth: Number(depth),
      maxNodes: Number(maxNodes),
    });
    res.json(graph);
  } catch (err) {
    next(err);
  }
});

router.get('/:name/functions', (req, res, next) => {
  try {
    const packageName = decodeURIComponent(req.params.name);
    const { limit = 100, offset = 0 } = req.query;

    const functions = packageService.getPackageFunctions(packageName, {
      limit: Number(limit),
      offset: Number(offset),
    });

    const total = packageService.countPackageFunctions(packageName);

    res.json({ functions, total, package: packageName });
  } catch (err) {
    next(err);
  }
});

export default router;
