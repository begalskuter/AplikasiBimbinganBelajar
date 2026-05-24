import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GuruDashboard from './pages/dashboard/GuruDashboard'
import OnboardingGuru from './pages/dashboard/OnboardingGuru'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import InboxWidget from './components/InboxWidget'
import ChatWidget from './components/ChatWidget'

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingGuru />} />
        <Route path="/dashboardguru" element={<GuruDashboard />} />
        <Route path="/dashboardadmin" element={<AdminDashboard />} />
      </Routes>
      {user && <InboxWidget role={user.role} />}
      {user && user.role === 'guru' && <ChatWidget role="guru" userId={user.id} />}
    </BrowserRouter>
  )
}