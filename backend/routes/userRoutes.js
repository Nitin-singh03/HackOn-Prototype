import express from 'express';
import { registerUser, authUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const r = express.Router();
r.post('/register', registerUser);
r.post('/login',    authUser);
r.get('/profile', protect, getUserProfile);
export default r;
