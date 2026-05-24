import { useState } from 'react';

const initialMockSiswa = [
  { id: 1, name: 'Budi Santoso', email: 'budi@email.com', kota: 'Yogyakarta', tanggalDaftar: '2026-02-10', totalBooking: 5, guruFavorit: 3, totalBayar: 2150000, status: 'aktif' },
  { id: 2, name: 'Siti Aminah', email: 'siti.a@email.com', kota: 'Semarang', tanggalDaftar: '2026-02-15', totalBooking: 3, guruFavorit: 2, totalBayar: 1500000, status: 'aktif' },
  { id: 3, name: 'Andi Maulana', email: 'andi.m@email.com', kota: 'Jakarta', tanggalDaftar: '2026-03-01', totalBooking: 8, guruFavorit: 5, totalBayar: 4200000, status: 'aktif' },
  { id: 4, name: 'Rina Putri', email: 'rina.p@email.com', kota: 'Bandung', tanggalDaftar: '2026-03-12', totalBooking: 2, guruFavorit: 1, totalBayar: 1000000, status: 'aktif' },
  { id: 5, name: 'Dimas Prasetyo', email: 'dimas.p@email.com', kota: 'Surabaya', tanggalDaftar: '2026-03-20', totalBooking: 4, guruFavorit: 2, totalBayar: 2000000, status: 'aktif' },
  { id: 6, name: 'Lina Marlina', email: 'lina.m@email.com', kota: 'Magelang', tanggalDaftar: '2026-04-01', totalBooking: 6, guruFavorit: 4, totalBayar: 3000000, status: 'aktif' },
  { id: 7, name: 'Farhan Aziz', email: 'farhan.a@email.com', kota: 'Solo', tanggalDaftar: '2026-04-15', totalBooking: 1, guruFavorit: 1, totalBayar: 500000, status: 'nonaktif' },
  { id: 8, name: 'Nadia Kartika', email: 'nadia.k@email.com', kota: 'Purwokerto', tanggalDaftar: '2026-04-28', totalBooking: 7, guruFavorit: 3, totalBayar: 3650000, status: 'aktif' },
  { id: 9, name: 'Rizki Aditya', email: 'rizki.a@email.com', kota: 'Yogyakarta', tanggalDaftar: '2026-05-05', totalBooking: 0, guruFavorit: 0, totalBayar: 0, status: 'aktif' },
  { id: 10, name: 'Wulan Sari', email: 'wulan.s@email.com', kota: 'Jakarta', tanggalDaftar: '2026-05-10', totalBooking: 3, guruFavorit: 2, totalBayar: 1500000, status: 'aktif' },
];

export default function DataSiswa() {
  const [siswaList, setSiswaList] = useState(initialMockSiswa);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const handleToggleStatus = (id) => {
    setSiswaList(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'aktif' ? 'nonaktif' : 'aktif';
        if (selectedSiswa && selectedSiswa.id === id) {
          setSelectedSiswa({ ...s, status: newStatus });
        }
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const filtered = siswaList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kota.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalBayarAll = siswaList.reduce((s, v) => s + v.totalBayar, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Data <span style={{ color: '#7c3aed' }}>Siswa</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Kelola data siswa yang terdaftar di platform Synau
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Siswa', value: siswaList.length, accent: '#7c3aed', icon: 'ti-school' },
          { label: 'Siswa Aktif', value: siswaList.filter(s => s.status === 'aktif').length, accent: '#16a34a', icon: 'ti-user-check' },
          { label: 'Total Booking', value: siswaList.reduce((s, v) => s + v.totalBooking, 0), accent: '#185FA5', icon: 'ti-calendar-event' },
          { label: 'Total Pendapatan', value: `Rp ${(totalBayarAll / 1000000).toFixed(1)}jt`, accent: '#d97706', icon: 'ti-coin' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: '18px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 15, color: s.accent }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: s.accent, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
          <input type="text" placeholder="Cari nama, email, atau kota siswa..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0',
              borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
              outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[{ key: 'all', label: 'Semua' }, { key: 'aktif', label: 'Aktif' }, { key: 'nonaktif', label: 'Nonaktif' }].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '8px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: filterStatus === f.key ? '#7c3aed' : 'transparent',
              color: filterStatus === f.key ? '#fff' : '#64748b', transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
            <i className="ti ti-search-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 14 }}>Tidak ada data siswa yang cocok</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Siswa', 'Kota', 'Tgl Daftar', 'Booking', 'Total Bayar', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const initials = s.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8, background: '#F5F3FF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: '#7c3aed', flexShrink: 0,
                        }}>{initials}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{s.kota}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                      {new Date(s.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{s.totalBooking}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      Rp {s.totalBayar.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: s.status === 'aktif' ? '#F0FDF4' : '#FEF2F2',
                        color: s.status === 'aktif' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${s.status === 'aktif' ? '#bbf7d0' : '#fecaca'}`,
                        padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                      }}>{s.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setSelectedSiswa(s)} style={{
                        padding: '5px 10px', background: '#F5F3FF', color: '#7c3aed',
                        border: '1px solid #e9d5ff', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>Detail</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSiswa && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setSelectedSiswa(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#fff',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                }}>
                  {selectedSiswa.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{selectedSiswa.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{selectedSiswa.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedSiswa(null)} style={{
                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16, color: '#64748b',
              }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Kota', value: selectedSiswa.kota, icon: 'ti-map-pin' },
                { label: 'Tgl Daftar', value: new Date(selectedSiswa.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), icon: 'ti-calendar' },
                { label: 'Total Booking', value: selectedSiswa.totalBooking, icon: 'ti-calendar-event' },
                { label: 'Guru Favorit', value: selectedSiswa.guruFavorit, icon: 'ti-heart' },
                { label: 'Total Bayar', value: `Rp ${selectedSiswa.totalBayar.toLocaleString('id-ID')}`, icon: 'ti-coin' },
                { label: 'Status', value: selectedSiswa.status === 'aktif' ? '✅ Aktif' : '❌ Nonaktif', icon: 'ti-info-circle' },
              ].map(info => (
                <div key={info.label} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className={`ti ${info.icon}`} style={{ fontSize: 12 }} />
                    {info.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 3 }}>{info.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedSiswa(null)} style={{
                flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s'
              }}>Tutup</button>
              <button 
                onClick={() => handleToggleStatus(selectedSiswa.id)} 
                style={{
                  flex: 1, padding: '12px', 
                  background: selectedSiswa.status === 'aktif' ? '#FEF2F2' : '#F0FDF4', 
                  color: selectedSiswa.status === 'aktif' ? '#dc2626' : '#16a34a',
                  border: `1px solid ${selectedSiswa.status === 'aktif' ? '#fecaca' : '#bbf7d0'}`, 
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                }}
              >
                {selectedSiswa.status === 'aktif' ? 'Nonaktifkan Siswa' : 'Aktifkan Siswa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
