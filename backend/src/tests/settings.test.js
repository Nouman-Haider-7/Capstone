require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stageway-test';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-to-a-long-random-string';

let testUser;
let token;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
  testUser = new User({
    fullName: 'Test Actor',
    email: `test-${Date.now()}@stageway.test`,
    password: 'password123',
    experienceLevel: 'Beginner',
  });
  await testUser.save();
  token = jwt.sign({ userId: testUser._id }, JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  if (testUser) {
    await User.deleteOne({ _id: testUser._id });
  }
  await mongoose.disconnect();
});

describe('PUT /api/settings', () => {
  test('rejects an invalid email', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Valid Name',
        email: 'not-an-email',
        experienceLevel: 'Beginner',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.fieldErrors).toHaveProperty('email');
  });

  test('accepts a valid payload', async () => {
    const res = await request(app)
      .put('/api/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Updated Actor Name',
        email: `updated-${Date.now()}@stageway.test`,
        experienceLevel: 'Professional',
        bio: 'A talented actor with years of experience.',
        skills: ['Acting', 'Singing', 'Dancing'],
        phone: '+1-555-123-4567',
        demoReelUrl: 'https://youtube.com/watch?v=demo',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Settings saved successfully');
    expect(res.body.user.fullName).toBe('Updated Actor Name');
    expect(res.body.user.experienceLevel).toBe('Professional');
    expect(res.body.user.skills).toEqual(['Acting', 'Singing', 'Dancing']);
    expect(res.body.user).not.toHaveProperty('password');
  });
});
