import express from 'express';
import multer from 'multer';

import { adminMiddleware } from '../middleware/admin.js';
import { authMiddleware } from '../middleware/auth.js';
import { imageUpload } from '../controllers/uploadImage.js';

const router = express.Router();

const upload = multer();

// Upload Image
router.post('/', authMiddleware, adminMiddleware, upload.single('file'), imageUpload);

export default router;