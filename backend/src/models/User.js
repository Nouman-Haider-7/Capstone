import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['actor', 'director'], default: 'actor' },

    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    headshot: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'professional', 'veteran'],
      default: 'beginner',
    },
    skills: [{ type: String }],
    demoReel: { type: String, default: '' },
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    availability: {
      type: String,
      enum: ['available', 'unavailable', 'selectively-available'],
      default: 'available',
    },
    willingToTravel: { type: Boolean, default: false },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
