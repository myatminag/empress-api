import express from 'express';

import { login, signup, forgotPassword, resetPassword } from '../controllers/auth.js';

const router = express.Router();

// Register
router.post('/register', signup);

// Login
router.post('/login', login);

// Forget Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.put('/reset-password/:token', resetPassword);
 
export default router; 