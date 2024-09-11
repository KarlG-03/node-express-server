import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername } from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(username, hashedPassword);
  res.json({ user, token: generateToken(user.id) });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.json({ token: generateToken(user.id) });
};
