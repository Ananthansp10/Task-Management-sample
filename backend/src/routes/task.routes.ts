import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, createTasksBulk } from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // All task routes are protected

router.route('/')
    .post(createTask)
    .get(getTasks);

router.post('/bulk', createTasksBulk);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

export default router;
