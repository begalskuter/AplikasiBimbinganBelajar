import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function SiswaBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/guru/bookings');
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/guru/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert('Gagal mengupdate status booking');
      console.error(err);
      // fallback manual update for demo
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: '#FFF3E0', color: '#E67E22', label: 'Menunggu Konfirmasi' },
      confirmed: { bg: '#E8F5E9', color: '#1D9E75', label: 'Dikonfirmasi' },
      cancelled: { bg: '#FFEBEE', color: '#E53935', label: 'Dibatalkan' },
    };
    const style = map[status] || map.pending;
    return (
      <span style={{
        background: style.bg, color: style.color,
        padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#042C53', letterSpacing: '-0.5px', marginBottom: 4 }}>
            Siswa & Booking
          </h1>
          <p style={{ fontSize: 15, color: '#888', fontWeight: 500 }}>
            Kelola permintaan sesi belajar dari siswa
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, background: '#f5f5f5', padding: 4, borderRadius: 12 }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? '#fff' : 'transparent',
                color: filter === f ? '#185FA5' : '#888',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: filter === f ? 700 : 600,
                cursor: 'pointer',
                boxShadow: filter === f ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E6F1FB', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Memuat data...</div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#ccc' }}>
            <i className="ti ti-inbox" style={{ fontSize: 48, marginBottom: 12, display: 'block' }} />
            <div style={{ fontSize: 15 }}>Tidak ada data booking</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fbff', borderBottom: '1px solid #E6F1FB' }}>
                <th style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#042C53' }}>Data Siswa</th>
                <th style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#042C53' }}>Paket / Hari</th>
                <th style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#042C53' }}>Tanggal Mulai</th>
                <th style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#042C53' }}>Status</th>
                <th style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: '#042C53', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#E6F1FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#185FA5'
                      }}>
                        {(b.siswa?.name || '?').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                          {b.siswa?.name || 'Siswa'}
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                          <i className="ti ti-phone" style={{ fontSize: 11, marginRight: 4 }} />
                          {b.siswa?.no_hp || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#042C53', textTransform: 'capitalize' }}>
                      {b.paket}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                      {b.matpel || '-'} · {(b.hari_dipilih || []).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 14, color: '#555' }}>
                    {new Date(b.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {getStatusBadge(b.status)}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {b.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          style={{
                            padding: '6px 12px', background: '#1D9E75', color: '#fff', border: 'none',
                            borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                          }}>Terima</button>
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          style={{
                            padding: '6px 12px', background: 'transparent', color: '#E53935', border: '1px solid #E53935',
                            borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                          }}>Tolak</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
