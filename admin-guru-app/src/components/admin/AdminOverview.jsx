import { useState, useEffect } from 'react';

export default function AdminOverview() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = dayNames[now.getDay()];
  const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const summaryCards = [
    { icon: 'ti-chalkboard', label: 'Total Guru', value: 48, change: '+5', accent: '#185FA5' },
    { icon: 'ti-school', label: 'Total Siswa', value: 312, change: '+23', accent: '#7c3aed' },
    { icon: 'ti-book', label: 'Kelas Aktif', value: 86, change: '+12', accent: '#16a34a' },
    { icon: 'ti-clock-pause', label: 'Bayar Pending', value: 14, change: '-3', accent: '#ea580c' },
  ];

  const extraCards = [
    { icon: 'ti-alert-triangle', label: 'Total Tunggakan', value: 'Rp 4.250.000', accent: '#dc2626' },
    { icon: 'ti-user-plus', label: 'Menunggu Verifikasi', value: 7, accent: '#d97706' },
  ];

  const recentActivities = [
    { icon: 'ti-user-check', text: 'Dewi Puspitasari telah diverifikasi sebagai guru', time: '5 menit lalu', color: '#16a34a' },
    { icon: 'ti-credit-card', text: 'Pembayaran Rp 500.000 dari Budi Santoso (Konfirmasi)', time: '12 menit lalu', color: '#185FA5' },
    { icon: 'ti-user-plus', text: 'Ahmad Ridwan mendaftar sebagai guru baru', time: '25 menit lalu', color: '#d97706' },
    { icon: 'ti-calendar-check', text: 'Jadwal baru disetujui untuk Siti Nurhaliza', time: '1 jam lalu', color: '#7c3aed' },
    { icon: 'ti-coin', text: 'Gaji guru bulan Mei telah dihitung (32 guru)', time: '2 jam lalu', color: '#ea580c' },
    { icon: 'ti-school', text: 'Rina Putri mendaftar sebagai siswa baru', time: '3 jam lalu', color: '#0891b2' },
  ];

  // Monthly data for CSS bar chart
  const monthlyData = [
    { month: 'Jan', guru: 5, siswa: 28, pendapatan: 12 },
    { month: 'Feb', guru: 8, siswa: 35, pendapatan: 18 },
    { month: 'Mar', guru: 6, siswa: 42, pendapatan: 22 },
    { month: 'Apr', guru: 10, siswa: 55, pendapatan: 35 },
    { month: 'Mei', guru: 12, siswa: 68, pendapatan: 45 },
    { month: 'Jun', guru: 7, siswa: 84, pendapatan: 52 },
  ];
  const maxSiswa = Math.max(...monthlyData.map(d => d.siswa));

  const quickActions = [
    { icon: 'ti-user-check', label: 'Verifikasi Guru', color: '#d97706', bg: '#FFFBEB' },
    { icon: 'ti-calendar-check', label: 'Approve Jadwal', color: '#7c3aed', bg: '#F5F3FF' },
    { icon: 'ti-credit-card', label: 'Konfirmasi Bayar', color: '#16a34a', bg: '#F0FDF4' },
    { icon: 'ti-report-money', label: 'Hitung Gaji', color: '#ea580c', bg: '#FFF7ED' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
            Dashboard <span style={{ color: '#185FA5' }}>Admin</span>
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
            {todayName}, {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#0f172a', borderRadius: 10, padding: '8px 18px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 600, color: '#e2e8f0', letterSpacing: 1 }}>
            {formatTime(now)}
          </span>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 14, padding: '20px 18px',
            border: '1px solid #e2e8f0', transition: 'all 0.2s', cursor: 'default',
            position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{card.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${card.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`ti ${card.icon}`} style={{ fontSize: 17, color: card.accent }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</div>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: card.change.startsWith('+') ? '#16a34a' : '#dc2626',
                background: card.change.startsWith('+') ? '#F0FDF4' : '#FEF2F2',
                padding: '2px 6px', borderRadius: 4,
              }}>{card.change}</span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: card.accent, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Extra Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
        {extraCards.map((card) => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 14, padding: '18px 20px',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16,
            transition: 'all 0.2s', cursor: 'default',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(15,23,42,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${card.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: 22, color: card.accent }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
        {/* Monthly Trend */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-chart-bar" style={{ fontSize: 18, color: '#185FA5' }} />
            Tren Pendaftaran Siswa
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, padding: '0 4px' }}>
            {monthlyData.map((d) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#185FA5' }}>{d.siswa}</div>
                <div style={{
                  width: '100%', maxWidth: 36, borderRadius: '6px 6px 2px 2px',
                  height: `${(d.siswa / maxSiswa) * 100}px`,
                  background: 'linear-gradient(180deg, #378ADD, #185FA5)',
                  transition: 'height 0.5s ease',
                  minHeight: 8,
                }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-bolt" style={{ fontSize: 18, color: '#185FA5' }} />
            Aksi Cepat
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map((action) => (
              <button key={action.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: 12,
                background: action.bg, cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'left',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <i className={`ti ${action.icon}`} style={{ fontSize: 20, color: action.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        borderRadius: 16, padding: '22px 26px', color: '#fff',
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-activity" style={{ fontSize: 18, color: '#4db8ff' }} />
          Aktivitas Terbaru
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {recentActivities.map((act, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              borderBottom: i < recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${act.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={`ti ${act.icon}`} style={{ fontSize: 16, color: act.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{act.text}</div>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, whiteSpace: 'nowrap' }}>{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
