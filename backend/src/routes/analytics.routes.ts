import express from 'express';
import { protect } from '../middlewares/authMiddleware';

import { getDashboardStats } from '../controllers/analyticsController';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);

export default router;
