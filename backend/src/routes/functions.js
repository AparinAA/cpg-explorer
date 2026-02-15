import { Router } from 'express';
import * as functionService from '../services/functionService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const { search, package: pkg, limit = 50, offset = 0 } = req.query;

    const functions = functionService.searchFunctions({
      search,
      package: pkg,
      limit: Number(limit),
      offset: Number(offset),
    });

    const total = functionService.countFunctions({ search, package: pkg });

    res.json({
      functions,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    const funcDetails = functionService.getFunctionDetails(id);

    if (!funcDetails) {
      return res.status(404).json({ error: 'Function not found' });
    }

    res.json(funcDetails);
  } catch (err) {
    next(err);
  }
});

export default router;
