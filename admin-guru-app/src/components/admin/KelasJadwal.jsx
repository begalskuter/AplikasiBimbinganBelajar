import { useState } from 'react';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const mockKelas = [
  { id: 1, guru: 'Dewi Puspitasari', siswa: 'Budi Santoso', mataPelajaran: 'Matematika SMP', hari: ['Senin', 'Kamis'], waktu: '14:00', paket: 'Bulanan', status: 'aktif' },
  { id: 2, guru: 'Ahmad Ridwan', siswa: 'Siti Aminah', mataPelajaran: 'Fisika SMA', hari: ['Selasa'], waktu: '09:00', paket: 'Mingguan', status: 'aktif' },
  { id: 3, guru: 'Siti Nurhaliza', siswa: 'Andi Maulana', mataPelajaran: 'Kimia SMA', hari: ['Rabu', 'Sabtu'], waktu: '16:00', paket: 'Bulanan', status: 'aktif' },
  { id: 4, guru: 'Budi Kurniawan', siswa: 'Rina Putri', mataPelajaran: 'B. Inggris SMA', hari: ['Jumat'], waktu: '10:00', paket: 'Mingguan', status: 'selesai' },
  { id: 5, guru: 'Dewi Puspitasari', siswa: 'Dimas Prasetyo', mataPelajaran: 'Matematika SMA', hari: ['Selasa', 'Jumat'], waktu: '16:00', paket: 'Bulanan', status: 'aktif' },
  { id: 6, guru: 'Hendra Wijaya', siswa: 'Lina Marlina', mataPelajaran: 'Matematika SMP', hari: ['Senin'], waktu: '09:00', paket: 'Mingguan', status: 'aktif' },
];

const mockJadwalPending = [
  { id: 1, guru: 'Maya Anggraeni', mataPelajaran: 'Biologi SMA', hariDiajukan: ['Senin', 'Rabu'], waktu: '14:00 - 15:30', tanggalAjuan: '2026-05-22', status: 'pending' },
  { id: 2, guru: 'Fajar Setiawan', mataPelajaran: 'Sejarah SMA', hariDiajukan: ['Kamis'], waktu: '10:00 - 11:30', tanggalAjuan: '2026-05-21', status: 'pending' },
  { id: 3, guru: 'Hendra Wijaya', mataPelajaran: 'Matematika SMP', hariDiajukan: ['Sabtu'], waktu: '08:00 - 09:30', tanggalAjuan: '2026-05-20', status: 'pending' },
];

