import { useState, useEffect } from 'react';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function Overview({ guruData, bookings }) {
  const [now, setNow] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = dayNames[now.getDay()];

  const totalSiswa = guruData?.total_siswa || 0;
  const rating = guruData?.rating || 0;
  const pendingCount = (bookings || []).filter(b => b.status === 'pending').length;
  const confirmedCount = (bookings || []).filter(b => b.status === 'confirmed').length;

  // Get slots for today from per-day data
  const slotPerHari = guruData?.slot_jam_per_hari || {};
  const todaySchedule = (guruData?.jadwal || []).includes(todayName);
  const todaySlots = todaySchedule ? (slotPerHari[todayName] || guruData?.slot_jam || []) : [];
  const recentBookings = (bookings || []).slice(0, 5);

  // Selected day — only show slots that have booked students
  const selectedDayBookings = selectedDay
    ? (bookings || []).filter(b => (b.hari_dipilih || []).includes(selectedDay))
    : [];

  const summaryCards = [
    { icon: 'ti-users', label: 'Total Siswa', value: totalSiswa, accent: '#185FA5' },
    { icon: 'ti-star', label: 'Rating', value: rating > 0 ? rating.toFixed(1) : '—', accent: '#d97706' },
    { icon: 'ti-clock-pause', label: 'Menunggu', value: pendingCount, accent: '#ea580c' },
    { icon: 'ti-circle-check', label: 'Aktif', value: confirmedCount, accent: '#16a34a' },
  ];

  const statusStyle = (status) => {
    const map = {
      pending: { bg: '#FFF7ED', color: '#ea580c', label: 'Pending' },
      confirmed: { bg: '#F0FDF4', color: '#16a34a', label: 'Dikonfirmasi' },
      cancelled: { bg: '#FEF2F2', color: '#dc2626', label: 'Dibatalkan' },
    };
    return map[status] || map.pending;
  };

  const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
            Selamat Datang, <span style={{ color: '#185FA5' }}>{guruData?.nama?.split(' ')[0] || 'Guru'}</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            {todayName}, {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#0f172a', borderRadius: 10, padding: '8px 18px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 600, color: '#e2e8f0', letterSpacing: 1 }}>
            {formatTime(now)}
          </span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      {/* Verification Banner */}
      {guruData && !guruData.terverifikasi && (
        <div style={{
          background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12,
          padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: '#d97706' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Akun Belum Terverifikasi</div>
            <div style={{ fontSize: 12, color: '#a16207', marginTop: 1 }}>Tim admin sedang memeriksa dokumen Anda.</div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 14, padding: '20px 18px',
            border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'default',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{card.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${card.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${card.icon}`} style={{ fontSize: 17, color: card.accent }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: card.accent, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        {/* Today's Schedule */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-calendar-event" style={{ fontSize: 18, color: '#185FA5' }} />
              Jadwal Hari Ini
            </h3>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
              background: todaySchedule ? '#F0FDF4' : '#FFF7ED',
              color: todaySchedule ? '#16a34a' : '#ea580c',
              padding: '4px 10px', borderRadius: 6,
            }}>
              {todaySchedule ? 'Ada Jadwal' : 'Libur'}
            </span>
          </div>
          {todaySchedule && todaySlots.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {todaySlots.map((slot, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9',
                }}>
                  <div style={{ padding: '5px 10px', borderRadius: 6, background: '#EEF2FF', fontSize: 13, fontWeight: 700, color: '#4338ca' }}>{slot}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    {(guruData?.mata_pelajaran || ['Umum'])[0]} — {guruData?.harga?.menitPerSesi || 90} menit
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#cbd5e1' }}>
              <i className="ti ti-calendar-off" style={{ fontSize: 32, display: 'block', marginBottom: 6 }} />
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Tidak ada jadwal hari ini</div>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-list-check" style={{ fontSize: 18, color: '#185FA5' }} />
            Booking Terbaru
          </h3>
          {recentBookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentBookings.map((b, i) => {
                const st = statusStyle(b.status);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9',
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8, background: '#E6F1FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#185FA5', flexShrink: 0,
                    }}>{(b.siswa?.name || 'S').substring(0, 2).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{b.siswa?.name || 'Siswa'}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{b.paket} · {(b.hari_dipilih || []).join(', ')}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, padding: '3px 8px', borderRadius: 6 }}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#cbd5e1' }}>
              <i className="ti ti-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 6 }} />
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Belum ada booking masuk</div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Schedule with clickable days */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        borderRadius: 16, padding: '22px 26px', color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selectedDay && selectedDayBookings.length > 0 ? 18 : 0 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 3 }}>Jadwal Mengajar Minggu Ini</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              {selectedDay
                ? `Siswa terjadwal di hari ${selectedDay}`
                : (guruData?.jadwal || []).length > 0
                  ? 'Klik hari aktif untuk melihat siswa terjadwal'
                  : 'Belum ada jadwal yang ditentukan'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {hariList.map(h => {
              const active = (guruData?.jadwal || []).includes(h);
              const isSelected = selectedDay === h;
              return (
                <button key={h} onClick={() => active && setSelectedDay(isSelected ? null : h)} style={{
                  width: 42, height: 42, borderRadius: 10, border: 'none',
                  background: isSelected ? '#4db8ff' : active ? 'rgba(77,184,255,0.18)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: isSelected ? '#0f172a' : active ? '#93c5fd' : 'rgba(255,255,255,0.15)',
                  cursor: active ? 'pointer' : 'default', transition: 'all 0.2s',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 14px rgba(77,184,255,0.35)' : 'none',
                }}>{h.substring(0, 2)}</button>
              );
            })}
          </div>
        </div>

        {/* Detail — only slots WITH booked students */}
        {selectedDay && selectedDayBookings.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {selectedDayBookings.map((b, j) => {
                const jam = b.waktu_mulai?.[selectedDay] || '—';
                return (
                  <div key={j} style={{
                    background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px',
                    border: '1px solid rgba(255,255,255,0.06)', minWidth: 220, flexShrink: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ background: 'rgba(77,184,255,0.18)', color: '#93c5fd', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{jam}</div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{guruData?.harga?.menitPerSesi || 90} menit</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      <i className="ti ti-book" style={{ fontSize: 12, marginRight: 6, opacity: 0.5 }} />
                      {b.matpel || 'Mata Pelajaran'}
                    </div>
                    <div style={{ fontSize: 13, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <i className="ti ti-user" style={{ fontSize: 13 }} />
                      {b.siswa?.name || 'Siswa'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedDay && selectedDayBookings.length === 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, textAlign: 'center', padding: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Belum ada siswa terjadwal di hari {selectedDay}
          </div>
        )}
      </div>
    </div>
  );
}
