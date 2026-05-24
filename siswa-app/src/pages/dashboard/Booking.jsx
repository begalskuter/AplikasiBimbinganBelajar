import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from '../../services/api';

const HARI_URUT = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const HARI_KE_JS = { "Minggu": 0, "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6 };

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

const getTanggalTerdekat = (hariDipilih) => {
    if (!hariDipilih || hariDipilih.length === 0) return "";
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    besok.setHours(0, 0, 0, 0);
    const hariJsTarget = hariDipilih.map(h => HARI_KE_JS[h]);
    for (let i = 0; i < 14; i++) {
        const cek = new Date(besok);
        cek.setDate(besok.getDate() + i);
        if (hariJsTarget.includes(cek.getDay())) return cek.toISOString().split('T')[0];
    }
    return "";
};

const getTanggalValid = (hariDipilih) => {
    const valid = new Set();
    const besok = new Date();
    besok.setDate(besok.getDate() + 1);
    besok.setHours(0, 0, 0, 0);
    const hariJsTarget = hariDipilih.map(h => HARI_KE_JS[h]);
    const batas = new Date(besok);
    batas.setMonth(batas.getMonth() + 3);
    const cur = new Date(besok);
    while (cur <= batas) {
        if (hariJsTarget.includes(cur.getDay())) valid.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
    }
    return valid;
};

const mockFallbackGuru = {
    id: 1, nama: "Bu Wulandari, S.Pd", mapel: "Matematika",
    mataPelajaran: ["Matematika", "Fisika"],
    kota: "Yogyakarta", rating: 4.9, warnaBg: "#185FA5", warnaText: "#fff",
    jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"],
    slot_jam_per_hari: {},
    harga: { mingguan: 150000, bulanan: 500000, sesiPerMinggu: 2, menitPerSesi: 90 },
};

const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24, marginBottom: 20 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 },
    input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
};

const steps = ["Pilih Paket", "Detail Jadwal", "Pembayaran"];

