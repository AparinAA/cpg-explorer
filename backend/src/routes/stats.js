import { Router } from 'express';
import * as statsService from '../services/statsService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const stats = statsService.getFullStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
