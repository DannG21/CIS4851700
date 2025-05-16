const User = require('../../../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

jest.mock('mongoose');
jest.mock('bcryptjs');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash password before saving', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    
    const mockUser = {
      password: 'password123',
      isModified: jest.fn().mockReturnValue(true),
      save: jest.fn(),
    };
    
    const preSaveHook = User.schema.pre.mock.calls[0][1];
    
    await preSaveHook.call(mockUser);
    
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockUser.password).toBe('hashedPassword123');
  });

  it('should not hash password if not modified', async () => {
    const mockUser = {
      password: 'password123',
      isModified: jest.fn().mockReturnValue(false),
      save: jest.fn(),
    };
    
    const preSaveHook = User.schema.pre.mock.calls[0][1];
    
    await preSaveHook.call(mockUser);
    
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUser.password).toBe('password123');
  });

  it('should compare passwords correctly', async () => {
    bcrypt.compare.mockResolvedValueOnce(true);
    bcrypt.compare.mockResolvedValueOnce(false);
    
    const mockUser = {
      password: 'hashedPassword123',
    };
   
    mockUser.comparePassword = User.schema.methods.comparePassword;
    
    const isMatch1 = await mockUser.comparePassword('password123');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    expect(isMatch1).toBe(true);

    const isMatch2 = await mockUser.comparePassword('wrongPassword');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword123');
    expect(isMatch2).toBe(false);
  });
});