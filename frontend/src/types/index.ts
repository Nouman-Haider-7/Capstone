export interface ActorSettings {
  firstName: string
  lastName: string
  email: string
  phone: string
  headshot: string
  bio: string
  location: string
  experienceLevel: 'beginner' | 'intermediate' | 'professional' | 'veteran'
  skills: string[]
  demoReel: string
  website: string
  instagram: string
  availability: 'available' | 'unavailable' | 'selectively-available'
  willingToTravel: boolean
}

export interface User extends ActorSettings {
  _id: string
  role: 'actor' | 'director'
  createdAt: string
  updatedAt: string
}

export interface UpdatePasswordPayload {
  currentPassword: string
  newPassword: string
}
