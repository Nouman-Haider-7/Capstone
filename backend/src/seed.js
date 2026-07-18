require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stageway';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'actor@stageway.test' });
  if (existing) {
    console.log('Test user already exists');
    await mongoose.disconnect();
    return;
  }

  const user = new User({
    fullName: 'Test Actor',
    email: 'actor@stageway.test',
    password: 'password123',
    phone: '',
    bio: '',
    experienceLevel: 'Beginner',
    skills: [],
    demoReelUrl: '',
  });

  await user.save();
  console.log('Test user created — email: actor@stageway.test, password: password123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
