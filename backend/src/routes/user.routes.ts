import express from 'express';
import { protect } from '../middlewares/authMiddleware';

import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = express.Router();

router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
