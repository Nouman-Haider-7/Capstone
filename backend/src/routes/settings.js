import { Router } from 'express'
import multer from 'multer'
import { extname, join } from 'path'
import auth from '../middleware/auth.js'

const router = Router()

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'))
    }
    cb(null, true)
  },
})

router.get('/profile', auth, async (req, res) => {
  res.json(req.user)
})

router.put('/profile', auth, async (req, res) => {
  const allowed = [
    'firstName', 'lastName', 'email', 'phone', 'headshot',
    'bio', 'location', 'experienceLevel', 'skills', 'demoReel',
    'website', 'instagram', 'availability', 'willingToTravel',
  ]

  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  const user = await req.user.constructor.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  )

  res.json(user)
})

router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required.' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const match = await req.user.comparePassword(currentPassword)
  if (!match) {
    return res.status(400).json({ message: 'Current password is incorrect.' })
  }

  req.user.password = newPassword
  await req.user.save()

  res.json({ message: 'Password updated successfully.' })
})

router.post('/headshot', auth, upload.single('headshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided.' })
  }

  const url = `/uploads/${req.file.filename}`
  req.user.headshot = url
  await req.user.save()

  res.json({ url })
})

export default router
