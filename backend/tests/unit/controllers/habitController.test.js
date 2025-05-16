const habitController = require('../../../controllers/habitController');
const Habit = require('../../../models/Habit');
const Record = require('../../../models/Record');
const Streak = require('../../../models/Streak');

jest.mock('../../../models/Habit');
jest.mock('../../../models/Record');
jest.mock('../../../models/Streak');

describe('Habit Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 'user123' },
      params: { id: 'habit123' },
      body: {
        name: 'Morning Meditation',
        description: 'Meditate for 10 minutes each morning',
        frequency: 'daily',
        goalValue: 10,
        unit: 'minutes',
        color: '#4CAF50',
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    jest.clearAllMocks();
  });

  describe('getHabits', () => {
    it('should get habits for current user', async () => {
      const mockHabits = [
        { _id: 'habit1', name: 'Exercise', userId: 'user123' },
        { _id: 'habit2', name: 'Reading', userId: 'user123' }
      ];
      
      Habit.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockHabits)
      });
      
      await habitController.getHabits(req, res);

      expect(Habit.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHabits);
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      Habit.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(error)
      });
      
      await habitController.getHabits(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('createHabit', () => {
    it('should create a new habit', async () => {
      const mockHabit = {
        _id: 'habit123',
        ...req.body,
        userId: 'user123',
        save: jest.fn().mockResolvedValue(true)
      };
      
      Habit.mockImplementation(() => mockHabit);
      
      await habitController.createHabit(req, res);
      
      expect(Habit).toHaveBeenCalledWith({
        name: 'Morning Meditation',
        description: 'Meditate for 10 minutes each morning',
        frequency: 'daily',
        goalValue: 10,
        unit: 'minutes',
        color: '#4CAF50',
        userId: 'user123'
      });
      expect(mockHabit.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockHabit);
    });
    
    it('should handle errors', async () => {
      const mockHabit = {
        ...req.body,
        userId: 'user123',
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };
      
      Habit.mockImplementation(() => mockHabit);
      
      await habitController.createHabit(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});