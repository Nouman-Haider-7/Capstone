import { useState, useEffect, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { getProfile, updateProfile, updatePassword, uploadHeadshot } from '../api/settings'
import type { ActorSettings } from '../types'

const SKILL_OPTIONS = [
  'Acting', 'Singing', 'Dancing', 'Voice Acting', 'Stunt Work',
  'Improvisation', 'Stage Combat', 'Accents', 'Motion Capture',
  'Script Analysis', 'Directing', 'Choreography',
]

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'professional', label: 'Professional' },
  { value: 'veteran', label: 'Veteran' },
] as const

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'selectively-available', label: 'Selectively Available' },
  { value: 'unavailable', label: 'Unavailable' },
] as const

const emptyForm: ActorSettings = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  headshot: '',
  bio: '',
  location: '',
  experienceLevel: 'beginner',
  skills: [],
  demoReel: '',
  website: '',
  instagram: '',
  availability: 'available',
  willingToTravel: false,
}

export default function ActorSettingsForm() {
  const [form, setForm] = useState<ActorSettings>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const [skillInput, setSkillInput] = useState('')
  const [headshotPreview, setHeadshotPreview] = useState('')
  const [headshotUploading, setHeadshotUploading] = useState(false)

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm(data)
        if (data.headshot) setHeadshotPreview(data.headshot)
      })
      .catch(() => setError('Failed to load profile. Make sure you are logged in.'))
      .finally(() => setLoading(false))
  }, [])

  function update<K extends keyof ActorSettings>(field: K, value: ActorSettings[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleHeadshot(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeadshotUploading(true)
    try {
      const { url } = await uploadHeadshot(file)
      update('headshot', url)
      setHeadshotPreview(URL.createObjectURL(file))
      setSuccess('Headshot uploaded successfully.')
    } catch {
      setError('Failed to upload headshot.')
    } finally {
      setHeadshotUploading(false)
    }
  }

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !form.skills.includes(trimmed)) {
      update('skills', [...form.skills, trimmed])
    }
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    update('skills', form.skills.filter((s) => s !== skill))
  }

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await updateProfile(form)
      setSuccess('Profile updated successfully.')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    setPasswordSaving(true)
    try {
      await updatePassword({ currentPassword, newPassword })
      setPasswordSuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || 'Failed to update password.')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <form onSubmit={handleProfileSave} className="space-y-10">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ── Profile Section ── */}
      <Section title="Profile">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <label className="group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full bg-gray-100">
            {headshotPreview ? (
              <img src={headshotPreview} alt="Headshot" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
              <span className="text-xs font-medium text-white">
                {headshotUploading ? 'Uploading...' : 'Upload'}
              </span>
            </div>
            <input type="file" accept="image/*" onChange={handleHeadshot} className="hidden" disabled={headshotUploading} />
          </label>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name" error={!form.firstName && 'Required'}>
                <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="input" required />
              </Field>
              <Field label="Last Name" error={!form.lastName && 'Required'}>
                <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="input" required />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input" />
              </Field>
              <Field label="Phone">
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" />
              </Field>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Bio Section ── */}
      <Section title="Bio & Location">
        <Field label="Bio">
          <textarea rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)} className="input resize-y" placeholder="Tell us about yourself..." />
        </Field>
        <Field label="Location">
          <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="input" placeholder="City, State" />
        </Field>
      </Section>

      {/* ── Professional Section ── */}
      <Section title="Professional">
        <Field label="Experience Level">
          <select value={form.experienceLevel} onChange={(e) => update('experienceLevel', e.target.value as ActorSettings['experienceLevel'])} className="input">
            {EXPERIENCE_LEVELS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Skills">
          <div className="mb-2 flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-900">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              list="skill-suggestions"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              className="input flex-1"
              placeholder="Type a skill and press Enter"
            />
            <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary">Add</button>
          </div>
          <datalist id="skill-suggestions">
            {SKILL_OPTIONS.filter((s) => !form.skills.includes(s)).map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>

        <Field label="Demo Reel URL">
          <input type="url" value={form.demoReel} onChange={(e) => update('demoReel', e.target.value)} className="input" placeholder="https://youtube.com/..." />
        </Field>
      </Section>

      {/* ── Social Section ── */}
      <Section title="Social Links">
        <Field label="Website">
          <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} className="input" placeholder="https://..." />
        </Field>
        <Field label="Instagram">
          <input type="text" value={form.instagram} onChange={(e) => update('instagram', e.target.value)} className="input" placeholder="@username" />
        </Field>
      </Section>

      {/* ── Preferences Section ── */}
      <Section title="Preferences">
        <Field label="Availability">
          <select value={form.availability} onChange={(e) => update('availability', e.target.value as ActorSettings['availability'])} className="input">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <label className="flex items-center gap-3">
          <input type="checkbox" checked={form.willingToTravel} onChange={(e) => update('willingToTravel', e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm font-medium text-gray-700">Willing to travel for roles</span>
        </label>
      </Section>

      {/* ── Save ── */}
      <div className="flex justify-end border-t pt-6">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* ── Password Section ── */}
      <Section title="Change Password">
        {passwordError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{passwordError}</div>
        )}
        {passwordSuccess && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{passwordSuccess}</div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Current Password">
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" required />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" required minLength={6} />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required />
          </Field>
          <div className="flex justify-end">
            <button type="submit" disabled={passwordSaving} className="btn-primary">
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Section>
    </form>
  )
}

/* ── Sub-components ── */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string | false; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {error && <span className="text-red-500">— {error}</span>}
      </label>
      {children}
    </div>
  )
}
