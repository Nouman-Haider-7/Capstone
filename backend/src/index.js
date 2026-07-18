import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { existsSync, mkdirSync } from 'fs'
import authRoutes from './routes/auth.js'
import settingsRoutes from './routes/settings.js'

const app = express()
const PORT = process.env.PORT || 3000

if (!existsSync('uploads')) mkdirSync('uploads')

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/settings', settingsRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
