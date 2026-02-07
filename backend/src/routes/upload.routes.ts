import express from 'express';
import { uploadFile } from '../controllers/uploadController';
import { upload } from '../middlewares/upload';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);

export default router;
