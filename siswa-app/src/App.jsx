import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/dashboard/Dashboard'
import CariGuru from './pages/dashboard/CariGuru'
import DetailGuru from './pages/dashboard/DetailGuru'
import Booking from './pages/dashboard/Booking'
import Profile from './pages/dashboard/Profile'
import InboxWidget from './components/InboxWidget'

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
      {user && <InboxWidget role={user.role} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cari-guru" element={<CariGuru />} />
        {/* nanti tambah: */}
        <Route path="/guru/:id" element={<DetailGuru />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/booking/:id" element={<Booking />} /> */}
      </Routes>
    </BrowserRouter>
  )
}