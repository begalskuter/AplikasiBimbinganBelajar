export default function LaporanAdmin() {
  const summaryStats = [
    { label: 'Total Pendapatan', value: 'Rp 42.500.000', growth: '+12%', isPositive: true },
    { label: 'Pendaftaran Guru', value: '45', growth: '+8%', isPositive: true },
    { label: 'Siswa Baru', value: '128', growth: '+15%', isPositive: true },
    { label: 'Tingkat Churn', value: '2.4%', growth: '-0.5%', isPositive: true }, // Lower churn is positive
  ];

  const monthlyData = [
    { month: 'Jan', pendapatan: 25 },
    { month: 'Feb', pendapatan: 28 },
    { month: 'Mar', pendapatan: 32 },
    { month: 'Apr', pendapatan: 35 },
    { month: 'Mei', pendapatan: 42 },
  ];
  const maxPendapatan = Math.max(...monthlyData.map(d => d.pendapatan));

  const topGurus = [
    { rank: 1, name: 'Dewi Puspitasari', rating: 4.9, siswa: 18, mapel: 'Matematika' },
    { rank: 2, name: 'Ahmad Ridwan', rating: 4.8, siswa: 15, mapel: 'Fisika' },
    { rank: 3, name: 'Siti Nurhaliza', rating: 4.7, siswa: 12, mapel: 'Kimia' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
            Laporan <span style={{ color: '#0891b2' }}>Platform</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            Ringkasan performa dan metrik utama Synau
          </p>
        </div>
        <button style={{
          padding: '10px 18px', background: '#0f172a', color: '#fff', border: 'none',
          borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(15,23,42,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <i className="ti ti-download" style={{ fontSize: 16 }} />
          Unduh Laporan PDF
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {summaryStats.map(stat => (
          <div key={stat.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>{stat.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: stat.isPositive ? '#16a34a' : '#dc2626',
                background: stat.isPositive ? '#F0FDF4' : '#FEF2F2',
                padding: '2px 6px', borderRadius: 4,
              }}>{stat.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        {/* Chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-chart-line" style={{ color: '#0891b2', fontSize: 18 }} />
            Pertumbuhan Pendapatan (Juta Rp)
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 200, padding: '0 10px' }}>
            {monthlyData.map((d) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0891b2' }}>{d.pendapatan}</div>
                <div style={{
                  width: '100%', maxWidth: 48, borderRadius: '6px 6px 2px 2px',
                  height: `${(d.pendapatan / maxPendapatan) * 100}px`,
                  background: 'linear-gradient(180deg, #06b6d4, #0891b2)',
                  transition: 'height 0.5s ease', minHeight: 12,
                }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gurus */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-medal" style={{ color: '#eab308', fontSize: 18 }} />
            Top Guru
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topGurus.map(guru => (
              <div key={guru.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: guru.rank === 1 ? '#FEF08A' : guru.rank === 2 ? '#E2E8F0' : '#FFEDD5',
                  color: guru.rank === 1 ? '#A16207' : guru.rank === 2 ? '#475569' : '#9A3412',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, flexShrink: 0,
                }}>#{guru.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{guru.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{guru.mapel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#d97706' }}>⭐ {guru.rating}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{guru.siswa} siswa</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
