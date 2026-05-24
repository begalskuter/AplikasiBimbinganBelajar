import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const mapelOptions = [
  'Matematika SMP', 'Matematika SMA', 'Fisika SMP', 'Fisika SMA',
  'Kimia SMA', 'Biologi SMA', 'Bahasa Inggris', 'Bahasa Indonesia',
  'IPA SMP', 'IPS SMP', 'Informatika', 'Seni & Budaya',
];
const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const slotOptions = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

export default function OnboardingGuru() {
  const [step, setStep] = useState(1);
  const [mapel, setMapel] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [slotJamPerHari, setSlotJamPerHari] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleMapel = (m) => {
    if (mapel.includes(m)) setMapel(mapel.filter(i => i !== m));
    else setMapel([...mapel, m]);
  };

  const toggleHari = (h) => {
    if (jadwal.includes(h)) {
      setJadwal(jadwal.filter(i => i !== h));
      const updated = { ...slotJamPerHari };
      delete updated[h];
      setSlotJamPerHari(updated);
      if (selectedDay === h) setSelectedDay(null);
    } else {
      setJadwal([...jadwal, h]);
      setSlotJamPerHari({ ...slotJamPerHari, [h]: [] });
    }
  };

  const selectDay = (h) => {
    if (!jadwal.includes(h)) return;
    setSelectedDay(selectedDay === h ? null : h);
  };

  const toggleSlot = (slot) => {
    if (!selectedDay) return;
    const current = slotJamPerHari[selectedDay] || [];
    const updated = current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot];
    setSlotJamPerHari({ ...slotJamPerHari, [selectedDay]: updated });
  };

  const hasAnySlots = jadwal.some(h => (slotJamPerHari[h] || []).length > 0);

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/guru/onboarding', {
        mata_pelajaran: mapel,
        jadwal: jadwal,
        slot_jam: slotJamPerHari,
      });

      // Update flag di localStorage supaya guard tahu sudah selesai
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.onboarding_completed = true;
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboardguru', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #102a4c 50%, #0d1f3c 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        background: '#fff', width: '100%', maxWidth: step === 2 ? 800 : 680, borderRadius: 24,
        padding: '44px 40px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        animation: 'fadeUp 0.4s ease-out', transition: 'max-width 0.3s',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#185FA5', letterSpacing: -0.5 }}>
            Syn<span style={{ color: '#1D9E75' }}>au</span>
          </span>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#185FA5', transition: 'all 0.3s' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Langkah {step} dari 2</span>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: step >= 2 ? '#185FA5' : '#e2e8f0', transition: 'all 0.3s' }} />
        </div>

        {error && (
          <div style={{ background: '#FFF1F2', border: '1px solid #fecdd3', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#be123c' }}>
            ⚠️ {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-book-2" style={{ fontSize: 20, color: '#185FA5' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Pilih Mata Pelajaran</h1>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, marginTop: 2 }}>Tentukan keahlian mengajar Anda</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
              {mapelOptions.map(m => {
                const active = mapel.includes(m);
                return (
                  <button key={m} onClick={() => toggleMapel(m)} style={{
                    padding: '9px 16px', borderRadius: 20,
                    border: `1.5px solid ${active ? '#185FA5' : '#e2e8f0'}`,
                    background: active ? '#EFF6FF' : '#fafafa',
                    color: active ? '#0C447C' : '#64748b', fontSize: 13,
                    fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}>
                    {active && <i className="ti ti-check" style={{ fontSize: 13, marginRight: 6 }} />}{m}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(2)} disabled={mapel.length === 0} style={{
                padding: '12px 32px', background: mapel.length > 0 ? '#185FA5' : '#d1d5db',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: mapel.length > 0 ? 'pointer' : 'default', transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}>
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-calendar-event" style={{ fontSize: 20, color: '#16a34a' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Atur Ketersediaan</h1>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, marginTop: 2 }}>Pilih hari lalu atur jam per hari</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, marginBottom: 28 }}>
              {/* Hari */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Hari</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {hariList.map(h => {
                    const active = jadwal.includes(h);
                    const isViewing = selectedDay === h;
                    const slotCount = (slotJamPerHari[h] || []).length;
                    return (
                      <div key={h} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: 8,
                        background: isViewing ? '#EFF6FF' : active ? '#f8fafc' : '#fafafa',
                        border: `1.5px solid ${isViewing ? '#93c5fd' : active ? '#d1d5db' : '#e5e7eb'}`,
                        transition: 'all 0.15s',
                      }}>
                        <button onClick={() => selectDay(h)} style={{
                          background: 'none', border: 'none', cursor: active ? 'pointer' : 'default',
                          fontSize: 13, fontWeight: active ? 600 : 400,
                          color: isViewing ? '#1d4ed8' : active ? '#0f172a' : '#cbd5e1',
                          padding: 0, fontFamily: 'inherit', flex: 1, textAlign: 'left',
                        }}>
                          {h}
                          {active && slotCount > 0 && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6 }}>{slotCount} slot</span>}
                        </button>
                        <button onClick={() => toggleHari(h)} style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${active ? '#16a34a' : '#d1d5db'}`,
                          background: active ? '#16a34a' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0, padding: 0,
                        }}>
                          {active && <i className="ti ti-check" style={{ color: '#fff', fontSize: 12 }} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Jam */}
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Jam {selectedDay ? `— ${selectedDay}` : ''}
                </h4>
                {selectedDay ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                    {slotOptions.map(slot => {
                      const active = (slotJamPerHari[selectedDay] || []).includes(slot);
                      return (
                        <button key={slot} onClick={() => toggleSlot(slot)} style={{
                          padding: '10px 0', textAlign: 'center', borderRadius: 8,
                          border: `1.5px solid ${active ? '#185FA5' : '#e2e8f0'}`,
                          background: active ? '#185FA5' : '#fafafa',
                          color: active ? '#fff' : '#64748b', fontSize: 13,
                          fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s',
                          fontFamily: 'inherit',
                        }}>{slot}</button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#cbd5e1' }}>
                    <i className="ti ti-hand-click" style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>Pilih hari terlebih dahulu</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} style={{
                padding: '12px 24px', background: 'transparent', color: '#64748b',
                border: '1.5px solid #d1d5db', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Kembali
              </button>
              <button onClick={handleFinish} disabled={!hasAnySlots || loading} style={{
                padding: '12px 32px',
                background: (hasAnySlots && !loading) ? '#1D9E75' : '#d1d5db',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
                cursor: (hasAnySlots && !loading) ? 'pointer' : 'default',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'inherit',
              }}>
                {loading && <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
                {loading ? 'Menyimpan...' : 'Selesai & Buka Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}