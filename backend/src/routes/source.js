import { Router } from 'express';
import * as sourceService from '../services/sourceService.js';

const router = Router();

router.get('/*filepath', (req, res, next) => {
  try {
    const filePath = req.params.filepath;

    const sourceData = sourceService.getSourceWithNodes(filePath);

    if (!sourceData) {
      return res.status(404).json({ error: 'Source file not found' });
    }

    res.json(sourceData);
  } catch (err) {
    next(err);
  }
});

export default router;
