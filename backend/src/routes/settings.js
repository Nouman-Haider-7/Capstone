const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { settingsSchema } = require('../validation/settings');

router.put('/', auth, async (req, res) => {
  try {
    const parsed = settingsSchema.safeParse(req.body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({ error: 'Validation failed', fieldErrors });
    }

    const allowedFields = [
      'fullName', 'email', 'phone', 'bio',
      'experienceLevel', 'skills', 'demoReelUrl',
    ];

    allowedFields.forEach((field) => {
      if (parsed.data[field] !== undefined) {
        req.user[field] = parsed.data[field];
      }
    });

    const updatedUser = await req.user.save();

    res.json({ message: 'Settings saved successfully', user: updatedUser.toPublicJSON() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email is already in use' });
    }
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

module.exports = router;
