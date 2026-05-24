import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Pembayaran() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/guru/bookings');
        // Hanya booking dengan status confirmed
        const confirmed = (res.data || []).filter(b => b.status === 'confirmed');
        setBookings(confirmed);
      } catch (err) {
        console.error('Gagal memuat data pembayaran:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const totalKotor = bookings.reduce((sum, b) => sum + (b.total_harga || 0), 0);
  const potonganAdmin = totalKotor * 0.1;
  const pendapatanBersih = totalKotor * 0.9;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Status Pembayaran
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Pantau status pembayaran dari kelas yang Anda ajar
        </p>
      </div>

      {/* Kartu Pendapatan Bersih */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 22 }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: 14,
          padding: '22px 26px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(77,184,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <i className="ti ti-wallet" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Pendapatan Bersih</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>
            Rp {pendapatanBersih.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>
            Total kotor: Rp {totalKotor.toLocaleString('id-ID')} &nbsp;•&nbsp;
            Potongan admin (10%): -Rp {potonganAdmin.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Tabel daftar booking */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Memuat data...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
            <i className="ti ti-receipt-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
            <div style={{ fontSize: 14 }}>Belum ada pembayaran</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Siswa / Paket
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Tanggal Mulai
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Total
                </th>
                <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const statusText = b.status === 'confirmed' ? 'Aktif' : 'Selesai';
                return (
                  <tr
                    key={b.id}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{b.siswa?.name || 'Siswa'}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, textTransform: 'capitalize' }}>{b.paket}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>
                      {new Date(b.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      Rp {(b.total_harga || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        background: statusText === 'Aktif' ? '#E0F2FE' : '#F1F5F9',
                        color: statusText === 'Aktif' ? '#0369a1' : '#475569',
                        padding: '4px 10px',
                        borderRadius: 16,
                        fontSize: 11,
                        fontWeight: 700,
                        border: `1px solid ${statusText === 'Aktif' ? '#bae6fd' : '#e2e8f0'}`,
                      }}>
                        {statusText}
                      </span>
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