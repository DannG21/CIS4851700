const request = require('supertest');
const app     = require('../src/app');
const db      = require('../src/database');
const { faker } = require('@faker-js/faker');

describe('Users API', () => {
  afterAll(async () => {
    await db.query('DELETE FROM users');
  });

  it('creates a new user', async () => {
    const newUser = { name: faker.person.fullName(), email: faker.internet.email() };
    const res = await request(app).post('/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
  });

  it('fetches all users', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});