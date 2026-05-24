import { useState } from 'react';

const mockPendingGurus = [
  {
    id: 1, name: 'Ahmad Ridwan, M.Pd', email: 'ahmad.ridwan@email.com',
    tanggalDaftar: '2026-05-22', noHp: '081234567890',
    kota: 'Semarang', provinsi: 'Jawa Tengah',
    alamat: 'Jl. Pemuda No. 45, Semarang',
    namaPanggilan: 'Ahmad',
    cv_url: '/storage/dokumen-guru/cv/ahmad_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/ahmad_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/ahmad_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 2, name: 'Siti Nurhaliza, S.Si', email: 'siti.nur@email.com',
    tanggalDaftar: '2026-05-21', noHp: '085678901234',
    kota: 'Magelang', provinsi: 'Jawa Tengah',
    alamat: 'Jl. Soekarno-Hatta No. 12, Magelang',
    namaPanggilan: 'Siti',
    cv_url: '/storage/dokumen-guru/cv/siti_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/siti_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/siti_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 3, name: 'Rizki Maulana, S.Pd', email: 'rizki.m@email.com',
    tanggalDaftar: '2026-05-20', noHp: '087890123456',
    kota: 'Yogyakarta', provinsi: 'DI Yogyakarta',
    alamat: 'Jl. Malioboro No. 78, Yogyakarta',
    namaPanggilan: 'Rizki',
    cv_url: '/storage/dokumen-guru/cv/rizki_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/rizki_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/rizki_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 4, name: 'Maya Anggraeni, M.Pd', email: 'maya.ang@email.com',
    tanggalDaftar: '2026-05-19', noHp: '081122334455',
    kota: 'Solo', provinsi: 'Jawa Tengah',
    alamat: 'Jl. Slamet Riyadi No. 156, Solo',
    namaPanggilan: 'Maya',
    cv_url: '/storage/dokumen-guru/cv/maya_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/maya_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/maya_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 5, name: 'Fajar Setiawan, S.Pd', email: 'fajar.s@email.com',
    tanggalDaftar: '2026-05-18', noHp: '089988776655',
    kota: 'Purwokerto', provinsi: 'Jawa Tengah',
    alamat: 'Jl. Jendral Soedirman No. 89, Purwokerto',
    namaPanggilan: 'Fajar',
    cv_url: '/storage/dokumen-guru/cv/fajar_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/fajar_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/fajar_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 6, name: 'Putri Wulandari, S.Si', email: 'putri.w@email.com',
    tanggalDaftar: '2026-05-17', noHp: '081567890123',
    kota: 'Surabaya', provinsi: 'Jawa Timur',
    alamat: 'Jl. Tunjungan No. 33, Surabaya',
    namaPanggilan: 'Putri',
    cv_url: '/storage/dokumen-guru/cv/putri_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/putri_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/putri_ijazah.pdf',
    status: 'pending',
  },
  {
    id: 7, name: 'Hendra Pratama, M.Si', email: 'hendra.p@email.com',
    tanggalDaftar: '2026-05-16', noHp: '082345678901',
    kota: 'Bandung', provinsi: 'Jawa Barat',
    alamat: 'Jl. Asia Afrika No. 65, Bandung',
    namaPanggilan: 'Hendra',
    cv_url: '/storage/dokumen-guru/cv/hendra_cv.pdf',
    ktp_url: '/storage/dokumen-guru/ktp/hendra_ktp.jpg',
    ijazah_url: '/storage/dokumen-guru/ijazah/hendra_ijazah.pdf',
    status: 'pending',
  },
];

