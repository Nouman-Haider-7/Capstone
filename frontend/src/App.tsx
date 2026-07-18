import { Routes, Route, Navigate } from 'react-router-dom'
import ActorSettings from './pages/ActorSettings'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/settings" element={<ActorSettings />} />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </div>
  )
}
