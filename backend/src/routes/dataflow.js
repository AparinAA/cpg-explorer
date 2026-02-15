import { Router } from 'express';
import * as dataflowService from '../services/dataflowService.js';

const router = Router();

router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const { direction = 'backward', depth = 5, maxNodes = 50 } = req.query;

    const graphData = dataflowService.buildDataFlowGraph(id, {
      direction,
      depth: Number(depth),
      maxNodes: Number(maxNodes),
    });

    if (!graphData) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const response = dataflowService.formatDataFlowResponse(graphData);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
