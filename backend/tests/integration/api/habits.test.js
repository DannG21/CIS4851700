const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const Habit = require('../../../models/Habit');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Habits API', () => {
  let authToken;
  let userId;
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    userId = user._id;
    
    jwt.sign.mockReturnValue('test-token');
    authToken = 'Bearer test-token';
    
    jwt.verify.mockImplementation(() => ({ id: userId.toString() }));
  });
  
  afterAll(async () => {
    await User.deleteMany({});
    await Habit.deleteMany({});
    await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    await Habit.deleteMany({});
  });
  
  describe('GET /api/habits', () => {
    it('should return empty array when no habits exist', async () => {
      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', authToken);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
    
    it('should return user habits when they exist', async () => {
      await Habit.create({
        name: 'Test Habit',
        description: 'Test Description',
        frequency: 'daily',
        goalValue: 1,
        unit: 'times',
        userId: userId
      });
      
      const res = await request(app)
        .get('/api/habits')
        .set('Authorization', authToken);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].name).toEqual('Test Habit');
    });
  });
  
  describe('POST /api/habits', () => {
    it('should create a new habit', async () => {
      const habitData = {
        name: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        goalValue: 30,
        unit: 'minutes'
      };
      
      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', authToken)
        .send(habitData);
        
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('Exercise');
      expect(res.body.userId).toEqual(userId.toString());
      
      const habit = await Habit.findById(res.body._id);
      expect(habit).toBeTruthy();
      expect(habit.name).toEqual('Exercise');
    });
    
    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', authToken)
        .send({ name: '' });
        
      expect(res.statusCode).toEqual(400);
    });
  });
});