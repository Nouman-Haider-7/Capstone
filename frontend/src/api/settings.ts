import axios from 'axios'
import type { ActorSettings, UpdatePasswordPayload } from '../types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getProfile(): Promise<ActorSettings> {
  const { data } = await api.get('/settings/profile')
  return data
}

export async function updateProfile(payload: Partial<ActorSettings>) {
  const { data } = await api.put('/settings/profile', payload)
  return data
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  const { data } = await api.put('/settings/password', payload)
  return data
}

export async function uploadHeadshot(file: File): Promise<{ url: string }> {
  const form = new FormData()
  form.append('headshot', file)
  const { data } = await api.post('/settings/headshot', form)
  return data
}
