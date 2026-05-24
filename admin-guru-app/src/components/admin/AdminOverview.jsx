import { useState, useEffect } from 'react';
import api from '../../services/api';
import { listenAdminNotifications, listenActivityLogs } from '../../services/firestoreService';

export default function AdminOverview() {
  const [now, setNow] = useState(new Date());
  const [data, setData] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    kelasAktif: 0,
    pendingBayar: 0,
    pendapatanBersih: 0,
    menungguVerifikasi: 0,
    siswaPerBulan: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = listenAdminNotifications((notifications) => {
      setAdminNotifications(notifications);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = listenActivityLogs((logs) => {
      setActivityLogs(logs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get('/admin/overview');
        setData(response.data);
      } catch (error) {
        console.error('Gagal ambil data overview:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = dayNames[now.getDay()];
  const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Memuat dashboard...</div>;
  }

  const summaryCards = [
    { icon: 'ti-chalkboard', label: 'Total Guru', value: data.totalGuru, change: '+5', accent: '#185FA5' },
    { icon: 'ti-school', label: 'Total Siswa', value: data.totalSiswa, change: '+23', accent: '#7c3aed' },
    { icon: 'ti-book', label: 'Kelas Aktif', value: data.kelasAktif, change: '+12', accent: '#16a34a' },
    { icon: 'ti-clock-pause', label: 'Bayar Pending', value: data.pendingBayar, change: '-3', accent: '#ea580c' },
  ];

  const extraCards = [
    { icon: 'ti-wallet', label: 'Pendapatan Bersih Sistem', value: formatRupiah(data.pendapatanBersih), accent: '#dc2626' },
    { icon: 'ti-user-plus', label: 'Menunggu Verifikasi', value: data.menungguVerifikasi, accent: '#d97706' },
  ];

  const monthlyData = data.siswaPerBulan;
  const maxSiswa = monthlyData.length ? Math.max(...monthlyData.map(d => d.siswa)) : 1;

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

      {/* Extra Cards (Pendapatan Bersih + Menunggu Verifikasi) */}
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
            {monthlyData.map((d, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
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

      {/* Admin Notifications Realtime */}
      <div style={{ background: "#ffffff", borderRadius: 16, padding: "22px 26px", marginBottom: 22, border: "1px solid #e5e7eb", boxShadow: "0 8px 22px rgba(15,23,42,0.06)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-bell" style={{ fontSize: 18, color: "#185FA5" }} />
          Notifikasi Admin
          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#185FA5", background: "#E6F1FB", padding: "5px 10px", borderRadius: 999 }}>
            {adminNotifications.length} data
          </span>
        </h3>

        {adminNotifications.length === 0 ? (
          <div style={{ padding: "18px", borderRadius: 12, background: "#f8fafc", color: "#94a3b8", fontSize: 13, textAlign: "center", fontWeight: 600 }}>
            Belum ada notifikasi admin.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {adminNotifications.map((notif) => (
              <div key={notif.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, background: notif.isRead ? "#f8fafc" : "#EFF6FF", border: notif.isRead ? "1px solid #e5e7eb" : "1px solid #BFDBFE" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "#185FA5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-user-plus" style={{ fontSize: 18 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{notif.title || "Notifikasi Admin"}</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{notif.message || "-"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, fontWeight: 600 }}>Guru: {notif.teacherName || "-"}</div>
                </div>
                {!notif.isRead && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#1D4ED8", background: "#DBEAFE", padding: "5px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>Baru</span>
                )}
              </div>
            ))}
          </div>
        )}
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
          {(activityLogs.length ? activityLogs : data.recentActivities).map((act, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              borderBottom: i < (activityLogs.length ? activityLogs : data.recentActivities).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${act.color || "#4db8ff"}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <i className={`ti ${act.icon || (act.type === "student_booking" ? "ti-calendar-plus" : "ti-user-plus")}`} style={{ fontSize: 16, color: act.color || "#4db8ff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{act.description || act.title || act.text}</div>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, whiteSpace: 'nowrap' }}>{act.createdAt?.toDate ? act.createdAt.toDate().toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : (act.time || "Baru saja")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}









