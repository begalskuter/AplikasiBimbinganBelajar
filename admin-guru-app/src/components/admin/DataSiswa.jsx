import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const formatRp = (n) => `Rp ${(n ?? 0).toLocaleString('id-ID')}`;

export default function DataSiswa() {
  const [siswaList, setSiswaList] = useState([]);
  const [summary, setSummary] = useState({ total: 0, aktif: 0, totalBooking: 0, totalBayar: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');

  const fetchSiswa = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/siswa', {
        params: { search: searchQuery || undefined, status: filterStatus },
      });
      setSiswaList(res.data.data);
      setSummary(res.data.summary);
    } catch {
      setError('Gagal memuat data siswa.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchSiswa, 300);
    return () => clearTimeout(timer);
  }, [fetchSiswa]);

  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/admin/siswa/${id}/toggle-status`);
      const newStatus = res.data.status;
      setSiswaList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      if (selectedSiswa?.id === id) setSelectedSiswa(prev => ({ ...prev, status: newStatus }));
      setSummary(prev => ({
        ...prev,
        aktif: newStatus === 'aktif' ? prev.aktif + 1 : prev.aktif - 1,
      }));
    } catch {
      alert('Gagal mengubah status siswa.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
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
          { label: 'Total Siswa', value: summary.total, accent: '#7c3aed', icon: 'ti-school' },
          { label: 'Siswa Aktif', value: summary.aktif, accent: '#16a34a', icon: 'ti-user-check' },
          { label: 'Total Booking', value: summary.totalBooking, accent: '#185FA5', icon: 'ti-calendar-event' },
          { label: 'Total Pendapatan', value: `Rp ${((summary.totalBayar ?? 0) / 1000000).toFixed(1)}jt`, accent: '#d97706', icon: 'ti-coin' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px', position: 'relative', overflow: 'hidden' }}>
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
            style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[{ key: 'all', label: 'Semua' }, { key: 'aktif', label: 'Aktif' }, { key: 'nonaktif', label: 'Nonaktif' }].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '8px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: filterStatus === f.key ? '#7c3aed' : 'transparent',
              color: filterStatus === f.key ? '#fff' : '#64748b',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#B91C1C', marginBottom: 16 }}>{error}</div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Memuat data...</div>
        ) : siswaList.length === 0 ? (
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
              {siswaList.map((s) => {
                const initials = s.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#7c3aed', flexShrink: 0 }}>{initials}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{s.kota}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                      {s.tanggalDaftar ? new Date(s.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{s.totalBooking}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{formatRp(s.totalBayar)}</td>
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
                        border: '1px solid #e9d5ff', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelectedSiswa(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                  {selectedSiswa.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{selectedSiswa.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{selectedSiswa.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedSiswa(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#64748b' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Kota', value: selectedSiswa.kota, icon: 'ti-map-pin' },
                { label: 'Tgl Daftar', value: selectedSiswa.tanggalDaftar ? new Date(selectedSiswa.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-', icon: 'ti-calendar' },
                { label: 'Total Booking', value: selectedSiswa.totalBooking, icon: 'ti-calendar-event' },
                { label: 'Guru Favorit', value: selectedSiswa.guruFavorit, icon: 'ti-heart' },
                { label: 'Total Bayar', value: formatRp(selectedSiswa.totalBayar), icon: 'ti-coin' },
                { label: 'Status', value: selectedSiswa.status === 'aktif' ? '✅ Aktif' : '❌ Nonaktif', icon: 'ti-info-circle' },
              ].map(info => (
                <div key={info.label} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className={`ti ${info.icon}`} style={{ fontSize: 12 }} />{info.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 3 }}>{info.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedSiswa(null)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Tutup</button>
              <button
                onClick={() => handleToggleStatus(selectedSiswa.id)}
                disabled={togglingId === selectedSiswa.id}
                style={{
                  flex: 1, padding: '12px',
                  background: selectedSiswa.status === 'aktif' ? '#FEF2F2' : '#F0FDF4',
                  color: selectedSiswa.status === 'aktif' ? '#dc2626' : '#16a34a',
                  border: `1px solid ${selectedSiswa.status === 'aktif' ? '#fecaca' : '#bbf7d0'}`,
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: togglingId === selectedSiswa.id ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}
              >
                {togglingId === selectedSiswa.id ? 'Memproses...' : selectedSiswa.status === 'aktif' ? 'Nonaktifkan Siswa' : 'Aktifkan Siswa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}