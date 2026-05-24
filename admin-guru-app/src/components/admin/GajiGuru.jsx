import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const POTONGAN_PLATFORM = 10; // persen

export default function GajiGuru() {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [gaji, setGaji] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmAction, setConfirmAction] = useState(null); // { guru_id, nama, bersih }
  const [paying, setPaying] = useState(false);

  const fetchGaji = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/gaji', { params: { bulan, tahun } });
      setGaji(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      setError('Gagal memuat data gaji. Pastikan kamu sudah login sebagai admin.');
    } finally {
      setLoading(false);
    }
  }, [bulan, tahun]);

  useEffect(() => { fetchGaji(); }, [fetchGaji]);

  const handleBayar = async () => {
    if (!confirmAction) return;
    setPaying(true);
    try {
      await api.post('/admin/gaji/bayar', {
        guru_id: confirmAction.guru_id,
        bulan,
        tahun,
      });
      setConfirmAction(null);
      await fetchGaji(); // refresh data
    } catch {
      alert('Gagal menandai pembayaran. Coba lagi.');
    } finally {
      setPaying(false);
    }
  };

  const filtered = gaji.filter(g => {
    const matchSearch = g.guru.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || g.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const statusConfig = {
    belum: { bg: '#FFFBEB', color: '#d97706', border: '#fde68a', label: 'Belum Dibayar' },
    sudah: { bg: '#F0FDF4', color: '#16a34a', border: '#bbf7d0', label: 'Sudah Dibayar' },
  };

  const bulanOptions = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
            Gaji <span style={{ color: '#ea580c' }}>Guru</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            Perhitungan dan pembayaran gaji guru (Potongan platform {POTONGAN_PLATFORM}%)
          </p>
        </div>

        {/* Period Picker */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={bulan}
            onChange={(e) => setBulan(Number(e.target.value))}
            style={{
              padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
              outline: 'none', cursor: 'pointer', background: '#fff',
            }}
          >
            {bulanOptions.map((b, i) => (
              <option key={i + 1} value={i + 1}>{b}</option>
            ))}
          </select>
          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            style={{
              padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
              fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
              outline: 'none', cursor: 'pointer', background: '#fff',
            }}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={fetchGaji}
            style={{
              padding: '8px 14px', background: '#ea580c', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Tampilkan
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#FFF1F2', border: '1px solid #fecdd3', borderRadius: 12,
          padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#be123c',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          Memuat data gaji...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
            {[
              { label: 'Total Sesi', value: summary?.total_sesi ?? 0, icon: 'ti-calendar-event', color: '#185FA5' },
              { label: 'Total Gaji Kotor', value: `Rp ${((summary?.total_kotor ?? 0) / 1_000_000).toFixed(1)}jt`, icon: 'ti-wallet', color: '#0f172a' },
              { label: `Potongan (${POTONGAN_PLATFORM}%)`, value: `Rp ${((summary?.total_potongan ?? 0) / 1_000_000).toFixed(1)}jt`, icon: 'ti-cut', color: '#7c3aed' },
              { label: 'Gaji Bersih', value: `Rp ${((summary?.total_bersih ?? 0) / 1_000_000).toFixed(1)}jt`, icon: 'ti-coin', color: '#16a34a' },
            ].map((s) => (
              <div key={s.label} style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
                padding: 18, display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`ti ${s.icon}`} style={{ fontSize: 18, color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Alert belum dibayar */}
          {(summary?.total_belum ?? 0) > 0 && (
            <div style={{
              background: '#FFF7ED', border: '1px solid #fed7aa', borderRadius: 12,
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-alert-circle" style={{ color: '#fff', fontSize: 18 }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#9a3412', marginBottom: 2 }}>Pembayaran Tertunda</div>
                <div style={{ fontSize: 13, color: '#c2410c' }}>
                  Terdapat tagihan gaji guru sebesar{' '}
                  <strong>Rp {(summary.total_belum).toLocaleString('id-ID')}</strong> yang belum dibayarkan.
                </div>
              </div>
            </div>
          )}

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Cari nama guru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0',
                  borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
              {[
                { key: 'all', label: 'Semua' },
                { key: 'belum', label: 'Belum Dibayar' },
                { key: 'sudah', label: 'Sudah Dibayar' },
              ].map(f => (
                <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
                  padding: '8px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  background: filterStatus === f.key ? '#ea580c' : 'transparent',
                  color: filterStatus === f.key ? '#fff' : '#64748b', transition: 'all 0.2s',
                }}>{f.label}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
                <i className="ti ti-receipt-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
                <div style={{ fontSize: 14 }}>Tidak ada data gaji untuk periode ini</div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Guru / Periode', 'Sesi', 'Gaji Kotor', `Potongan (${POTONGAN_PLATFORM}%)`, 'Gaji Bersih', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => {
                    const sc = statusConfig[g.status] ?? statusConfig.belum;
                    return (
                      <tr key={g.guru_id}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{g.guru}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{g.periode}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{g.sesi}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>Rp {g.kotor.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#dc2626', fontWeight: 600 }}>- Rp {g.potongan.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#16a34a' }}>Rp {g.bersih.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                            padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                          }}>{sc.label}</span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {g.status === 'belum' && (
                            <button
                              onClick={() => setConfirmAction({ guru_id: g.guru_id, nama: g.guru, bersih: g.bersih })}
                              style={{
                                padding: '5px 12px', background: '#ea580c', color: '#fff', border: 'none',
                                borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#c2410c'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
                            >Bayar</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => !paying && setConfirmAction(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400,
            fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, color: '#ea580c' }}>
              <i className="ti ti-cash" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Konfirmasi Pembayaran</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Tandai gaji <strong>{confirmAction.nama}</strong> sebesar{' '}
              <strong>Rp {confirmAction.bersih.toLocaleString('id-ID')}</strong> sudah dibayar?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={paying}
                style={{ flex: 1, padding: 12, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >Batal</button>
              <button
                onClick={handleBayar}
                disabled={paying}
                style={{ flex: 1, padding: 12, background: paying ? '#ccc' : '#ea580c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: paying ? 'default' : 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={(e) => !paying && (e.currentTarget.style.background = '#c2410c')}
                onMouseLeave={(e) => !paying && (e.currentTarget.style.background = '#ea580c')}
              >
                {paying ? 'Memproses...' : 'Ya, Sudah Dibayar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}