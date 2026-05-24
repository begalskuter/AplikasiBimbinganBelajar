import { useState, useEffect } from 'react';
import api from '../../services/api';
import { listenActivityLogs } from '../../services/firestoreService';

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const POTONGAN_PLATFORM = 10;

export default function LaporanAdmin() {
  const [data, setData] = useState({
    summaryStats: [],
    monthlyData: [],
    topGurus: [],
  });
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await api.get('/admin/laporan');
        setData(response.data);
      } catch (error) {
        console.error('Gagal ambil laporan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();

    // Firebase Listener untuk Log Aktivitas
    const unsubscribe = listenActivityLogs((data) => {
      setActivityLogs(data.slice(0, 5)); // Ambil 5 terbaru
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Memuat laporan...</div>;
  }

  const { summaryStats, monthlyData, topGurus } = data;
  const maxPendapatan = monthlyData.length
    ? Math.max(...monthlyData.map(d => d.pendapatan))
    : 1;

  // Hitung total kotor dari summaryStats (cari field pendapatan/kotor)
  // lalu ambil 10%-nya sebagai pendapatan sistem
  const totalKotor = summaryStats.find(s =>
    s.label?.toLowerCase().includes('pendapatan') ||
    s.label?.toLowerCase().includes('kotor')
  )?.rawValue ?? null;

  const pendapatanSistem = totalKotor !== null
    ? Math.round(totalKotor * POTONGAN_PLATFORM / 100)
    : null;

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
        {summaryStats.map((stat, idx) => {
          // Deteksi kartu pendapatan — ganti value-nya jadi 10% (pendapatan sistem)
          const isPendapatan =
            stat.label?.toLowerCase().includes('pendapatan') ||
            stat.label?.toLowerCase().includes('kotor');

          const displayValue = isPendapatan && stat.rawValue != null
            ? formatRupiah(Math.round(stat.rawValue * POTONGAN_PLATFORM / 100))
            : stat.value;

          const displayLabel = isPendapatan
            ? `Pendapatan Sistem (${POTONGAN_PLATFORM}%)`
            : stat.label;

          return (
            <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>{displayLabel}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: isPendapatan ? 16 : 24, fontWeight: 800, color: isPendapatan ? '#dc2626' : '#0f172a' }}>
                  {displayValue}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: stat.isPositive ? '#16a34a' : '#dc2626',
                  background: stat.isPositive ? '#F0FDF4' : '#FEF2F2',
                  padding: '2px 6px', borderRadius: 4,
                }}>{stat.growth}</span>
              </div>
            </div>
          );
        })}
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
            {monthlyData.map((d, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
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

      {/* Realtime Activity Logs (Firebase) */}
      <div style={{ marginTop: 20, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: 24, boxShadow: '0 4px 12px rgba(22,163,74,0.05)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#166534', margin: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ position: 'relative', display: 'flex', height: 10, width: 10 }}>
            <span style={{ animate: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', inlineSize: '100%', blockSize: '100%', borderRadius: '50%', backgroundColor: '#22c55e', opacity: 0.7 }}></span>
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: 10, width: 10, backgroundColor: '#16a34a' }}></span>
          </span>
          Aktivitas Terbaru Sistem (Live)
        </h3>
        
        {activityLogs.length === 0 ? (
          <div style={{ fontSize: 13, color: '#15803d', fontStyle: 'italic' }}>Belum ada aktivitas realtime yang terekam.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activityLogs.map(log => {
              const waktu = log.created_at ? new Date(log.created_at.toDate()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Sekarang';
              return (
                <div key={log.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: '1px dashed #bbf7d0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: 6, marginTop: 2 }}>{waktu}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{log.actor_name} <span style={{ fontWeight: 400, color: '#15803d' }}>{log.description}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}