export default function KelasJadwal() {
  const [activeTab, setActiveTab] = useState('kelas');
  const [kelas] = useState(mockKelas);
  const [jadwalPending, setJadwalPending] = useState(mockJadwalPending);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleApproveJadwal = (id) => {
    setJadwalPending(jadwalPending.map(j => j.id === id ? { ...j, status: 'approved' } : j));
  };

  const handleRejectJadwal = (id) => {
    setJadwalPending(jadwalPending.map(j => j.id === id ? { ...j, status: 'rejected' } : j));
  };

  const kelasOnDay = selectedDay ? kelas.filter(k => k.hari.includes(selectedDay) && k.status === 'aktif') : [];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Kelas & <span style={{ color: '#185FA5' }}>Jadwal</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Kelola kelas aktif dan setujui jadwal yang diajukan guru
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Kelas Aktif', value: kelas.filter(k => k.status === 'aktif').length, accent: '#16a34a', icon: 'ti-book' },
          { label: 'Kelas Selesai', value: kelas.filter(k => k.status === 'selesai').length, accent: '#64748b', icon: 'ti-check' },
          { label: 'Jadwal Menunggu', value: jadwalPending.filter(j => j.status === 'pending').length, accent: '#d97706', icon: 'ti-clock' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: '18px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 18, color: s.accent }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3, marginBottom: 18, width: 'fit-content' }}>
        {[{ key: 'kelas', label: 'Daftar Kelas' }, { key: 'jadwal', label: 'Persetujuan Jadwal' }, { key: 'calendar', label: 'Kalender' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '9px 18px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: activeTab === t.key ? '#185FA5' : 'transparent',
            color: activeTab === t.key ? '#fff' : '#64748b', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Daftar Kelas */}
      {activeTab === 'kelas' && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Guru', 'Siswa', 'Mata Pelajaran', 'Hari', 'Waktu', 'Paket', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kelas.map((k) => (
                <tr key={k.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{k.guru}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{k.siswa}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#EEF2FF', color: '#4338ca', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{k.mataPelajaran}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {k.hari.map(h => (
                        <span key={h} style={{ background: '#f0f7ff', color: '#185FA5', padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{h.substring(0, 3)}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{k.waktu}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{k.paket}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: k.status === 'aktif' ? '#F0FDF4' : '#f8fafc',
                      color: k.status === 'aktif' ? '#16a34a' : '#94a3b8',
                      border: `1px solid ${k.status === 'aktif' ? '#bbf7d0' : '#e2e8f0'}`,
                      padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                    }}>{k.status === 'aktif' ? 'Aktif' : 'Selesai'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: Persetujuan Jadwal */}
      {activeTab === 'jadwal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jadwalPending.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
              <i className="ti ti-calendar-check" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
              <div style={{ fontSize: 14 }}>Tidak ada jadwal yang menunggu persetujuan</div>
            </div>
          ) : jadwalPending.map(j => (
            <div key={j.id} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18,
              transition: 'all 0.2s',
              opacity: j.status !== 'pending' ? 0.6 : 1,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: j.status === 'approved' ? '#F0FDF4' : j.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={`ti ${j.status === 'approved' ? 'ti-check' : j.status === 'rejected' ? 'ti-x' : 'ti-clock'}`}
                  style={{ fontSize: 22, color: j.status === 'approved' ? '#16a34a' : j.status === 'rejected' ? '#dc2626' : '#d97706' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{j.guru}</div>
                <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-book" style={{ fontSize: 13 }} /> {j.mataPelajaran}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-calendar" style={{ fontSize: 13 }} /> {j.hariDiajukan.join(', ')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="ti ti-clock" style={{ fontSize: 13 }} /> {j.waktu}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Diajukan: {new Date(j.tanggalAjuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              {j.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleApproveJadwal(j.id)} style={{
                    padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none',
                    borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                  >
                    <i className="ti ti-check" style={{ fontSize: 14 }} /> Setujui
                  </button>
                  <button onClick={() => handleRejectJadwal(j.id)} style={{
                    padding: '8px 16px', background: '#fff', color: '#dc2626',
                    border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >Tolak</button>
                </div>
              ) : (
                <span style={{
                  background: j.status === 'approved' ? '#F0FDF4' : '#FEF2F2',
                  color: j.status === 'approved' ? '#16a34a' : '#dc2626',
                  padding: '4px 12px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                  border: `1px solid ${j.status === 'approved' ? '#bbf7d0' : '#fecaca'}`,
                }}>{j.status === 'approved' ? 'Disetujui' : 'Ditolak'}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB: Calendar */}
      {activeTab === 'calendar' && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
          borderRadius: 16, padding: '22px 26px', color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: selectedDay && kelasOnDay.length > 0 ? 18 : 0 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 3 }}>Kalender Kelas Mingguan</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                {selectedDay ? `Kelas aktif di hari ${selectedDay}` : 'Klik hari untuk melihat kelas'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {hariList.map(h => {
                const count = kelas.filter(k => k.hari.includes(h) && k.status === 'aktif').length;
                const isSelected = selectedDay === h;
                return (
                  <button key={h} onClick={() => setSelectedDay(isSelected ? null : h)} style={{
                    width: 52, height: 52, borderRadius: 12, border: 'none',
                    background: isSelected ? '#4db8ff' : count > 0 ? 'rgba(77,184,255,0.18)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 2, cursor: 'pointer', transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isSelected ? '0 4px 14px rgba(77,184,255,0.35)' : 'none',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#0f172a' : count > 0 ? '#93c5fd' : 'rgba(255,255,255,0.15)' }}>{h.substring(0, 3)}</span>
                    {count > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: isSelected ? '#0f172a' : '#4db8ff' }}>{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDay && kelasOnDay.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
                {kelasOnDay.map((k) => (
                  <div key={k.id} style={{
                    background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px',
                    border: '1px solid rgba(255,255,255,0.06)', minWidth: 220, flexShrink: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ background: 'rgba(77,184,255,0.18)', color: '#93c5fd', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{k.waktu}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{k.guru}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                      <i className="ti ti-user" style={{ fontSize: 11, marginRight: 4 }} />{k.siswa}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                      <i className="ti ti-book" style={{ fontSize: 11, marginRight: 4 }} />{k.mataPelajaran}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDay && kelasOnDay.length === 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              Tidak ada kelas aktif di hari {selectedDay}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
