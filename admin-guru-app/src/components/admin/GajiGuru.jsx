import { useState } from 'react';

const mockGaji = [
  { id: 1, guru: 'Dewi Puspitasari, S.Pd', periode: 'Mei 2026', sesi: 18, tarif: 150000, kotor: 2700000, potongan: 270000, bersih: 2430000, status: 'belum' },
  { id: 2, guru: 'Ahmad Ridwan, M.Pd', periode: 'Mei 2026', sesi: 12, tarif: 200000, kotor: 2400000, potongan: 240000, bersih: 2160000, status: 'sudah' },
  { id: 3, guru: 'Siti Nurhaliza, S.Si', periode: 'Mei 2026', sesi: 20, tarif: 150000, kotor: 3000000, potongan: 300000, bersih: 2700000, status: 'belum' },
  { id: 4, guru: 'Budi Kurniawan, S.Pd', periode: 'Mei 2026', sesi: 15, tarif: 150000, kotor: 2250000, potongan: 225000, bersih: 2025000, status: 'belum' },
  { id: 5, guru: 'Rina Putri, M.Pd', periode: 'Mei 2026', sesi: 8, tarif: 200000, kotor: 1600000, potongan: 160000, bersih: 1440000, status: 'sudah' },
  { id: 6, guru: 'Hendra Wijaya, S.Pd', periode: 'Mei 2026', sesi: 24, tarif: 150000, kotor: 3600000, potongan: 360000, bersih: 3240000, status: 'belum' },
];

export default function GajiGuru() {
  const [gaji, setGaji] = useState(mockGaji);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmAction, setConfirmAction] = useState(null);

  const filtered = gaji.filter(g => {
    const matchSearch = g.guru.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || g.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalSesi = gaji.reduce((s, g) => s + g.sesi, 0);
  const totalGajiKotor = gaji.reduce((s, g) => s + g.kotor, 0);
  const totalPotongan = gaji.reduce((s, g) => s + g.potongan, 0);
  const totalGajiBersih = gaji.reduce((s, g) => s + g.bersih, 0);
  const totalBelumDibayar = gaji.filter(g => g.status === 'belum').reduce((s, g) => s + g.bersih, 0);

  const handleBayar = (id) => {
    setGaji(gaji.map(g => g.id === id ? { ...g, status: 'sudah' } : g));
    setConfirmAction(null);
  };

  const statusConfig = {
    belum: { bg: '#FFFBEB', color: '#d97706', border: '#fde68a', label: 'Belum Dibayar' },
    sudah: { bg: '#F0FDF4', color: '#16a34a', border: '#bbf7d0', label: 'Sudah Dibayar' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Gaji <span style={{ color: '#ea580c' }}>Guru</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Perhitungan dan pembayaran gaji guru (Potongan platform 10%)
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Sesi', value: totalSesi, icon: 'ti-calendar-event', color: '#185FA5' },
          { label: 'Total Gaji Kotor', value: `Rp ${(totalGajiKotor / 1000000).toFixed(1)}jt`, icon: 'ti-wallet', color: '#0f172a' },
          { label: 'Potongan (10%)', value: `Rp ${(totalPotongan / 1000000).toFixed(1)}jt`, icon: 'ti-cut', color: '#7c3aed' },
          { label: 'Gaji Bersih', value: `Rp ${(totalGajiBersih / 1000000).toFixed(1)}jt`, icon: 'ti-coin', color: '#16a34a' },
        ].map((s, i) => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
            padding: '18px', display: 'flex', alignItems: 'center', gap: 14,
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

      {/* Alert */}
      <div style={{
        background: '#FFF7ED', border: '1px solid #fed7aa', borderRadius: 12, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="ti ti-alert-circle" style={{ color: '#fff', fontSize: 18 }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#9a3412', marginBottom: 2 }}>Pembayaran Tertunda</div>
          <div style={{ fontSize: 13, color: '#c2410c' }}>
            Terdapat tagihan gaji guru sebesar <strong>Rp {totalBelumDibayar.toLocaleString('id-ID')}</strong> yang belum dibayarkan.
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
          <input type="text" placeholder="Cari nama guru..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0',
              borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
              outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#ea580c'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[{ key: 'all', label: 'Semua' }, { key: 'belum', label: 'Belum Dibayar' }, { key: 'sudah', label: 'Sudah Dibayar' }].map(f => (
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
            <div style={{ fontSize: 14 }}>Tidak ada data gaji</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Guru / Periode', 'Sesi', 'Tarif', 'Gaji Kotor', 'Potongan (10%)', 'Gaji Bersih', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const sc = statusConfig[g.status];
                return (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{g.guru}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{g.periode}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{g.sesi}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>Rp {g.tarif.toLocaleString('id-ID')}</td>
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
                        <button onClick={() => setConfirmAction(g.id)} style={{
                          padding: '5px 12px', background: '#ea580c', color: '#fff', border: 'none',
                          borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.15s',
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

      {/* Confirmation Modal */}
      {confirmAction && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setConfirmAction(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400,
            fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FFF7ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 28, color: '#ea580c',
            }}>
              <i className="ti ti-cash" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Konfirmasi Pembayaran</h3>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Tandai gaji <strong>{gaji.find(g => g.id === confirmAction)?.guru}</strong> sebesar <strong>Rp {gaji.find(g => g.id === confirmAction)?.bersih.toLocaleString('id-ID')}</strong> sudah dibayar?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmAction(null)} style={{
                flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Batal</button>
              <button onClick={() => handleBayar(confirmAction)} style={{
                flex: 1, padding: '12px', background: '#ea580c', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c2410c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
              >Ya, Sudah Dibayar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
