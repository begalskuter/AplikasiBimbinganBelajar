import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GuruDashboard from './pages/dashboard/GuruDashboard'
import OnboardingGuru from './pages/dashboard/OnboardingGuru'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingGuru />} />
        <Route path="/dashboardguru" element={<GuruDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}