import { Router } from 'express';
import * as callgraphService from '../services/callgraphService.js';

const router = Router();

router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { depth = 2, direction = 'both', maxNodes = 60 } = req.query;

    const graphData = callgraphService.buildCallGraph(id, {
      depth: Number(depth),
      direction,
      maxNodes: Number(maxNodes),
    });

    if (!graphData) {
      return res.status(404).json({ error: 'Function not found' });
    }

    const response = callgraphService.formatGraphResponse(graphData);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
