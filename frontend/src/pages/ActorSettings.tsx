import ActorSettingsForm from '../components/ActorSettingsForm'

export default function ActorSettings() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Actor Settings</h1>
      <p className="mb-8 text-gray-500">
        Manage your profile, skills, and account preferences.
      </p>
      <ActorSettingsForm />
    </div>
  )
}
