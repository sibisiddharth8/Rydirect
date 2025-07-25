import { Router } from 'express';
import { createBatch, getBatches, getBatchById, updateBatch, deleteBatch, getTopBatches } from '../controllers/batch.controller';

const router = Router();

router.get('/top', getTopBatches);

router.route('/')
    .post(createBatch)
    .get(getBatches);

router.route('/:id')
    .get(getBatchById)
    .put(updateBatch)
    .delete(deleteBatch);

export default router;