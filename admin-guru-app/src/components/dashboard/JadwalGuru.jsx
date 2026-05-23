import { useState, useEffect } from 'react';
import api from '../../services/api';

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const slotOptions = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

export default function JadwalGuru({ guruData, onUpdate }) {
  const [jadwal, setJadwal] = useState([]);
  const [slotJamPerHari, setSlotJamPerHari] = useState({}); // { Senin: ['08:00'], Kamis: ['14:00'] }
  const [selectedDay, setSelectedDay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const canEdit = true;

  useEffect(() => {
    if (guruData) {
      setJadwal(guruData.jadwal || []);
      // Support both old flat format and new per-hari format
      if (guruData.slot_jam_per_hari) {
        setSlotJamPerHari(guruData.slot_jam_per_hari);
      } else if (guruData.slot_jam) {
        // Migrate flat format: apply same slots to all active days
        const perHari = {};
        (guruData.jadwal || []).forEach(h => { perHari[h] = [...guruData.slot_jam]; });
        setSlotJamPerHari(perHari);
      }
    }
  }, [guruData]);

  const toggleHari = (hari) => {
    if (!canEdit) return;
    if (jadwal.includes(hari)) {
      setJadwal(jadwal.filter(h => h !== hari));
      const updated = { ...slotJamPerHari };
      delete updated[hari];
      setSlotJamPerHari(updated);
      if (selectedDay === hari) setSelectedDay(null);
    } else {
      setJadwal([...jadwal, hari]);
      setSlotJamPerHari({ ...slotJamPerHari, [hari]: [] });
    }
  };

  const selectDayForView = (hari) => {
    if (!jadwal.includes(hari)) return;
    setSelectedDay(selectedDay === hari ? null : hari);
  };

  const toggleSlot = (slot) => {
    if (!canEdit || !selectedDay) return;
    const currentSlots = slotJamPerHari[selectedDay] || [];
    const updated = currentSlots.includes(slot)
      ? currentSlots.filter(s => s !== slot)
      : [...currentSlots, slot];
    setSlotJamPerHari({ ...slotJamPerHari, [selectedDay]: updated });
  };

  const handleSave = async () => {
    setSaving(true); setSaveSuccess(false);
    try {
      await api.put('/guru/jadwal', { jadwal, slot_jam_per_hari: slotJamPerHari });
      setSaveSuccess(true); if (onUpdate) onUpdate();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const currentDaySlots = selectedDay ? (slotJamPerHari[selectedDay] || []) : [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>Jadwal Mengajar</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, margin: 0 }}>Tentukan hari dan jam ketersediaan mengajar Anda</p>
        </div>
        {canEdit && (
          <button onClick={handleSave} disabled={saving} style={{
            padding: '11px 26px', background: saveSuccess ? '#16a34a' : saving ? '#94a3b8' : 'linear-gradient(135deg, #1D9E75, #15803d)',
            color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
            cursor: saving ? 'default' : 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className={`ti ${saving ? 'ti-loader' : saveSuccess ? 'ti-check' : 'ti-device-floppy'}`} style={{ fontSize: 16 }} />
            {saving ? 'Menyimpan...' : saveSuccess ? 'Tersimpan' : 'Simpan Jadwal'}
          </button>
        )}
      </div>

      {saveSuccess && (
        <div style={{ background: '#F0FDF4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 16, color: '#16a34a' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Jadwal berhasil diperbarui</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 18 }}>
        {/* Pilih Hari */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-calendar" style={{ fontSize: 17, color: '#185FA5' }} />
            Hari Mengajar
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
            Klik <strong>bulatan</strong> untuk mengaktifkan hari.
            Klik <strong>nama hari</strong> untuk mengatur jam.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {hariList.map(hari => {
              const active = jadwal.includes(hari);
              const isViewing = selectedDay === hari;
              const slotCount = (slotJamPerHari[hari] || []).length;
              return (
                <div key={hari} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 10,
                  background: isViewing ? '#EFF6FF' : active ? '#f8fafc' : '#fafafa',
                  border: `1.5px solid ${isViewing ? '#93c5fd' : active ? '#d1d5db' : '#e5e7eb'}`,
                  transition: 'all 0.15s',
                }}>
                  <button onClick={() => selectDayForView(hari)} style={{
                    background: 'none', border: 'none', cursor: active ? 'pointer' : 'default',
                    fontSize: 14, fontWeight: active ? 600 : 400,
                    color: isViewing ? '#1d4ed8' : active ? '#0f172a' : '#cbd5e1',
                    padding: 0, fontFamily: 'inherit', textAlign: 'left', flex: 1,
                  }}>
                    {hari}
                    {active && slotCount > 0 && (
                      <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>{slotCount} jam</span>
                    )}
                  </button>
                  <button onClick={() => toggleHari(hari)} disabled={!canEdit} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: `2px solid ${active ? '#16a34a' : '#d1d5db'}`,
                    background: active ? '#16a34a' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: canEdit ? 'pointer' : 'default', transition: 'all 0.15s',
                    flexShrink: 0, padding: 0,
                  }}>
                    {active && <i className="ti ti-check" style={{ color: '#fff', fontSize: 13 }} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slot Jam — per hari */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-clock" style={{ fontSize: 17, color: '#185FA5' }} />
              Slot Jam
            </h3>
            {selectedDay && (
              <span style={{ fontSize: 12, fontWeight: 700, background: '#EFF6FF', color: '#1d4ed8', padding: '3px 10px', borderRadius: 16 }}>
                {selectedDay}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            {selectedDay
              ? `Pilih jam mengajar untuk hari ${selectedDay}. Setiap hari memiliki slot jam masing-masing.`
              : 'Pilih hari terlebih dahulu di panel sebelah kiri.'
            }
          </p>

          {selectedDay ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {slotOptions.map(slot => {
                  const active = currentDaySlots.includes(slot);
                  return (
                    <button key={slot} onClick={() => toggleSlot(slot)} disabled={!canEdit} style={{
                      padding: '12px 0', textAlign: 'center',
                      background: active ? '#185FA5' : '#f8fafc',
                      color: active ? '#fff' : '#64748b',
                      border: `1.5px solid ${active ? '#185FA5' : '#e2e8f0'}`,
                      borderRadius: 10, fontSize: 14, fontWeight: active ? 700 : 500,
                      cursor: canEdit ? 'pointer' : 'default', transition: 'all 0.15s',
                    }}>
                      {slot}
                    </button>
                  );
                })}
              </div>

              {/* Summary per hari */}
              <div style={{ marginTop: 18, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Ringkasan jam untuk {selectedDay}:</div>
                {currentDaySlots.length === 0 ? (
                  <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Belum ada slot jam dipilih</div>
                ) : (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {currentDaySlots.sort().map(s => (
                      <span key={s} style={{ background: '#E6F1FB', color: '#185FA5', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Full summary */}
              {jadwal.length > 0 && (
                <div style={{ marginTop: 12, padding: '14px 16px', background: '#fafafa', borderRadius: 10, border: '1px dashed #d1d5db' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Ringkasan keseluruhan:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {jadwal.map(h => {
                      const slots = (slotJamPerHari[h] || []).sort();
                      return (
                        <div key={h} style={{ fontSize: 13, color: '#0f172a' }}>
                          <strong>{h}</strong>: {slots.length > 0 ? slots.join(', ') : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>belum diatur</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '44px 0', color: '#cbd5e1' }}>
              <i className="ti ti-hand-click" style={{ fontSize: 36, display: 'block', marginBottom: 8, color: '#d1d5db' }} />
              <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Pilih hari terlebih dahulu</div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>Klik nama hari yang sudah diaktifkan</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
