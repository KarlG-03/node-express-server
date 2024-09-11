import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { register, login } from './authController';
import { createUser, findUserByUsername } from '~/models/User';
import { generateToken } from '~/utils/generateToken';

jest.mock('~/models/User');
jest.mock('~/utils/generateToken');
jest.mock('bcrypt');

describe('authController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('register', () => {
    it('should create a new user and return token', async () => {
      const registerFunc = register as Function;
      mockRequest.body = { username: 'testuser', password: 'password123' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (createUser as jest.Mock).mockResolvedValue({ id: 1, username: 'testuser' });
      (generateToken as jest.Mock).mockReturnValue('testtoken');

      await registerFunc(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(createUser).toHaveBeenCalledWith('testuser', 'hashedPassword');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: { id: 1, username: 'testuser' },
        token: 'testtoken',
      });
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const loginFunc = login as Function;
      mockRequest.body = { username: 'testuser', password: 'password123' };
      (findUserByUsername as jest.Mock).mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('testtoken');

      await loginFunc(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(findUserByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(mockResponse.json).toHaveBeenCalledWith({ token: 'testtoken' });
    });

    it('should call next with error for invalid credentials', async () => {
      const loginFunc = login as Function;
      mockRequest.body = { username: 'testuser', password: 'wrongpassword' };
      (findUserByUsername as jest.Mock).mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedPassword' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await loginFunc(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid credentials',
          statusCode: 401,
        }),
      );
    });
  });
});
