import { Routes, Route, Navigate } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  )
}
