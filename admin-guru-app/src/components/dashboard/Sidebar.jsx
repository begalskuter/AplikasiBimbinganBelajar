import { useState } from 'react';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'ti-layout-dashboard' },
  { id: 'profil', label: 'Profil & Mapel', icon: 'ti-user-edit' },
  { id: 'jadwal', label: 'Jadwal Mengajar', icon: 'ti-calendar-event' },
  { id: 'siswa', label: 'Siswa & Booking', icon: 'ti-users' },
  { id: 'pembayaran', label: 'Pembayaran', icon: 'ti-credit-card' },
];

export default function Sidebar({ activePage, onNavigate, guruData, onLogout }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const initials = guruData?.nama
    ? guruData.nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'GR';

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
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginTop: 3, letterSpacing: 0.5 }}>
          Portal Guru
        </div>
      </div>

      {/* Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(77,184,255,0.08), rgba(29,158,117,0.06))',
        borderRadius: 14,
        padding: '16px',
        marginBottom: 28,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #378ADD, #1D9E75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(55,138,221,0.3)',
          }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {guruData?.nama || 'Guru Synau'}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, marginTop: 3,
              color: guruData?.terverifikasi ? '#4ade80' : '#fbbf24',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: guruData?.terverifikasi ? '#4ade80' : '#fbbf24',
                boxShadow: `0 0 6px ${guruData?.terverifikasi ? 'rgba(74,222,128,0.5)' : 'rgba(251,191,36,0.5)'}`,
              }} />
              {guruData?.terverifikasi ? 'Terverifikasi' : 'Menunggu Verifikasi'}
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
