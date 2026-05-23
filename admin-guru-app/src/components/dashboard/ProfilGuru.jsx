import { useState, useEffect } from 'react';
import api from '../../services/api';

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
  borderRadius: '10px', fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s', background: '#fff',
};
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' };

const mapelOptions = [
  'Matematika SMP', 'Matematika SMA', 'Fisika SMP', 'Fisika SMA',
  'Kimia SMA', 'Biologi SMA', 'Bahasa Inggris', 'Bahasa Indonesia',
  'IPA SMP', 'IPS SMP', 'Informatika', 'Seni & Budaya',
  'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi',
];

export default function ProfilGuru({ guruData, onUpdate }) {
  const [bio, setBio] = useState('');
  const [mapel, setMapel] = useState([]);
  const [hargaMingguan, setHargaMingguan] = useState('');
  const [hargaBulanan, setHargaBulanan] = useState('');
  const [menitPerSesi, setMenitPerSesi] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newMapel, setNewMapel] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [fotoProfil, setFotoProfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    if (guruData) {
      setBio(guruData.bio || '');
      setMapel(guruData.mata_pelajaran || []);
      setHargaMingguan(guruData.harga?.mingguan?.toString() || '');
      setHargaBulanan(guruData.harga?.bulanan?.toString() || '');
      setMenitPerSesi(guruData.harga?.menitPerSesi?.toString() || '90');
      if (guruData.foto_profil) setFotoPreview(guruData.foto_profil);
    }
  }, [guruData]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoProfil(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const addMapel = (value) => { if (value && !mapel.includes(value)) setMapel([...mapel, value]); setNewMapel(''); };
  const removeMapel = (item) => setMapel(mapel.filter(m => m !== item));

  const handleSave = async () => {
    setSaving(true); setSaveSuccess(false);
    try {
      await api.put('/guru/profil', { bio, mata_pelajaran: mapel, harga_mingguan: parseInt(hargaMingguan) || 0, harga_bulanan: parseInt(hargaBulanan) || 0, menit_per_sesi: parseInt(menitPerSesi) || 90 });
      setSaveSuccess(true); if (onUpdate) onUpdate();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const getFocusStyle = (field) => ({ ...inputStyle, borderColor: focusedField === field ? '#3b82f6' : '#e2e8f0' });

  const initials = guruData?.nama ? guruData.nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'GR';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>Profil & Mata Pelajaran</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Kelola informasi profil dan kompetensi mengajar Anda</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          padding: '11px 26px', background: saveSuccess ? '#16a34a' : saving ? '#94a3b8' : '#185FA5',
          color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: saving ? 'default' : 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <i className={`ti ${saving ? 'ti-loader' : saveSuccess ? 'ti-check' : 'ti-device-floppy'}`} style={{ fontSize: 16 }} />
          {saving ? 'Menyimpan...' : saveSuccess ? 'Tersimpan' : 'Simpan'}
        </button>
      </div>

      {saveSuccess && (
        <div style={{ background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16, color: '#16a34a' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Profil berhasil disimpan</span>
        </div>
      )}

      {/* Profile Picture + Preview Card */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
        padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24,
      }}>
        {/* Profile Picture */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 20, overflow: 'hidden',
            background: fotoPreview ? 'transparent' : 'linear-gradient(135deg, #378ADD, #1D9E75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #e2e8f0',
          }}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="Foto Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{initials}</span>
            )}
          </div>
          <label style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 30, height: 30, borderRadius: '50%',
            background: '#185FA5', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.2s',
          }}>
            <i className="ti ti-pencil" style={{ fontSize: 14, color: '#fff' }} />
            <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{guruData?.nama || 'Nama Guru'}</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>{guruData?.email || 'email@contoh.com'} · {guruData?.kota || 'Kota'}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {mapel.slice(0, 4).map(m => (
              <span key={m} style={{ background: '#EFF6FF', color: '#1d4ed8', padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, border: '1px solid #dbeafe' }}>{m}</span>
            ))}
            {mapel.length > 4 && <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600 }}>+{mapel.length - 4}</span>}
          </div>
        </div>

        {/* Status + Price */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: guruData?.terverifikasi ? '#16a34a' : '#d97706' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: guruData?.terverifikasi ? '#16a34a' : '#d97706' }}>
              {guruData?.terverifikasi ? 'Terverifikasi' : 'Menunggu'}
            </span>
          </div>
          {(hargaMingguan || hargaBulanan) && (
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              Rp {parseInt(hargaBulanan || hargaMingguan || 0).toLocaleString('id-ID')}
              <span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>/{hargaBulanan ? 'bln' : 'mgg'}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Left — Bio & Info */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-user" style={{ fontSize: 17, color: '#185FA5' }} />
            Informasi Profil
          </h3>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Bio / Deskripsi</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} onFocus={() => setFocusedField('bio')} onBlur={() => setFocusedField(null)}
              placeholder="Ceritakan pengalaman mengajar Anda..." rows={4} style={{ ...getFocusStyle('bio'), resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nama Lengkap</label>
            <input type="text" value={guruData?.nama || ''} disabled style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={guruData?.email || ''} disabled style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
          </div>
          <div>
            <label style={labelStyle}>Kota</label>
            <input type="text" value={guruData?.kota || '-'} disabled style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} />
          </div>
        </div>

        {/* Right — Mapel & Harga */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22, marginBottom: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-book" style={{ fontSize: 17, color: '#185FA5' }} />
              Mata Pelajaran
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, minHeight: 32 }}>
              {mapel.length > 0 ? mapel.map((m) => (
                <span key={m} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#EFF6FF', color: '#1d4ed8', padding: '5px 12px',
                  borderRadius: 16, fontSize: 12, fontWeight: 600, border: '1px solid #dbeafe',
                }}>
                  {m}
                  <button onClick={() => removeMapel(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6366f1', padding: 0, lineHeight: 1 }}>×</button>
                </span>
              )) : <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Belum ada mata pelajaran</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={newMapel} onChange={(e) => setNewMapel(e.target.value)} style={{ ...inputStyle, flex: 1, color: newMapel ? '#0f172a' : '#94a3b8', cursor: 'pointer' }}>
                <option value="">Pilih mata pelajaran...</option>
                {mapelOptions.filter(m => !mapel.includes(m)).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button onClick={() => addMapel(newMapel)} disabled={!newMapel} style={{
                padding: '11px 18px', background: newMapel ? '#185FA5' : '#e2e8f0',
                color: newMapel ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: newMapel ? 'pointer' : 'default',
                fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>Tambah</button>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-currency-dollar" style={{ fontSize: 17, color: '#185FA5' }} />
              Tarif & Durasi
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Harga Mingguan (Rp)</label>
                <input type="number" value={hargaMingguan} onChange={(e) => setHargaMingguan(e.target.value)}
                  onFocus={() => setFocusedField('hw')} onBlur={() => setFocusedField(null)} placeholder="150000" style={getFocusStyle('hw')} />
              </div>
              <div>
                <label style={labelStyle}>Harga Bulanan (Rp)</label>
                <input type="number" value={hargaBulanan} onChange={(e) => setHargaBulanan(e.target.value)}
                  onFocus={() => setFocusedField('hb')} onBlur={() => setFocusedField(null)} placeholder="500000" style={getFocusStyle('hb')} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Durasi per Sesi (menit)</label>
              <input type="number" value={menitPerSesi} onChange={(e) => setMenitPerSesi(e.target.value)}
                onFocus={() => setFocusedField('mps')} onBlur={() => setFocusedField(null)} placeholder="90" style={getFocusStyle('mps')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
