import { useState } from 'react';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'ti-layout-dashboard' },
  { id: 'verifikasi', label: 'Verifikasi Guru', icon: 'ti-user-check', badge: true },
  { id: 'guru', label: 'Data Guru', icon: 'ti-chalkboard' },
  { id: 'siswa', label: 'Data Siswa', icon: 'ti-school' },
  { id: 'kelas', label: 'Kelas & Jadwal', icon: 'ti-calendar-stats' },
  { id: 'pembayaran', label: 'Pembayaran', icon: 'ti-credit-card' },
  { id: 'gaji', label: 'Gaji Guru', icon: 'ti-moneybag' },
  { id: 'laporan', label: 'Laporan', icon: 'ti-chart-bar' },
];

export default function AdminSidebar({ activePage, onNavigate, adminData, onLogout, pendingCount = 0 }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const initials = adminData?.name
    ? adminData.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div style={{
      width: 272,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #071a2f 0%, #0e2d50 50%, #0a2240 100%)',
      padding: '28px 16px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0, zIndex: 50,
      borderRight: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 12px', marginBottom: 36 }}>
        <div style={{ fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: '-0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Syn<span style={{ color: '#4db8ff' }}>au</span>
        </div>
        <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600, marginTop: 3, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px rgba(251,191,36,0.5)' }} />
          Portal Admin
        </div>
      </div>

      {/* Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(77,184,255,0.06))',
        borderRadius: 14,
        padding: '16px',
        marginBottom: 28,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {adminData?.name || 'Admin Synau'}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, marginTop: 3,
              color: '#fbbf24',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <i className="ti ti-shield-check" style={{ fontSize: 12 }} />
              Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 1.5, padding: '0 14px', marginBottom: 14 }}>
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          const isHovered = hoveredItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '13px 16px', marginBottom: 3,
                borderRadius: 12, border: 'none', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#fff' : isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(55,138,221,0.2), rgba(77,184,255,0.12))'
                  : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                borderLeft: isActive ? '3px solid #4db8ff' : '3px solid transparent',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: isActive ? 'rgba(77,184,255,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                <i className={`ti ${item.icon}`} style={{
                  fontSize: 19,
                  color: isActive ? '#4db8ff' : isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.2s',
                }} />
              </div>
              {item.label}
              {item.badge && pendingCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: 10,
                  minWidth: 20,
                  textAlign: 'center',
                  lineHeight: '16px',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        onMouseEnter={() => setHoveredItem('logout')}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '13px 16px',
          borderRadius: 12,
          border: `1px solid ${hoveredItem === 'logout' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 14, fontWeight: 500,
          color: hoveredItem === 'logout' ? '#ef4444' : 'rgba(255,255,255,0.4)',
          background: hoveredItem === 'logout' ? 'rgba(239,68,68,0.08)' : 'transparent',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          marginTop: 8,
        }}
      >
        <i className="ti ti-logout" style={{ fontSize: 19, color: hoveredItem === 'logout' ? '#ef4444' : 'rgba(255,255,255,0.3)' }} />
        Keluar
      </button>
    </div>
  );
}
