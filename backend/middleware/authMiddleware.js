import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../Models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  next();
});

export const admin = (req, res, next) => {
  if (req.user.isAdmin) return next();
  res.status(403);
  throw new Error('Admin only');
};
