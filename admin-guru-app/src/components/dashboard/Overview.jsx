import { useState, useEffect } from 'react';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const s = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    background: '#ffffff',
    border: '1px solid #E6F1FB',
    borderRadius: 20,
    padding: '26px 30px',
    boxShadow: '0 10px 28px rgba(12,68,124,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    color: '#042C53',
    letterSpacing: '-0.7px',
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: 600,
    marginTop: 8,
  },
  timeBox: {
    background: '#071a2f',
    color: '#fff',
    borderRadius: 16,
    padding: '14px 22px',
    minWidth: 138,
    textAlign: 'center',
    boxShadow: '0 8px 22px rgba(7,26,47,0.18)',
  },
  sectionCard: {
    background: '#ffffff',
    border: '1px solid #E6F1FB',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 10px 28px rgba(12,68,124,0.05)',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 900,
    color: '#042C53',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 5,
    lineHeight: 1.5,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 18,
  },
};

export default function Overview({ guruData, bookings }) {
  const [now, setNow] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = dayNames[now.getDay()];

  const pendingCount = (bookings || []).filter(b => b.status === 'pending').length;
  const confirmedCount = (bookings || []).filter(b => b.status === 'confirmed').length;
  const recentBookings = (bookings || []).slice(0, 5);

  const selectedDayBookings = selectedDay
    ? (bookings || []).filter(b => (b.hari_dipilih || []).includes(selectedDay))
    : [];

  const summaryCards = [
    { icon: 'ti-clock-pause', label: 'Menunggu', value: pendingCount, desc: 'Booking pending', accent: '#ea580c', bg: '#FFEDD5' },
    { icon: 'ti-circle-check', label: 'Aktif', value: confirmedCount, desc: 'Booking dikonfirmasi', accent: '#16a34a', bg: '#DCFCE7' },
  ];

  const statusStyle = (status) => {
    const map = {
      pending: { bg: '#FFF7ED', color: '#ea580c', label: 'Pending' },
      confirmed: { bg: '#F0FDF4', color: '#16a34a', label: 'Dikonfirmasi' },
      cancelled: { bg: '#FEF2F2', color: '#dc2626', label: 'Dibatalkan' },
    };
    return map[status] || map.pending;
  };

  const formatTime = (d) => d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div style={s.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.88); }
        }

        @media (max-width: 900px) {
          .overview-stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            Selamat Datang, <span style={{ color: '#185FA5' }}>{guruData?.nama?.split(' ')[0] || 'Guru'}</span>
          </h1>
          <div style={s.subtitle}>
            {todayName}, {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div style={s.timeBox}>
          <div style={{ fontSize: 11, color: '#93c5fd', fontWeight: 800, marginBottom: 5, letterSpacing: 1 }}>
            WAKTU SEKARANG
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.8s infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 900, letterSpacing: 1 }}>
              {formatTime(now)}
            </span>
          </div>
        </div>
      </div>

      {guruData && !guruData.terverifikasi && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 24, color: '#d97706' }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#92400e' }}>Akun Belum Terverifikasi</div>
            <div style={{ fontSize: 13, color: '#a16207', marginTop: 2 }}>
              Tim admin sedang memeriksa dokumen Anda.
            </div>
          </div>
        </div>
      )}

      <div className="overview-stat-grid" style={s.statGrid}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: 20,
            padding: 22,
            border: '1px solid #E6F1FB',
            boxShadow: '0 10px 24px rgba(12,68,124,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b' }}>{card.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{card.desc}</div>
              </div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: card.bg,
                color: card.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <i className={`ti ${card.icon}`} style={{ fontSize: 22 }} />
              </div>
            </div>

            <div style={{ fontSize: 34, fontWeight: 900, color: '#042C53', lineHeight: 1 }}>
              {card.value}
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: card.accent }} />
          </div>
        ))}
      </div>

      <div style={s.sectionCard}>
        <h3 style={s.sectionTitle}>
          <i className="ti ti-list-check" style={{ color: '#185FA5', fontSize: 22 }} />
          Booking Terbaru
        </h3>
        <div style={{ ...s.sectionSub, marginBottom: 18 }}>Siswa terbaru yang melakukan booking kelas.</div>

        {recentBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentBookings.map((b, i) => {
              const st = statusStyle(b.status);
              const siswaName = b.siswa?.name || b.siswa?.nama_panggilan || 'Siswa';
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '15px 16px',
                  background: '#F8FBFF',
                  borderRadius: 14,
                  border: '1px solid #E6F1FB',
                }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: '#E6F1FB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 900,
                    color: '#185FA5',
                    flexShrink: 0,
                  }}>
                    {siswaName.substring(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#042C53', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {siswaName}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                      Paket {b.paket || '-'} · {(b.hari_dipilih || []).join(', ') || '-'}
                    </div>
                  </div>

                  <span style={{
                    fontSize: 12,
                    fontWeight: 900,
                    background: st.bg,
                    color: st.color,
                    padding: '7px 10px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '34px 0', color: '#94a3b8' }}>
            <i className="ti ti-inbox" style={{ fontSize: 38, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 15, fontWeight: 700 }}>Belum ada booking masuk</div>
          </div>
        )}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #071a2f 0%, #143b66 100%)',
        borderRadius: 22,
        padding: '26px 28px',
        color: '#fff',
        boxShadow: '0 12px 30px rgba(7,26,47,0.18)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: 20,
        }}>
          <div>
            <h3 style={{ fontSize: 21, fontWeight: 900, color: '#fff', margin: 0 }}>
              Jadwal Mengajar Minggu Ini
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '6px 0 0' }}>
              {selectedDay
                ? `Siswa terjadwal di hari ${selectedDay}`
                : (guruData?.jadwal || []).length > 0
                  ? 'Klik hari aktif untuk melihat siswa terjadwal'
                  : 'Belum ada jadwal yang ditentukan'
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {hariList.map(h => {
              const active = (guruData?.jadwal || []).includes(h);
              const isSelected = selectedDay === h;
              return (
                <button
                  key={h}
                  onClick={() => active && setSelectedDay(isSelected ? null : h)}
                  style={{
                    minWidth: 48,
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    background: isSelected ? '#4db8ff' : active ? 'rgba(77,184,255,0.18)' : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 900,
                    color: isSelected ? '#071a2f' : active ? '#dbeafe' : 'rgba(255,255,255,0.25)',
                    cursor: active ? 'pointer' : 'default',
                  }}
                >
                  {h.substring(0, 2)}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDay && selectedDayBookings.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 18 }}>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
              {selectedDayBookings.map((b, j) => {
                const jam = b.waktu_mulai?.[selectedDay] || '-';
                const siswaName = b.siswa?.name || b.siswa?.nama_panggilan || 'Siswa';
                return (
                  <div key={j} style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: '16px 18px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    minWidth: 240,
                    flexShrink: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        background: 'rgba(77,184,255,0.18)',
                        color: '#bfdbfe',
                        padding: '6px 12px',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 900,
                      }}>
                        {jam}
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                        {guruData?.harga?.menitPerSesi || 90} menit
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
                      <i className="ti ti-book" style={{ fontSize: 13, marginRight: 7, opacity: 0.7 }} />
                      {b.matpel || b.mata_pelajaran || 'Mata Pelajaran'}
                    </div>

                    <div style={{ fontSize: 14, color: '#bfdbfe', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <i className="ti ti-user" style={{ fontSize: 14 }} />
                      {siswaName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedDay && selectedDayBookings.length === 0 && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 18,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 14,
            fontWeight: 700,
          }}>
            Belum ada siswa terjadwal di hari {selectedDay}
          </div>
        )}
      </div>
    </div>
  );
}