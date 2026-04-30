
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home/HomePage'
import WorkoutPage from './pages/workout/WorkoutPage'
import TimerPage from './pages/timer/TimerPage'
import CompletionContent from './pages/completion/CompletionContent'
import SettingsPage from './pages/settings/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/completion" element={<CompletionContent />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