function StepIndicator({ aktif }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            {steps.map((step, i) => {
                const selesai = i < aktif;
                const aktifStep = i === aktif;
                return (
                    <div key={step} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all 0.2s", background: selesai ? "#1D9E75" : aktifStep ? "#185FA5" : "#E6F1FB", color: selesai || aktifStep ? "#fff" : "#aaa" }}>
                                {selesai ? "✓" : i + 1}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: aktifStep ? 700 : 500, color: aktifStep ? "#185FA5" : selesai ? "#1D9E75" : "#aaa", whiteSpace: "nowrap" }}>
                                {step}
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ width: 80, height: 2, background: selesai ? "#1D9E75" : "#E6F1FB", margin: "0 8px", marginBottom: 20, transition: "all 0.3s" }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function Step1({ guru, paket, setPaket, mapelDipilih, setMapelDipilih, jadwalDipilih, setJadwalDipilih, onNext }) {
    const harga = paket === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;
    const maxHari = paket === "mingguan" ? 2 : 3;

    const daftarMapel = guru.mataPelajaran?.length > 0
        ? guru.mataPelajaran
        : [guru.mapel].filter(Boolean);

    const toggleJadwal = (hari) => {
        setJadwalDipilih((prev) => {
            if (prev.includes(hari)) return prev.filter((h) => h !== hari);
            if (prev.length >= maxHari) return prev;
            return [...prev, hari];
        });
    };

    const inisial = guru.nama?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
    const bisaLanjut = jadwalDipilih.length > 0 && mapelDipilih;

    return (
        <div>
            <div style={s.card}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>Guru Dipilih</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: guru.warnaBg ?? "#185FA5", color: guru.warnaText ?? "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                        {inisial}
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{guru.kota}</div>
                    </div>
                    <span style={{ marginLeft: "auto", ...s.badge("#E6F1FB", "#0C447C") }}>★ {guru.rating}</span>
                </div>
            </div>

            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Pilih Mata Pelajaran</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Pilih 1 mata pelajaran yang ingin dipelajari</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {daftarMapel.map((mp) => {
                        const dipilih = mapelDipilih === mp;
                        return (
                            <div key={mp} onClick={() => setMapelDipilih(mp)} style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", border: dipilih ? "2px solid #185FA5" : "1.5px solid #B5D4F4", background: dipilih ? "#185FA5" : "#fff", color: dipilih ? "#fff" : "#185FA5", boxShadow: dipilih ? "0 2px 8px rgba(24,95,165,0.2)" : "none" }}>
                                {mp}
                            </div>
                        );
                    })}
                </div>
                {!mapelDipilih && <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 10 }}>* Pilih mata pelajaran terlebih dahulu</div>}
            </div>

            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Pilih Paket Belajar</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {["mingguan", "bulanan"].map((p) => {
                        const hargaP = p === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;
                        const aktif = paket === p;
                        return (
                            <div key={p} onClick={() => { setPaket(p); setJadwalDipilih([]); }} style={{ border: aktif ? "2px solid #185FA5" : "1.5px solid #B5D4F4", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s", background: aktif ? "#f0f7ff" : "#fff", position: "relative" }}>
                                {p === "bulanan" && (
                                    <div style={{ position: "absolute", top: -10, right: 12, background: "#1D9E75", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>Hemat 17%</div>
                                )}
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", marginBottom: 8, textTransform: "capitalize" }}>{p}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#185FA5", marginBottom: 6 }}>{formatRupiah(hargaP)}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>{guru.harga.sesiPerMinggu}x sesi / {p === "mingguan" ? "minggu" : "bulan"}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>{guru.harga.menitPerSesi} menit / sesi</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Pilih Hari Belajar</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                    Paket {paket} maksimal <strong>{maxHari} hari</strong> · terpilih {jadwalDipilih.length}/{maxHari}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {HARI_URUT.map((hari) => {
                        const tersedia = guru.jadwal?.includes(hari);
                        const dipilih = jadwalDipilih.includes(hari);
                        return (
                            <div key={hari} onClick={() => tersedia && toggleJadwal(hari)} style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: tersedia ? "pointer" : "not-allowed", transition: "all 0.15s", border: dipilih ? "2px solid #185FA5" : tersedia ? "1.5px solid #B5D4F4" : "1.5px solid #e0e0e0", background: dipilih ? "#185FA5" : tersedia ? "#fff" : "#f5f5f5", color: dipilih ? "#fff" : tersedia ? "#185FA5" : "#ccc" }}>
                                {hari}
                            </div>
                        );
                    })}
                </div>
                {jadwalDipilih.length === 0 && <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 10 }}>* Pilih minimal 1 hari</div>}
            </div>

            <div style={{ background: "#E6F1FB", borderRadius: 14, padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 13, color: "#185FA5", fontWeight: 600 }}>Total Pembayaran</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Paket {paket} · {jadwalDipilih.length} hari dipilih</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#042C53" }}>{formatRupiah(harga)}</div>
            </div>

            <button onClick={onNext} disabled={!bisaLanjut} style={{ width: "100%", padding: 14, background: !bisaLanjut ? "#B5D4F4" : "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: !bisaLanjut ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                Lanjut
            </button>
        </div>
    );
}

// ← SLOT JAM sekarang dari data guru, bukan hardcoded
function SlotJam({ hari, guruId, slotTersedia, slotDipilih, onPilih }) {
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        api.get(`/guru/${guruId}/booked-slots?hari=${hari}`)
            .then(res => setBookedSlots(res.data.booked_slots ?? []))
            .catch(() => setBookedSlots([]));
    }, [guruId, hari]);

    const selesai = (slot) => {
        const [h, m] = slot.split(":").map(Number);
        const totalMenit = h * 60 + m + 90;
        return `${String(Math.floor(totalMenit / 60)).padStart(2, "0")}:${String(totalMenit % 60).padStart(2, "0")}`;
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", marginBottom: 10 }}>{hari}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {slotTersedia.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>Tidak ada slot tersedia untuk hari ini</div>
                ) : slotTersedia.map((slot) => {
                    const booked = bookedSlots.includes(slot);
                    const dipilih = slotDipilih === slot;
                    return (
                        <div key={slot} onClick={() => !booked && onPilih(slot)} style={{ padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: booked ? "not-allowed" : "pointer", transition: "all 0.15s", border: dipilih ? "2px solid #185FA5" : booked ? "1.5px solid #e0e0e0" : "1.5px solid #B5D4F4", background: dipilih ? "#185FA5" : booked ? "#f5f5f5" : "#fff", color: dipilih ? "#fff" : booked ? "#ccc" : "#185FA5" }}>
                            {slot}
                            {!booked && <span style={{ fontSize: 10, color: dipilih ? "rgba(255,255,255,0.8)" : "#aaa", display: "block", marginTop: 1 }}>s/d {selesai(slot)}</span>}
                            {booked && <span style={{ fontSize: 10, color: "#ccc", display: "block", marginTop: 1 }}>Penuh</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Step2({ guru, jadwalDipilih, waktuMulai, setWaktuMulai, tanggalMulai, setTanggalMulai, catatan, setCatatan, onNext, onBack }) {
    const semuaSudahPilih = jadwalDipilih.every((hari) => waktuMulai[hari]);
    const tanggalValid = getTanggalValid(jadwalDipilih);
    const tanggalMin = getTanggalTerdekat(jadwalDipilih);
    const infoHari = jadwalDipilih.join(" & ");

    const handleTanggalChange = (e) => {
        const val = e.target.value;
        if (tanggalValid.has(val)) setTanggalMulai(val);
    };

    return (
        <div>
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 4 }}>Detail Jadwal</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ background: "#E6F1FB", color: "#185FA5", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>90 menit / sesi</span>
                    <span style={{ color: "#ccc" }}>·</span>
                    <span style={{ background: "#FEF3E2", color: "#633806", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>45 menit jeda antar sesi</span>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={s.label}>Tanggal Mulai</label>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                        Hanya bisa memilih hari <strong style={{ color: "#185FA5" }}>{infoHari}</strong> · mulai besok
                    </div>
                    <input
                        type="date" value={tanggalMulai} min={tanggalMin}
                        onChange={handleTanggalChange}
                        style={{ ...s.input, borderColor: tanggalMulai && !tanggalValid.has(tanggalMulai) ? "#E24B4A" : "#e0e0e0" }}
                        onFocus={(e) => (e.target.style.borderColor = "#185FA5")}
                        onBlur={(e) => (e.target.style.borderColor = tanggalMulai && !tanggalValid.has(tanggalMulai) ? "#E24B4A" : "#e0e0e0")}
                    />
                    {tanggalMulai && !tanggalValid.has(tanggalMulai) && (
                        <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 6 }}>⚠ Tanggal ini bukan hari {infoHari}. Pilih tanggal yang sesuai.</div>
                    )}
                    {tanggalMin && (
                        <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                            Tanggal terdekat: <strong>{new Date(tanggalMin + 'T00:00:00').toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</strong>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label style={s.label}>Pilih Slot Jam per Hari</label>
                    <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>Slot abu-abu sudah dibooking siswa lain</div>
                    {jadwalDipilih.map((hari) => (
                        <SlotJam
                            key={hari}
                            hari={hari}
                            guruId={guru.id}
                            slotTersedia={guru.slot_jam_per_hari?.[hari] ?? []}
                            slotDipilih={waktuMulai[hari] ?? null}
                            onPilih={(slot) => setWaktuMulai({ ...waktuMulai, [hari]: slot })}
                        />
                    ))}
                </div>

                <div>
                    <label style={s.label}>Catatan untuk Guru <span style={{ fontWeight: 400, color: "#aaa" }}>(opsional)</span></label>
                    <textarea placeholder="Contoh: fokus ke bab trigonometri, persiapan ujian tengah semester..." rows={3} value={catatan} onChange={(e) => setCatatan(e.target.value)} style={{ ...s.input, resize: "none" }} onFocus={(e) => (e.target.style.borderColor = "#185FA5")} onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <button onClick={onBack} style={{ padding: 14, background: "none", border: "1px solid #B5D4F4", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#185FA5", cursor: "pointer", fontFamily: "inherit" }}>Kembali</button>
                <button onClick={onNext} disabled={!tanggalMulai || !tanggalValid.has(tanggalMulai) || !semuaSudahPilih} style={{ padding: 14, background: (!tanggalMulai || !tanggalValid.has(tanggalMulai) || !semuaSudahPilih) ? "#B5D4F4" : "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: (!tanggalMulai || !tanggalValid.has(tanggalMulai) || !semuaSudahPilih) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Lanjut ke Pembayaran</button>
            </div>
        </div>
    );
}

function QrisGimmick({ nominal }) {
    const seed = nominal.toString();
    const cells = [];
    const SIZE = 21;

    const isFinderPattern = (r, c) => {
        const corners = [[0, 0], [0, SIZE - 7], [SIZE - 7, 0]];
        return corners.some(([br, bc]) => r >= br && r < br + 7 && c >= bc && c < bc + 7 &&
            ((r === br || r === br + 6 || c === bc || c === bc + 6) ||
                (r >= br + 2 && r <= br + 4 && c >= bc + 2 && c <= bc + 4)));
    };

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (isFinderPattern(r, c)) {
                cells.push({ r, c, dark: true });
            } else {
                const idx = (r * SIZE + c + parseInt(seed.slice(-4) || "1234")) % 7;
                cells.push({ r, c, dark: idx < 3 });
            }
        }
    }

    const cellSize = 7;
    const totalSize = SIZE * cellSize + 32;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ background: "#fff", border: "2px solid #E6F1FB", borderRadius: 16, padding: 20, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#E24B4A" }}>QRIS</div>
                    <div style={{ flex: 1, height: 1, background: "#E6F1FB" }} />
                    <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>Synau</div>
                </div>
                <svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`} xmlns="http://www.w3.org/2000/svg">
                    <rect width={totalSize} height={totalSize} fill="white" />
                    {cells.map(({ r, c, dark }) => dark && (
                        <rect key={`${r}-${c}`} x={16 + c * cellSize} y={16 + r * cellSize} width={cellSize - 1} height={cellSize - 1} rx={0.5} fill="#1a1a1a" />
                    ))}
                </svg>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Total Pembayaran</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#042C53" }}>{formatRupiah(nominal)}</div>
                </div>
                <div style={{ background: "#f5f8ff", borderRadius: 10, padding: "8px 16px", width: "100%", boxSizing: "border-box" }}>
                    <div style={{ fontSize: 11, color: "#888", textAlign: "center" }}>Scan dengan aplikasi m-banking atau e-wallet apapun</div>
                </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", animation: "pulse 1.5s infinite" }} />
                QR aktif · berlaku 15 menit
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
    );
}

function Step3({ guru, paket, mapelDipilih, jadwalDipilih, waktuMulai, tanggalMulai, catatan, onSubmit, onBack, loading }) {
    const harga = paket === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;
    const [sudahBayar, setSudahBayar] = useState(false);

    const handleSudahBayar = () => {
        setSudahBayar(true);
        onSubmit();
    };

    return (
        <div>
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Ringkasan Booking</div>
                {[
                    { label: "Guru", nilai: guru.nama },
                    { label: "Mata Pelajaran", nilai: mapelDipilih },
                    { label: "Paket", nilai: paket.charAt(0).toUpperCase() + paket.slice(1) },
                    { label: "Hari Belajar", nilai: jadwalDipilih.join(", ") },
                    { label: "Tanggal Mulai", nilai: new Date(tanggalMulai + 'T00:00:00').toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                ].map(({ label, nilai }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #E6F1FB" }}>
                        <div style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53", textAlign: "right", maxWidth: "60%" }}>{nilai}</div>
                    </div>
                ))}
                {jadwalDipilih.map((hari) => waktuMulai[hari] && (
                    <div key={hari} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #E6F1FB" }}>
                        <div style={{ fontSize: 13, color: "#888" }}>Waktu {hari}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{waktuMulai[hari]} WIB</div>
                    </div>
                ))}
                {catatan && (
                    <div style={{ padding: "12px 0", borderBottom: "1px solid #E6F1FB" }}>
                        <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Catatan</div>
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{catatan}</div>
                    </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>Total Pembayaran</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#185FA5" }}>{formatRupiah(harga)}</div>
                </div>
            </div>

            <div style={{ ...s.card, textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 4 }}>Pembayaran via QRIS</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Scan QR di bawah menggunakan aplikasi m-banking atau e-wallet kamu</div>
                <QrisGimmick nominal={harga} />
                <div style={{ marginTop: 24, padding: "14px", background: "#FEF3E2", borderRadius: 12, fontSize: 13, color: "#633806", fontWeight: 600 }}>
                    ⚠️ Pastikan nominal yang dibayar sesuai: <strong>{formatRupiah(harga)}</strong>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <button onClick={onBack} disabled={loading} style={{ padding: 14, background: "none", border: "1px solid #B5D4F4", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#185FA5", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    Kembali
                </button>
                <button onClick={handleSudahBayar} disabled={loading || sudahBayar} style={{ padding: 14, background: loading || sudahBayar ? "#B5D4F4" : "#1D9E75", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading || sudahBayar ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s" }}>
                    {loading ? "Memproses..." : sudahBayar ? "Memverifikasi..." : "✓ Sudah Bayar"}
                </button>
            </div>
        </div>
    );
}

function BookingBerhasil({ guru, onKeDashboard }) {
    return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>✓</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", marginBottom: 8 }}>Booking Berhasil!</div>
            <div style={{ fontSize: 14, color: "#888", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 32px" }}>
                Pembayaran diterima. Permintaan booking kamu ke <strong style={{ color: "#042C53" }}>{guru.nama}</strong> telah terkirim. Guru akan mengkonfirmasi jadwal dalam 1×24 jam.
            </div>
            <button onClick={onKeDashboard} style={{ padding: "12px 32px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Kembali ke Dashboard
            </button>
        </div>
    );
}

export default function Booking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const siswa = JSON.parse(localStorage.getItem('user')) ?? {};
    const inisialSiswa = siswa?.nama_panggilan?.[0]?.toUpperCase() ?? siswa?.name?.[0]?.toUpperCase() ?? "S";

    const guruDariState = location.state?.guru ?? mockFallbackGuru;
    const paketDariState = location.state?.paket ?? "mingguan";

    const [step, setStep] = useState(0);
    const [guru] = useState(guruDariState);
    const [paket, setPaket] = useState(paketDariState);
    const [mapelDipilih, setMapelDipilih] = useState("");
    const [jadwalDipilih, setJadwalDipilih] = useState([]);
    const [waktuMulai, setWaktuMulai] = useState({});
    const [tanggalMulai, setTanggalMulai] = useState("");
    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);
    const [berhasil, setBerhasil] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            await api.post('/booking', {
                guru_id: guru.id,
                paket: paket,
                mata_pelajaran: mapelDipilih,
                hari_dipilih: jadwalDipilih,
                waktu_mulai: waktuMulai,
                tanggal_mulai: tanggalMulai,
                catatan: catatan || null,
            });
            setBerhasil(true);
        } catch (err) {
            setError(err.response?.data?.message || "Booking gagal, coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", fontFamily: "inherit" }}>
                        ← Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                    {inisialSiswa}
                </div>
            </nav>

            <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px", marginBottom: 8 }}>Booking Sesi Belajar</div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Lengkapi informasi booking kamu</div>

                {!berhasil && <StepIndicator aktif={step} />}

                {error && (
                    <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#B91C1C", marginBottom: 20, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                {berhasil ? (
                    <BookingBerhasil guru={guru} onKeDashboard={() => navigate("/dashboard")} />
                ) : step === 0 ? (
                    <Step1
                        guru={guru} paket={paket} setPaket={setPaket}
                        mapelDipilih={mapelDipilih} setMapelDipilih={setMapelDipilih}
                        jadwalDipilih={jadwalDipilih} setJadwalDipilih={setJadwalDipilih}
                        onNext={() => setStep(1)}
                    />
                ) : step === 1 ? (
                    <Step2
                        guru={guru} jadwalDipilih={jadwalDipilih}
                        waktuMulai={waktuMulai} setWaktuMulai={setWaktuMulai}
                        tanggalMulai={tanggalMulai} setTanggalMulai={setTanggalMulai}
                        catatan={catatan} setCatatan={setCatatan}
                        onNext={() => setStep(2)} onBack={() => setStep(0)}
                    />
                ) : (
                    <Step3
                        guru={guru} paket={paket} mapelDipilih={mapelDipilih}
                        jadwalDipilih={jadwalDipilih} waktuMulai={waktuMulai}
                        tanggalMulai={tanggalMulai} catatan={catatan}
                        onSubmit={handleSubmit} onBack={() => setStep(1)} loading={loading}
                    />
                )}
            </div>
        </div>
    );
}