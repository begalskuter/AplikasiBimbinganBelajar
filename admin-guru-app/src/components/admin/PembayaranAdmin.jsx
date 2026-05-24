import { useState } from 'react';

const mockPembayaran = [
  { id: 1, siswa: 'Budi Santoso', guru: 'Dewi Puspitasari', paket: 'Bulanan', mataPelajaran: 'Matematika SMP', nominal: 500000, tanggal: '2026-05-20', status: 'lunas' },
  { id: 2, siswa: 'Siti Aminah', guru: 'Ahmad Ridwan', paket: 'Mingguan', mataPelajaran: 'Fisika SMA', nominal: 150000, tanggal: '2026-05-19', status: 'pending' },
  { id: 3, siswa: 'Andi Maulana', guru: 'Siti Nurhaliza', paket: 'Bulanan', mataPelajaran: 'Kimia SMA', nominal: 500000, tanggal: '2026-05-18', status: 'lunas' },
  { id: 4, siswa: 'Rina Putri', guru: 'Budi Kurniawan', paket: 'Mingguan', mataPelajaran: 'B. Inggris SMA', nominal: 150000, tanggal: '2026-05-17', status: 'tunggakan' },
  { id: 5, siswa: 'Dimas Prasetyo', guru: 'Dewi Puspitasari', paket: 'Bulanan', mataPelajaran: 'Matematika SMA', nominal: 500000, tanggal: '2026-05-16', status: 'pending' },
  { id: 6, siswa: 'Lina Marlina', guru: 'Hendra Wijaya', paket: 'Mingguan', mataPelajaran: 'Matematika SMP', nominal: 150000, tanggal: '2026-05-15', status: 'lunas' },
  { id: 7, siswa: 'Nadia Kartika', guru: 'Ahmad Ridwan', paket: 'Bulanan', mataPelajaran: 'Fisika SMA', nominal: 500000, tanggal: '2026-05-14', status: 'tunggakan' },
  { id: 8, siswa: 'Wulan Sari', guru: 'Dewi Puspitasari', paket: 'Bulanan', mataPelajaran: 'Matematika SMP', nominal: 500000, tanggal: '2026-05-12', status: 'lunas' },
  { id: 9, siswa: 'Farhan Aziz', guru: 'Siti Nurhaliza', paket: 'Mingguan', mataPelajaran: 'Kimia SMA', nominal: 150000, tanggal: '2026-05-10', status: 'pending' },
  { id: 10, siswa: 'Rizki Aditya', guru: 'Budi Kurniawan', paket: 'Bulanan', mataPelajaran: 'B. Inggris SMP', nominal: 500000, tanggal: '2026-05-08', status: 'lunas' },
];

export default function PembayaranAdmin() {
  const [pembayaran, setPembayaran] = useState(mockPembayaran);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = pembayaran.filter(p => {
    const matchSearch = p.siswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.guru.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalPendapatan = pembayaran.reduce((s, p) => s + p.nominal, 0);
  const totalLunas = pembayaran.filter(p => p.status === 'lunas').reduce((s, p) => s + p.nominal, 0);
  const totalPending = pembayaran.filter(p => p.status === 'pending').reduce((s, p) => s + p.nominal, 0);
  const totalTunggakan = pembayaran.filter(p => p.status === 'tunggakan').reduce((s, p) => s + p.nominal, 0);

  const handleKonfirmasi = (id) => {
    setPembayaran(pembayaran.map(p => p.id === id ? { ...p, status: 'lunas' } : p));
  };

  const statusConfig = {
    lunas: { bg: '#F0FDF4', color: '#16a34a', border: '#bbf7d0', label: 'Lunas' },
    pending: { bg: '#FFFBEB', color: '#d97706', border: '#fde68a', label: 'Pending' },
    tunggakan: { bg: '#FEF2F2', color: '#dc2626', border: '#fecaca', label: 'Tunggakan' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Monitoring <span style={{ color: '#185FA5' }}>Pembayaran</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Pantau dan verifikasi pembayaran siswa
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Total Transaksi', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, sub: `${pembayaran.length} transaksi`, gradient: 'linear-gradient(135deg, #0f172a, #1e3a5f)', color: '#fff', icon: 'ti-wallet' },
          { label: 'Sudah Lunas', value: `Rp ${totalLunas.toLocaleString('id-ID')}`, sub: `${pembayaran.filter(p => p.status === 'lunas').length} transaksi`, gradient: 'linear-gradient(135deg, #064e3b, #065f46)', color: '#fff', icon: 'ti-circle-check' },
          { label: 'Pending', value: `Rp ${totalPending.toLocaleString('id-ID')}`, sub: `${pembayaran.filter(p => p.status === 'pending').length} transaksi`, gradient: 'linear-gradient(135deg, #78350f, #92400e)', color: '#fff', icon: 'ti-clock' },
          { label: 'Tunggakan', value: `Rp ${totalTunggakan.toLocaleString('id-ID')}`, sub: `${pembayaran.filter(p => p.status === 'tunggakan').length} transaksi`, gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)', color: '#fff', icon: 'ti-alert-triangle' },
        ].map(card => (
          <div key={card.label} style={{
            background: card.gradient, borderRadius: 14,
            padding: '20px 22px', color: card.color, position: 'relative', overflow: 'hidden',
            transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: 16, opacity: 0.6 }} />
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.6 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{card.value}</div>
            <div style={{ fontSize: 11, opacity: 0.4, fontWeight: 500 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
          <input type="text" placeholder="Cari nama siswa atau guru..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e2e8f0',
              borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
              outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#185FA5'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[{ key: 'all', label: 'Semua' }, { key: 'lunas', label: 'Lunas' }, { key: 'pending', label: 'Pending' }, { key: 'tunggakan', label: 'Tunggakan' }].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '8px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: filterStatus === f.key ? '#185FA5' : 'transparent',
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
            <div style={{ fontSize: 14 }}>Tidak ada data pembayaran</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Siswa', 'Guru', 'Paket', 'Nominal', 'Tanggal', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const sc = statusConfig[p.status] || statusConfig.pending;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.siswa}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{p.guru}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{p.paket}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.mataPelajaran}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      Rp {p.nominal.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                      {new Date(p.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
                      }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.status !== 'lunas' && (
                        <button onClick={() => handleKonfirmasi(p.id)} style={{
                          padding: '5px 12px', background: '#16a34a', color: '#fff', border: 'none',
                          borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.15s',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                        >Konfirmasi</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
