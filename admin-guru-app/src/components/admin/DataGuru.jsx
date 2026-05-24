import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export default function DataGuru() {
  const [gurus, setGurus] = useState([]);
  const [summary, setSummary] = useState({ total: 0, aktif: 0, nonaktif: 0, avgRating: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');

  const fetchGurus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/guru', {
        params: { search: searchQuery || undefined, status: filterStatus },
      });
      setGurus(res.data.data);
      setSummary(res.data.summary);
    } catch {
      setError('Gagal memuat data guru.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(fetchGurus, 300);
    return () => clearTimeout(timer);
  }, [fetchGurus]);

  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/admin/guru/${id}/toggle-status`);
      const newStatus = res.data.status;
      setGurus(prev => prev.map(g => g.id === id ? { ...g, status: newStatus } : g));
      if (selectedGuru?.id === id) setSelectedGuru(prev => ({ ...prev, status: newStatus }));
      setSummary(prev => ({
        ...prev,
        aktif: newStatus === 'aktif' ? prev.aktif + 1 : prev.aktif - 1,
        nonaktif: newStatus === 'nonaktif' ? prev.nonaktif + 1 : prev.nonaktif - 1,
      }));
    } catch {
      alert('Gagal mengubah status guru.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Data <span style={{ color: '#185FA5' }}>Guru</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Kelola data guru yang terdaftar di platform Synau
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Guru', value: summary.total, accent: '#185FA5', icon: 'ti-users' },
          { label: 'Guru Aktif', value: summary.aktif, accent: '#16a34a', icon: 'ti-user-check' },
          { label: 'Nonaktif', value: summary.nonaktif, accent: '#dc2626', icon: 'ti-user-off' },
          { label: 'Rata-rata Rating', value: summary.avgRating, accent: '#d97706', icon: 'ti-star' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${s.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 15, color: s.accent }} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: s.accent, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
          <input type="text" placeholder="Cari nama, email, atau kota..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[{ key: 'all', label: 'Semua' }, { key: 'aktif', label: 'Aktif' }, { key: 'nonaktif', label: 'Nonaktif' }].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '8px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: filterStatus === f.key ? '#185FA5' : 'transparent',
              color: filterStatus === f.key ? '#fff' : '#64748b',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {error && <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#B91C1C', marginBottom: 16 }}>{error}</div>}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Memuat data...</div>
        ) : gurus.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
            <i className="ti ti-search-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 14 }}>Tidak ada data guru yang cocok</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Guru', 'Kota', 'Mata Pelajaran', 'Rating', 'Siswa', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gurus.map((g) => {
                const initials = g.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#185FA5', flexShrink: 0 }}>{initials}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {g.name}
                            {g.isVerified && <i className="ti ti-rosette-discount-check" style={{ fontSize: 14, color: '#185FA5' }} />}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{g.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{g.kota}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(g.mataPelajaran ?? []).slice(0, 2).map(mp => (
                          <span key={mp} style={{ background: '#EEF2FF', color: '#4338ca', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{mp}</span>
                        ))}
                        {(g.mataPelajaran ?? []).length > 2 && <span style={{ fontSize: 11, color: '#94a3b8' }}>+{g.mataPelajaran.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {g.rating > 0 ? (
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ color: '#fbbf24' }}>★</span> {g.rating}
                        </span>
                      ) : <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{g.totalSiswa}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: g.status === 'aktif' ? '#F0FDF4' : '#FEF2F2',
                        color: g.status === 'aktif' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${g.status === 'aktif' ? '#bbf7d0' : '#fecaca'}`,
                        padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                      }}>{g.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelectedGuru(g)} style={{ padding: '5px 10px', background: '#f0f7ff', color: '#185FA5', border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Detail</button>
                        <button onClick={() => handleToggleStatus(g.id)} disabled={togglingId === g.id} style={{
                          padding: '5px 10px',
                          background: g.status === 'aktif' ? 'transparent' : '#F0FDF4',
                          color: g.status === 'aktif' ? '#dc2626' : '#16a34a',
                          border: `1px solid ${g.status === 'aktif' ? '#fecaca' : '#bbf7d0'}`,
                          borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: togglingId === g.id ? 'not-allowed' : 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>{togglingId === g.id ? '...' : g.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedGuru && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setSelectedGuru(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 500, fontFamily: "'Plus Jakarta Sans', sans-serif", maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #378ADD, #185FA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', boxShadow: '0 4px 12px rgba(55,138,221,0.3)' }}>
                  {selectedGuru.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{selectedGuru.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{selectedGuru.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedGuru(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#64748b' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Kota', value: selectedGuru.kota, icon: 'ti-map-pin' },
                { label: 'Rating', value: selectedGuru.rating > 0 ? `⭐ ${selectedGuru.rating}` : '—', icon: 'ti-star' },
                { label: 'Total Siswa', value: selectedGuru.totalSiswa, icon: 'ti-users' },
                { label: 'Bergabung', value: selectedGuru.tanggalBergabung ? new Date(selectedGuru.tanggalBergabung).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-', icon: 'ti-calendar' },
              ].map(info => (
                <div key={info.label} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className={`ti ${info.icon}`} style={{ fontSize: 13 }} />{info.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{info.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Mata Pelajaran</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(selectedGuru.mataPelajaran ?? []).map(mp => (
                  <span key={mp} style={{ background: '#EEF2FF', color: '#4338ca', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{mp}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { handleToggleStatus(selectedGuru.id); setSelectedGuru(null); }} disabled={togglingId === selectedGuru.id} style={{
                flex: 1, padding: '12px',
                background: selectedGuru.status === 'aktif' ? '#FEF2F2' : '#F0FDF4',
                color: selectedGuru.status === 'aktif' ? '#dc2626' : '#16a34a',
                border: `1px solid ${selectedGuru.status === 'aktif' ? '#fecaca' : '#bbf7d0'}`,
                borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>{selectedGuru.status === 'aktif' ? 'Nonaktifkan Guru' : 'Aktifkan Guru'}</button>
              <button onClick={() => setSelectedGuru(null)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}