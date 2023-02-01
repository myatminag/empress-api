import express from 'express';

import { deleteUser, getAllUsers, updateProfle } from '../controllers/user.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

// Get All Users (Admin)
router.get('/userslist', authMiddleware, adminMiddleware, getAllUsers);

// Delete User (Admin)
router.delete('/usersList/:id', authMiddleware, adminMiddleware, deleteUser);

// Update Profile
router.put('/profile', authMiddleware, updateProfle);

export default router;