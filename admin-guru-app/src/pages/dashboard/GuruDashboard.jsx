import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/dashboard/Sidebar';
import Overview from '../../components/dashboard/Overview';
import ProfilGuru from '../../components/dashboard/ProfilGuru';
import JadwalGuru from '../../components/dashboard/JadwalGuru';
import SiswaBooking from '../../components/dashboard/SiswaBooking';
import Pembayaran from '../../components/dashboard/Pembayaran';
import ChatGuru from '../../components/dashboard/ChatGuru';

export default function GuruDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [guruData, setGuruData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resGuru, resProfil] = await Promise.all([
        api.get('/guru/me'),
        api.get('/guru/profil'),
      ]);
      const merged = { ...resGuru.data, ...resProfil.data };
      setGuruData(merged);

      try {
        const resBookings = await api.get('/guru/bookings');
        setBookings(resBookings.data || []);
      } catch (err) {
        console.warn('Bookings endpoint error', err);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cek kelengkapan profil (onboarding)
  // Cek kelengkapan profil (wajib: mapel, jadwal, slot jam)
  const isProfileComplete = (data) => {
    if (!data) return false;
    const mapelOk = data.mata_pelajaran && data.mata_pelajaran.length > 0;
    const jadwalOk = data.jadwal && data.jadwal.length > 0;
    const slotJam = data.slot_jam_per_hari || {};
    const slotOk = Object.values(slotJam).some(slots => slots && slots.length > 0);
    return mapelOk && jadwalOk && slotOk;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  // Redirect ke onboarding jika profil belum lengkap
  useEffect(() => {
    if (guruData && !isProfileComplete(guruData)) {
      navigate('/onboarding');
    }
  }, [guruData, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;
    if (!guruData) return null;

    switch (activePage) {
      case 'overview':
        return <Overview guruData={guruData} bookings={bookings} />;
      case 'profil':
        return <ProfilGuru guruData={guruData} onUpdate={fetchData} />;
      case 'jadwal':
        return <JadwalGuru guruData={guruData} onUpdate={fetchData} />;
      case 'siswa':
        return <SiswaBooking />;
      case 'pembayaran':
        return <Pembayaran />;
      case 'chat':
        return <ChatGuru guruData={guruData} />;
      default:
        return <Overview guruData={guruData} bookings={bookings} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} guruData={guruData} onLogout={handleLogout} />
      <div style={{ flex: 1, marginLeft: 272, padding: '36px 48px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>{renderContent()}</div>
      </div>
    </div>
  );
}
