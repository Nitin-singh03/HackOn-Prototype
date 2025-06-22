import asyncHandler from 'express-async-handler';
import User from '../Models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = asyncHandler(async (req, res) => {
  const u = await User.create(req.body);
  res.status(201).json({ _id: u._id, name: u.name, email: u.email, token: generateToken(u._id) });
});

export const authUser = asyncHandler(async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (u && await u.matchPassword(req.body.password)) {
    res.json({ _id: u._id, name: u.name, email: u.email, token: generateToken(u._id) });
  } else {
    res.status(401); throw new Error('Invalid credentials');
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});
