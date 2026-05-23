import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/dashboard/Sidebar';
import Overview from '../../components/dashboard/Overview';
import ProfilGuru from '../../components/dashboard/ProfilGuru';
import JadwalGuru from '../../components/dashboard/JadwalGuru';
import SiswaBooking from '../../components/dashboard/SiswaBooking';
import Pembayaran from '../../components/dashboard/Pembayaran';

export default function GuruDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [guruData, setGuruData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const resGuru = await api.get('/guru/me');
      setGuruData(resGuru.data);
      try {
        const resBookings = await api.get('/guru/bookings');
        setBookings(resBookings.data || []);
      } catch (err) {
        console.warn('Endpoint bookings mungkin belum tersedia', err);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setGuruData({
          nama: 'Dewi Puspitasari',
          email: 'dewi@example.com',
          kota: 'Jakarta',
          terverifikasi: true,
          total_siswa: 12,
          rating: 4.8,
          bio: 'Guru Matematika berpengalaman 5 tahun di bidang pendidikan menengah. Lulusan S1 Pendidikan Matematika Universitas Indonesia.',
          mata_pelajaran: ['Matematika SMP', 'Matematika SMA'],
          jadwal: ['Senin', 'Kamis'],
          slot_jam_per_hari: {
            'Senin': ['14:00', '16:00'],
            'Kamis': ['09:00', '10:00'],
          },
          harga: { mingguan: 150000, bulanan: 500000, menitPerSesi: 90 },
          foto_profil: null,
        });
        setBookings([
          { id: 1, siswa: { name: 'Budi Santoso', no_hp: '081234567890' }, matpel: 'Matematika SMP', paket: 'Mingguan', hari_dipilih: ['Senin'], waktu_mulai: { 'Senin': '14:00' }, tanggal_mulai: '2026-06-01', status: 'confirmed', total_harga: 150000 },
          { id: 2, siswa: { name: 'Siti Aminah', no_hp: '085678901234' }, matpel: 'Matematika SMA', paket: 'Bulanan', hari_dipilih: ['Kamis'], waktu_mulai: { 'Kamis': '09:00' }, tanggal_mulai: '2026-06-05', status: 'pending', total_harga: 500000 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) { console.error(e); }
    localStorage.removeItem('token');
    navigate('/');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#185FA5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontWeight: 500, fontSize: 14 }}>Memuat data dashboard...</p>
          </div>
        </div>
      );
    }
    switch (activePage) {
      case 'overview': return <Overview guruData={guruData} bookings={bookings} />;
      case 'profil': return <ProfilGuru guruData={guruData} onUpdate={fetchData} />;
      case 'jadwal': return <JadwalGuru guruData={guruData} onUpdate={fetchData} />;
      case 'siswa': return <SiswaBooking />;
      case 'pembayaran': return <Pembayaran />;
      default: return <Overview guruData={guruData} bookings={bookings} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Sidebar activePage={activePage} onNavigate={setActivePage} guruData={guruData} onLogout={handleLogout} />
      <div style={{ flex: 1, marginLeft: 272, padding: '36px 48px', animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>{renderContent()}</div>
      </div>
    </div>
  );
}
