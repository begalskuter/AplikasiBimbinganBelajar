import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../../siswa-app/src/pages/LandingPage'
import Dashboard from './pages/dashboard/Dashboard'
import CariGuru from './pages/dashboard/CariGuru'
import DetailGuru from './pages/dashboard/DetailGuru'
import Booking from './pages/dashboard/Booking'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cari-guru" element={<CariGuru />} />
        {/* nanti tambah: */}
        <Route path="/guru/:id" element={<DetailGuru />} />
        <Route path="/booking/:id" element={<Booking />} />
        {/* <Route path="/booking/:id" element={<Booking />} /> */}
      </Routes>
    </BrowserRouter>
  )
}