import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// ============================================================
// HELPERS
// ============================================================
const HARI_URUT = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

// ============================================================
// MOCK DATA FALLBACK
// ============================================================
const mockFallbackGuru = {
    id: 1, inisial: "BW", nama: "Bu Wulandari, S.Pd", mapel: "Matematika",
    kota: "Yogyakarta", rating: 4.9, warnaBg: "#185FA5", warnaText: "#fff",
    jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"],
    harga: { mingguan: 150000, bulanan: 500000, sesiPerMinggu: 2, menitPerSesi: 90 },
};

// ============================================================
// STYLES
// ============================================================
const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24, marginBottom: 20 },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 },
    input: { width: "100%", padding: "10px 14px", border: "1.5px solid #e0e0e0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
};

// ============================================================
// STEP INDICATOR
// ============================================================
const steps = ["Pilih Paket", "Detail Jadwal", "Konfirmasi"];

function StepIndicator({ aktif }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            {steps.map((step, i) => {
                const selesai = i < aktif;
                const aktifStep = i === aktif;
                return (
                    <div key={step} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                                background: selesai ? "#1D9E75" : aktifStep ? "#185FA5" : "#E6F1FB",
                                color: selesai || aktifStep ? "#fff" : "#aaa",
                            }}>
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

// ============================================================
// STEP 1 — PILIH PAKET
// ============================================================
function Step1({ guru, paket, setPaket, jadwalDipilih, setJadwalDipilih, onNext }) {
    const harga = paket === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;

    const maxHari = paket === "mingguan" ? 2 : 3;

    const toggleJadwal = (hari) => {
        setJadwalDipilih((prev) => {
            if (prev.includes(hari)) return prev.filter((h) => h !== hari);
            if (prev.length >= maxHari) return prev; // sudah mencapai batas
            return [...prev, hari];
        });
    };

    return (
        <div>
            {/* Info Guru */}
            <div style={s.card}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>Guru Dipilih</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: guru.warnaBg, color: guru.warnaText, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                        {guru.inisial}
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{guru.mapel} · {guru.kota}</div>
                    </div>
                    <span style={{ marginLeft: "auto", ...s.badge("#E6F1FB", "#0C447C") }}>★ {guru.rating}</span>
                </div>
            </div>

            {/* Pilih Paket */}
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Pilih Paket Belajar</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {["mingguan", "bulanan"].map((p) => {
                        const hargaP = p === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;
                        const aktif = paket === p;
                        return (
                            <div
                                key={p}
                                onClick={() => { setPaket(p); setJadwalDipilih([]); }}
                                style={{
                                    border: aktif ? "2px solid #185FA5" : "1.5px solid #B5D4F4",
                                    borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.2s",
                                    background: aktif ? "#f0f7ff" : "#fff",
                                    position: "relative",
                                }}
                            >
                                {p === "bulanan" && (
                                    <div style={{ position: "absolute", top: -10, right: 12, background: "#1D9E75", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>
                                        Hemat 17%
                                    </div>
                                )}
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", marginBottom: 8, textTransform: "capitalize" }}>{p}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#185FA5", marginBottom: 6 }}>{formatRupiah(hargaP)}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>
                                    {guru.harga.sesiPerMinggu}x sesi / {p === "mingguan" ? "minggu" : "bulan"}
                                </div>
                                <div style={{ fontSize: 12, color: "#888" }}>{guru.harga.menitPerSesi} menit / sesi</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pilih Hari */}
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Pilih Hari Belajar</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                    Paket {paket} maksimal <strong>{maxHari} hari</strong> · terpilih {jadwalDipilih.length}/{maxHari}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {HARI_URUT.map((hari) => {
                        const tersedia = guru.jadwal.includes(hari);
                        const dipilih = jadwalDipilih.includes(hari);
                        return (
                            <div
                                key={hari}
                                onClick={() => tersedia && toggleJadwal(hari)}
                                style={{
                                    padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                                    cursor: tersedia ? "pointer" : "not-allowed", transition: "all 0.15s",
                                    border: dipilih ? "2px solid #185FA5" : tersedia ? "1.5px solid #B5D4F4" : "1.5px solid #e0e0e0",
                                    background: dipilih ? "#185FA5" : tersedia ? "#fff" : "#f5f5f5",
                                    color: dipilih ? "#fff" : tersedia ? "#185FA5" : "#ccc",
                                }}
                            >
                                {hari}
                            </div>
                        );
                    })}
                </div>
                {jadwalDipilih.length === 0 && (
                    <div style={{ fontSize: 12, color: "#E24B4A", marginTop: 10 }}>* Pilih minimal 1 hari</div>
                )}
            </div>

            {/* Ringkasan harga */}
            <div style={{ background: "#E6F1FB", borderRadius: 14, padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 13, color: "#185FA5", fontWeight: 600 }}>Total Pembayaran</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Paket {paket} · {jadwalDipilih.length} hari dipilih</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#042C53" }}>{formatRupiah(harga)}</div>
            </div>

            <button
                onClick={onNext}
                disabled={jadwalDipilih.length === 0}
                style={{
                    width: "100%", padding: 14, background: jadwalDipilih.length === 0 ? "#B5D4F4" : "#185FA5",
                    color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                    cursor: jadwalDipilih.length === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}
            >
                Lanjut
            </button>
        </div>
    );
}

// ============================================================
// SLOT JAM — generate otomatis, beberapa di-mock sebagai sudah dibooking
// Durasi sesi: 90 menit, jeda: 45 menit → total 135 menit antar slot
// Slot: 08:00, 10:15, 12:30, 14:45, 17:00
// ============================================================
const SLOT_JAM = ["08:00", "10:15", "12:30", "14:45", "17:00"];

// Mock slot yang sudah dibooking per hari — nanti dari API Laravel
// GET /api/guru/:id/booked-slots?hari=Senin
const mockBookedSlots = {
    Senin: ["10:15", "14:45"],
    Selasa: ["08:00"],
    Rabu: ["12:30", "17:00"],
    Kamis: [],
    Jumat: ["08:00", "10:15"],
    Sabtu: ["14:45"],
    Minggu: [],
};

function SlotJam({ hari, slotDipilih, onPilih }) {
    const bookedSlots = mockBookedSlots[hari] ?? [];
    const selesai = (slot) => {
        const [h, m] = slot.split(":").map(Number);
        const totalMenit = h * 60 + m + 90;
        return `${String(Math.floor(totalMenit / 60)).padStart(2, "0")}:${String(totalMenit % 60).padStart(2, "0")}`;
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", marginBottom: 10 }}>{hari}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SLOT_JAM.map((slot) => {
                    const booked = bookedSlots.includes(slot);
                    const dipilih = slotDipilih === slot;
                    return (
                        <div
                            key={slot}
                            onClick={() => !booked && onPilih(slot)}
                            style={{
                                padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                                cursor: booked ? "not-allowed" : "pointer", transition: "all 0.15s",
                                border: dipilih ? "2px solid #185FA5" : booked ? "1.5px solid #e0e0e0" : "1.5px solid #B5D4F4",
                                background: dipilih ? "#185FA5" : booked ? "#f5f5f5" : "#fff",
                                color: dipilih ? "#fff" : booked ? "#ccc" : "#185FA5",
                                position: "relative",
                            }}
                        >
                            {slot}
                            {!booked && (
                                <span style={{ fontSize: 10, color: dipilih ? "rgba(255,255,255,0.8)" : "#aaa", display: "block", marginTop: 1 }}>
                                    s/d {selesai(slot)}
                                </span>
                            )}
                            {booked && (
                                <span style={{ fontSize: 10, color: "#ccc", display: "block", marginTop: 1 }}>Penuh</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// STEP 2 — DETAIL JADWAL
// ============================================================
function Step2({ jadwalDipilih, waktuMulai, setWaktuMulai, tanggalMulai, setTanggalMulai, catatan, setCatatan, onNext, onBack }) {
    const semuaSudahPilih = jadwalDipilih.every((hari) => waktuMulai[hari]);

    return (
        <div>
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 4 }}>Detail Jadwal</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ background: "#E6F1FB", color: "#185FA5", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>90 menit / sesi</span>
                    <span style={{ color: "#ccc" }}>·</span>
                    <span style={{ background: "#FEF3E2", color: "#633806", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6 }}>45 menit jeda antar sesi</span>
                </div>

                {/* Tanggal mulai */}
                <div style={{ marginBottom: 20 }}>
                    <label style={s.label}>Tanggal Mulai</label>
                    <input
                        type="date"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        style={s.input}
                        onFocus={(e) => (e.target.style.borderColor = "#185FA5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                </div>

                {/* Slot jam per hari */}
                <div style={{ marginBottom: 8 }}>
                    <label style={s.label}>Pilih Slot Jam per Hari</label>
                    <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>Slot abu-abu sudah dibooking siswa lain</div>
                    {jadwalDipilih.map((hari) => (
                        <SlotJam
                            key={hari}
                            hari={hari}
                            slotDipilih={waktuMulai[hari] ?? null}
                            onPilih={(slot) => setWaktuMulai({ ...waktuMulai, [hari]: slot })}
                        />
                    ))}
                </div>

                {/* Catatan */}
                <div>
                    <label style={s.label}>Catatan untuk Guru <span style={{ fontWeight: 400, color: "#aaa" }}>(opsional)</span></label>
                    <textarea
                        placeholder="Contoh: fokus ke bab trigonometri, persiapan ujian tengah semester..."
                        rows={3}
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        style={{ ...s.input, resize: "none" }}
                        onFocus={(e) => (e.target.style.borderColor = "#185FA5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                    />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <button onClick={onBack} style={{ padding: 14, background: "none", border: "1px solid #B5D4F4", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#185FA5", cursor: "pointer", fontFamily: "inherit" }}>
                    Kembali
                </button>
                <button
                    onClick={onNext}
                    disabled={!tanggalMulai || !semuaSudahPilih}
                    style={{ padding: 14, background: (!tanggalMulai || !semuaSudahPilih) ? "#B5D4F4" : "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: (!tanggalMulai || !semuaSudahPilih) ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                >
                    Lanjut
                </button>
            </div>
        </div>
    );
}

// ============================================================
// STEP 3 — KONFIRMASI
// ============================================================
function Step3({ guru, paket, jadwalDipilih, waktuMulai, tanggalMulai, catatan, onSubmit, onBack, loading }) {
    const harga = paket === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;

    return (
        <div>
            <div style={s.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Ringkasan Booking</div>

                {[
                    { label: "Guru", nilai: guru.nama },
                    { label: "Mata Pelajaran", nilai: guru.mapel },
                    { label: "Paket", nilai: paket.charAt(0).toUpperCase() + paket.slice(1) },
                    { label: "Hari Belajar", nilai: jadwalDipilih.join(", ") },
                    { label: "Tanggal Mulai", nilai: new Date(tanggalMulai).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, marginTop: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>Total Pembayaran</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#185FA5" }}>{formatRupiah(harga)}</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <button onClick={onBack} style={{ padding: 14, background: "none", border: "1px solid #B5D4F4", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#185FA5", cursor: "pointer", fontFamily: "inherit" }}>
                    Kembali
                </button>
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    style={{ padding: 14, background: loading ? "#B5D4F4" : "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                >
                    {loading ? "Memproses..." : "Konfirmasi Booking"}
                </button>
            </div>
        </div>
    );
}

// ============================================================
// SUKSES
// ============================================================
function BookingBerhasil({ guru, onKeDashboard }) {
    return (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>✓</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", marginBottom: 8 }}>Booking Berhasil!</div>
            <div style={{ fontSize: 14, color: "#888", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 32px" }}>
                Permintaan booking kamu ke <strong style={{ color: "#042C53" }}>{guru.nama}</strong> telah terkirim. Guru akan mengkonfirmasi jadwal dalam 1×24 jam.
            </div>
            <button
                onClick={onKeDashboard}
                style={{ padding: "12px 32px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
                Kembali ke Dashboard
            </button>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Booking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const guruDariState = location.state?.guru ?? mockFallbackGuru;
    const paketDariState = location.state?.paket ?? "mingguan";
    const jadwalDariState = location.state?.jadwalDipilih ?? [];

    const [step, setStep] = useState(0);
    const [guru] = useState(guruDariState);
    const [paket, setPaket] = useState(paketDariState);
    const [jadwalDipilih, setJadwalDipilih] = useState(jadwalDariState);
    const [waktuMulai, setWaktuMulai] = useState({});
    const [tanggalMulai, setTanggalMulai] = useState("");
    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);
    const [berhasil, setBerhasil] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        // TODO: ganti dengan API call ke Laravel
        // const payload = { guruId: guru.id, paket, jadwalDipilih, waktuMulai, tanggalMulai, catatan };
        // await api.post('/api/booking', payload);
        setTimeout(() => {
            setLoading(false);
            setBerhasil(true);
        }, 1500);
    };

    return (
        <div style={s.page}>
            {/* NAVBAR */}
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", fontFamily: "inherit" }}
                    >
                        Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                    BS
                </div>
            </nav>

            <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px", marginBottom: 8 }}>Booking Sesi Belajar</div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Lengkapi informasi booking kamu</div>

                {!berhasil && <StepIndicator aktif={step} />}

                {berhasil ? (
                    <BookingBerhasil guru={guru} onKeDashboard={() => navigate("/dashboard")} />
                ) : step === 0 ? (
                    <Step1
                        guru={guru} paket={paket} setPaket={setPaket}
                        jadwalDipilih={jadwalDipilih} setJadwalDipilih={setJadwalDipilih}
                        onNext={() => setStep(1)}
                    />
                ) : step === 1 ? (
                    <Step2
                        jadwalDipilih={jadwalDipilih}
                        waktuMulai={waktuMulai} setWaktuMulai={setWaktuMulai}
                        tanggalMulai={tanggalMulai} setTanggalMulai={setTanggalMulai}
                        catatan={catatan} setCatatan={setCatatan}
                        onNext={() => setStep(2)} onBack={() => setStep(0)}
                    />
                ) : (
                    <Step3
                        guru={guru} paket={paket} jadwalDipilih={jadwalDipilih}
                        waktuMulai={waktuMulai} tanggalMulai={tanggalMulai} catatan={catatan}
                        onSubmit={handleSubmit} onBack={() => setStep(1)} loading={loading}
                    />
                )}
            </div>
        </div>
    );
}