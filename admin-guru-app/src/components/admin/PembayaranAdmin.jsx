import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

function formatTanggal(t) {
  if (!t) return '-';
  return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRupiah(n) {
  return 'Rp ' + (n ?? 0).toLocaleString('id-ID');
}

export default function PembayaranAdmin() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/pembayaran', {
        params: searchQuery ? { search: searchQuery } : {},
      });
      setData(res.data.data);
      setSummary(res.data.summary);
    } catch {
      setError('Gagal memuat data pembayaran.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Debounce search — fetch ulang 400ms setelah ketik berhenti
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const summaryCards = [
    {
      label: 'Total Pendaftar',
      value: `${summary?.total_pendaftar ?? 0} siswa`,
      icon: 'ti-users',
      gradient: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
    },
    {
      label: 'Total Pemasukan',
      value: formatRupiah(summary?.total_pemasukan ?? 0),
      icon: 'ti-wallet',
      gradient: 'linear-gradient(135deg, #064e3b, #065f46)',
    },
    {
      label: 'Terakhir Daftar',
      value: formatTanggal(summary?.terakhir_daftar),
      icon: 'ti-calendar',
      gradient: 'linear-gradient(135deg, #1e1b4b, #3730a3)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Daftar <span style={{ color: '#185FA5' }}>Pendaftar</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Semua siswa berikut telah terdaftar dan melunasi pembayaran
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FFF1F2', border: '1px solid #fecdd3', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: '#be123c' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {summaryCards.map(card => (
          <div
            key={card.label}
            style={{ background: card.gradient, borderRadius: 14, padding: '20px 22px', color: '#fff', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: 16, opacity: 0.6 }} />
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Cari nama siswa atau guru..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#185FA5'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            Memuat data pembayaran...
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
            <i className="ti ti-users-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 14 }}>Tidak ada data ditemukan</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Siswa', 'Guru', 'Mata Pelajaran', 'Nominal', 'Tanggal Daftar'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.siswa}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{p.guru}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.mata_pelajaran}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.paket}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{formatRupiah(p.nominal)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{formatTanggal(p.tanggal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}