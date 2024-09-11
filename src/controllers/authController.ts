import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { createUser, findUserByUsername } from '~/models/User';
import { createAppError } from '~/utils/errors';
import { generateToken } from '~/utils/generateToken';

export const registerValidation = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createAppError(errors.array()[0].msg, 400));
  }

  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);
    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (error) {
    next(createAppError('Error registering user', 500));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createAppError(errors.array()[0].msg, 400));
  }

  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(createAppError('Invalid credentials', 401));
    }
    res.json({ token: generateToken(user.id) });
  } catch (error) {
    next(createAppError('Error logging in', 500));
  }
};