export default function VerifikasiGuru() {
  const [gurus, setGurus] = useState(mockPendingGurus);
  const [selectedGuru, setSelectedGuru] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmAction, setConfirmAction] = useState(null); // { id, action: 'approve' | 'reject' }
  const [rejectReason, setRejectReason] = useState('');

  const filtered = gurus.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'pending' && g.status === 'pending') ||
      (filterStatus === 'approved' && g.status === 'approved') ||
      (filterStatus === 'rejected' && g.status === 'rejected');
    return matchesSearch && matchesFilter;
  });

  const handleVerify = (id) => {
    setGurus(gurus.map(g => g.id === id ? { ...g, status: 'approved' } : g));
    setConfirmAction(null);
    if (selectedGuru?.id === id) setSelectedGuru({ ...selectedGuru, status: 'approved' });
  };

  const handleReject = (id) => {
    setGurus(gurus.map(g => g.id === id ? { ...g, status: 'rejected', alasanTolak: rejectReason } : g));
    setConfirmAction(null);
    setRejectReason('');
    if (selectedGuru?.id === id) setSelectedGuru({ ...selectedGuru, status: 'rejected' });
  };

  const statusBadge = (status) => {
    const map = {
      pending: { bg: '#FFFBEB', color: '#d97706', border: '#fde68a', label: 'Menunggu Verifikasi', icon: 'ti-clock' },
      approved: { bg: '#F0FDF4', color: '#16a34a', border: '#bbf7d0', label: 'Diverifikasi', icon: 'ti-circle-check' },
      rejected: { bg: '#FEF2F2', color: '#dc2626', border: '#fecaca', label: 'Ditolak', icon: 'ti-circle-x' },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        padding: '3px 10px', borderRadius: 16, fontSize: 11, fontWeight: 700,
      }}>
        <i className={`ti ${s.icon}`} style={{ fontSize: 12 }} />
        {s.label}
      </span>
    );
  };

  const pendingCount = gurus.filter(g => g.status === 'pending').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Verifikasi <span style={{ color: '#d97706' }}>Pendaftaran Guru</span>
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>
          Periksa dan verifikasi dokumen guru yang baru mendaftar
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { label: 'Menunggu', value: pendingCount, accent: '#d97706', icon: 'ti-clock' },
          { label: 'Diverifikasi', value: gurus.filter(g => g.status === 'approved').length, accent: '#16a34a', icon: 'ti-check' },
          { label: 'Ditolak', value: gurus.filter(g => g.status === 'rejected').length, accent: '#dc2626', icon: 'ti-x' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 18, color: s.accent }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Cari nama, email, atau kota guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 40px',
              border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none',
              transition: 'border-color 0.2s', boxSizing: 'border-box',
            }}
            onFocus={(e) => e.target.style.borderColor = '#185FA5'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'pending', label: 'Menunggu' },
            { key: 'approved', label: 'Diverifikasi' },
            { key: 'rejected', label: 'Ditolak' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
              padding: '8px 14px', border: 'none', borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: filterStatus === f.key ? '#185FA5' : 'transparent',
              color: filterStatus === f.key ? '#fff' : '#64748b',
              transition: 'all 0.2s',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content — Table + Detail Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedGuru ? '1fr 380px' : '1fr', gap: 18 }}>
        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 56, textAlign: 'center', color: '#cbd5e1' }}>
              <i className="ti ti-search-off" style={{ fontSize: 40, display: 'block', marginBottom: 8 }} />
              <div style={{ fontSize: 14 }}>Tidak ada data yang cocok</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Guru</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kota</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tanggal Daftar</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => {
                  const initials = g.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
                  const isSelected = selectedGuru?.id === g.id;
                  return (
                    <tr key={g.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#f0f7ff' : 'transparent',
                        transition: 'background 0.15s', cursor: 'pointer',
                      }}
                      onClick={() => setSelectedGuru(g)}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#fafbfc'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8, background: '#E6F1FB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: '#185FA5', flexShrink: 0,
                          }}>{initials}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{g.name}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{g.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{g.kota}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>
                        {new Date(g.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>{statusBadge(g.status)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {g.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ id: g.id, action: 'approve' }); }} style={{
                              padding: '5px 12px', background: '#16a34a', color: '#fff', border: 'none',
                              borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                              fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.15s',
                            }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                            >
                              <i className="ti ti-check" style={{ fontSize: 12, marginRight: 4 }} />Verifikasi
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmAction({ id: g.id, action: 'reject' }); }} style={{
                              padding: '5px 12px', background: 'transparent', color: '#dc2626',
                              border: '1px solid #fecaca', borderRadius: 6, fontSize: 11, fontWeight: 700,
                              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.15s',
                            }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail Panel */}
        {selectedGuru && (
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22,
            position: 'sticky', top: 20, alignSelf: 'start',
            animation: 'slideIn 0.25s ease-out',
          }}>
            <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }`}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg, #378ADD, #185FA5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: '#fff',
                  boxShadow: '0 4px 12px rgba(55,138,221,0.3)',
                }}>
                  {selectedGuru.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{selectedGuru.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{selectedGuru.namaPanggilan}</div>
                </div>
              </div>
              <button onClick={() => setSelectedGuru(null)} style={{
                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 14, color: '#64748b',
              }}>×</button>
            </div>

            {statusBadge(selectedGuru.status)}

            {/* Info Fields */}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'ti-mail', label: 'Email', value: selectedGuru.email },
                { icon: 'ti-phone', label: 'No. HP', value: selectedGuru.noHp },
                { icon: 'ti-map-pin', label: 'Alamat', value: selectedGuru.alamat },
                { icon: 'ti-building', label: 'Kota', value: `${selectedGuru.kota}, ${selectedGuru.provinsi}` },
                { icon: 'ti-calendar', label: 'Tanggal Daftar', value: new Date(selectedGuru.tanggalDaftar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <i className={`ti ${info.icon}`} style={{ fontSize: 15, color: '#94a3b8', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{info.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', marginTop: 1 }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div style={{ marginTop: 20, borderTop: '1px solid #f1f5f9', paddingTop: 18 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-file-check" style={{ color: '#185FA5', fontSize: 15 }} />
                Dokumen Pendaftaran
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '📄', label: 'Curriculum Vitae (CV)', file: selectedGuru.cv_url, color: '#185FA5' },
                  { icon: '🪪', label: 'Scan KTP', file: selectedGuru.ktp_url, color: '#378ADD' },
                  { icon: '🎓', label: 'Ijazah / Surat Aktif', file: selectedGuru.ijazah_url, color: '#1D9E75' },
                ].map(doc => (
                  <div key={doc.label} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', background: '#f8fafc', borderRadius: 10,
                    border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f0f7ff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <span style={{ fontSize: 20 }}>{doc.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{doc.label}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Klik untuk melihat</div>
                    </div>
                    <i className="ti ti-external-link" style={{ fontSize: 14, color: doc.color }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedGuru.status === 'pending' && (
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button onClick={() => setConfirmAction({ id: selectedGuru.id, action: 'approve' })} style={{
                  flex: 1, padding: '12px', background: '#16a34a', color: '#fff',
                  border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                >
                  <i className="ti ti-check" style={{ fontSize: 16 }} />
                  Verifikasi
                </button>
                <button onClick={() => setConfirmAction({ id: selectedGuru.id, action: 'reject' })} style={{
                  flex: 1, padding: '12px', background: '#fff', color: '#dc2626',
                  border: '1px solid #fecaca', borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <i className="ti ti-x" style={{ fontSize: 16 }} />
                  Tolak
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => { setConfirmAction(null); setRejectReason(''); }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            animation: 'slideIn 0.2s ease-out',
          }}>
            {confirmAction.action === 'approve' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: 28, color: '#16a34a',
                  }}>
                    <i className="ti ti-check" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Verifikasi Guru?</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                    Guru <strong>{gurus.find(g => g.id === confirmAction.id)?.name}</strong> akan diverifikasi dan bisa mulai mengisi profil mengajar.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setConfirmAction(null); setRejectReason(''); }} style={{
                    flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>Batal</button>
                  <button onClick={() => handleVerify(confirmAction.id)} style={{
                    flex: 1, padding: '12px', background: '#16a34a', color: '#fff',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                  >Ya, Verifikasi</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: 28, color: '#dc2626',
                  }}>
                    <i className="ti ti-x" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Tolak Pendaftaran?</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
                    Berikan alasan penolakan untuk <strong>{gurus.find(g => g.id === confirmAction.id)?.name}</strong>:
                  </p>
                </div>
                <textarea
                  placeholder="Alasan penolakan (opsional)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0',
                    borderRadius: 10, fontSize: 14, fontFamily: 'inherit', resize: 'none',
                    outline: 'none', boxSizing: 'border-box', marginBottom: 16,
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setConfirmAction(null); setRejectReason(''); }} style={{
                    flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>Batal</button>
                  <button onClick={() => handleReject(confirmAction.id)} style={{
                    flex: 1, padding: '12px', background: '#dc2626', color: '#fff',
                    border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                  >Ya, Tolak</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
