import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { settingsSchema, type SettingsFormData } from '../validation/settings'
import api from '../lib/api'
import TagInput from './TagInput'

export default function SettingsForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      bio: '',
      experienceLevel: 'Beginner',
      skills: [],
      demoReelUrl: '',
    },
  })

  const bioValue = watch('bio') ?? ''

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.setItem('token', import.meta.env.VITE_MOCK_TOKEN || '')
    }
  }, [])

  const onSubmit = async (data: SettingsFormData) => {
    setStatus('loading')
    setServerError('')
    try {
      await api.put('/settings', data)
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        setServerError(axiosErr.response?.data?.error || 'Failed to save settings')
      } else {
        setServerError('Failed to save settings')
      }
    }
  }

  const errorId = (name: string) => errors[name as keyof typeof errors] ? `${name}-error` : undefined

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Actor Settings</h1>

      {status === 'success' && (
        <div role="alert" className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          Settings saved successfully!
        </div>
      )}

      {status === 'error' && serverError && (
        <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            aria-describedby={errorId('fullName')}
            aria-invalid={!!errors.fullName}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            aria-describedby={errorId('email')}
            aria-invalid={!!errors.email}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            aria-describedby={errorId('phone')}
            aria-invalid={!!errors.phone}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p id="phone-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            {...register('bio')}
            aria-describedby={`bio-error bio-count`}
            aria-invalid={!!errors.bio}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.bio ? (
              <p id="bio-error" role="alert" className="text-sm text-red-600">
                {errors.bio.message}
              </p>
            ) : (
              <span />
            )}
            <p id="bio-count" className="text-xs text-gray-500">
              {bioValue.length} / 300
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            id="experienceLevel"
            {...register('experienceLevel')}
            aria-describedby={errorId('experienceLevel')}
            aria-invalid={!!errors.experienceLevel}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white ${
              errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>
          {errors.experienceLevel && (
            <p id="experienceLevel-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.experienceLevel.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value ?? []}
                onChange={field.onChange}
                max={10}
                errorId={errors.skills ? 'skills-error' : undefined}
              />
            )}
          />
          {errors.skills && (
            <p id="skills-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.skills.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="demoReelUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Demo Reel URL
          </label>
          <input
            id="demoReelUrl"
            type="url"
            {...register('demoReelUrl')}
            aria-describedby={errorId('demoReelUrl')}
            aria-invalid={!!errors.demoReelUrl}
            placeholder="https://..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.demoReelUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.demoReelUrl && (
            <p id="demoReelUrl-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.demoReelUrl.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === 'loading' && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {status === 'loading' ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
