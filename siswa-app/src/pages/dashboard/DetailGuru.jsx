import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// ============================================================
// MOCK DATA — nanti ganti dengan API call ke Laravel
// GET /api/guru/:id
// ============================================================
const mockDetailGuru = {
    1: {
        id: 1, inisial: "BW", nama: "Bu Wulandari, S.Pd", mapel: "Matematika",
        kota: "Yogyakarta", rating: 4.9, totalUlasan: 48, totalSiswa: 120, kepuasan: 98,
        terverifikasi: true,
        bio: "Saya adalah guru matematika berpengalaman dengan lebih dari 5 tahun mengajar di tingkat SMP dan SMA. Metode saya berfokus pada pemahaman konsep dasar sebelum masuk ke soal yang lebih kompleks. Saya percaya setiap siswa bisa mahir matematika dengan pendekatan yang tepat dan sabar.",
        mataPelajaran: ["Matematika SMP", "Matematika SMA", "Aljabar", "Kalkulus Dasar", "Statistika"],
        jadwal: ["Senin", "Rabu", "Jumat", "Sabtu"],
        harga: { mingguan: 150000, bulanan: 500000, sesiPerMinggu: 2, menitPerSesi: 90 },
        ulasan: [
            { id: 1, inisial: "AR", nama: "Andi Rahmawan", waktu: "2 minggu lalu", bintang: 5, warnaBg: "#B5D4F4", warnaText: "#0C447C", komentar: "Bu Wulan sabar banget ngajarin dan cara menjelaskannya mudah dipahami. Nilai matematika saya naik signifikan setelah 2 bulan les!" },
            { id: 2, inisial: "DP", nama: "Dina Pratiwi", waktu: "1 bulan lalu", bintang: 5, warnaBg: "#9FE1CB", warnaText: "#085041", komentar: "Penjelasannya sistematis dan selalu kasih latihan soal yang relevan. Recommended banget!" },
            { id: 3, inisial: "RS", nama: "Rizky Santoso", waktu: "2 bulan lalu", bintang: 4, warnaBg: "#FAC775", warnaText: "#633806", komentar: "Guru yang sangat sabar dan bisa menyesuaikan metode belajar dengan kemampuan siswa." },
        ],
        warnaBg: "#185FA5", warnaText: "#fff",
    },
    2: {
        id: 2, inisial: "AP", nama: "Pak Andi Prasetyo", mapel: "Fisika",
        kota: "Yogyakarta", rating: 4.8, totalUlasan: 35, totalSiswa: 95, kepuasan: 96,
        terverifikasi: true,
        bio: "Guru fisika lulusan UGM dengan pengalaman mengajar 4 tahun. Saya menggunakan pendekatan eksperimen dan visualisasi agar konsep fisika lebih mudah dipahami. Spesialisasi di fisika SMA dan persiapan UTBK.",
        mataPelajaran: ["Fisika SMA", "Fisika Dasar", "Mekanika", "Termodinamika", "Persiapan UTBK"],
        jadwal: ["Selasa", "Kamis", "Sabtu", "Minggu"],
        harga: { mingguan: 140000, bulanan: 480000, sesiPerMinggu: 2, menitPerSesi: 90 },
        ulasan: [
            { id: 1, inisial: "BK", nama: "Bima Kurniawan", waktu: "1 minggu lalu", bintang: 5, warnaBg: "#B5D4F4", warnaText: "#0C447C", komentar: "Pak Andi ngajarnya asik, fisika yang tadinya susah jadi masuk akal!" },
            { id: 2, inisial: "LN", nama: "Laras Ningrum", waktu: "3 minggu lalu", bintang: 5, warnaBg: "#9FE1CB", warnaText: "#085041", komentar: "Persiapan UTBK fisika saya jauh lebih siap setelah belajar sama Pak Andi." },
        ],
        warnaBg: "#B5D4F4", warnaText: "#0C447C",
    },
};

// Fallback untuk guru yang belum ada mock detail-nya
const mockFallback = (guru) => ({
    ...guru,
    totalUlasan: 20, totalSiswa: 60, kepuasan: 95,
    terverifikasi: true,
    bio: `${guru.nama} adalah pengajar ${guru.mapel} berpengalaman di ${guru.kota}. Menggunakan metode yang menyenangkan dan mudah dipahami untuk semua tingkatan.`,
    mataPelajaran: [guru.mapel, `${guru.mapel} Dasar`, `${guru.mapel} Lanjutan`],
    jadwal: ["Senin", "Rabu", "Jumat"],
    harga: { mingguan: 120000, bulanan: 400000, sesiPerMinggu: 2, menitPerSesi: 90 },
    ulasan: [
        { id: 1, inisial: "AS", nama: "Andi Setiawan", waktu: "1 bulan lalu", bintang: 5, warnaBg: "#B5D4F4", warnaText: "#0C447C", komentar: "Guru yang sangat baik dan sabar. Materi disampaikan dengan jelas!" },
    ],
});

// ============================================================
// STYLES
// ============================================================
const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    avatar: (bg, color, size = 34) => ({ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.38, color: color, flexShrink: 0 }),
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24, marginBottom: 20 },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    chip: { display: "inline-flex", alignItems: "center", background: "#f0f4ff", color: "#185FA5", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, margin: "4px" },
};

function Bintang({ jumlah }) {
    return (
        <span style={{ color: "#F5C400", fontSize: 13, letterSpacing: 1 }}>
            {"★".repeat(jumlah)}{"☆".repeat(5 - jumlah)}
        </span>
    );
}

function BookingCard({ guru }) {
    const navigate = useNavigate();
    const [paket, setPaket] = useState("mingguan");

    const harga = paket === "mingguan" ? guru.harga.mingguan : guru.harga.bulanan;
    const hargaFormatted = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(harga);

    const handleBooking = () => {
        navigate(`/booking/${guru.id}`, {
            state: { guru, paket },
        });
    };

    return (
        <div style={{ ...s.card, position: "sticky", top: 80, marginBottom: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Pilih Paket</div>

            {/* Toggle paket */}
            <div style={{ display: "flex", background: "#f0f4ff", borderRadius: 10, padding: 4, marginBottom: 16 }}>
                {["mingguan", "bulanan"].map((p) => (
                    <div
                        key={p}
                        onClick={() => setPaket(p)}
                        style={{
                            flex: 1, padding: "8px", borderRadius: 8, textAlign: "center",
                            fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                            background: paket === p ? "#185FA5" : "transparent",
                            color: paket === p ? "#fff" : "#185FA5",
                        }}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </div>
                ))}
            </div>

            {/* Harga */}
            <div style={{ background: "#E6F1FB", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>
                    Harga {paket}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#042C53" }}>{hargaFormatted}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                    {guru.harga.sesiPerMinggu}x sesi / {paket === "mingguan" ? "minggu" : "bulan"} · {guru.harga.menitPerSesi} menit/sesi
                </div>
            </div>

            {/* Jadwal tersedia — read only */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Jadwal Tersedia</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>Pilihan hari bisa diatur saat booking</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {guru.jadwal.map((hari) => (
                        <div
                            key={hari}
                            style={{
                                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                                border: "1.5px solid #B5D4F4", background: "#E6F1FB", color: "#185FA5",
                            }}
                        >
                            {hari}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tombol */}
            <button
                onClick={handleBooking}
                style={{ width: "100%", padding: 13, background: "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}
            >
                Booking Sekarang
            </button>
            <button
                style={{ width: "100%", padding: 11, background: "none", border: "1px solid #B5D4F4", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#185FA5", cursor: "pointer", fontFamily: "inherit" }}
            >
                💬 Hubungi Guru
            </button>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DetailGuru() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    // Ambil data guru — dari state navigasi atau dari mock data
    // Nanti ganti dengan: useEffect(() => { axios.get(`/api/guru/${id}`).then(...) }, [id])
    const guruDariState = location.state?.guru;
    const guruDariMock = mockDetailGuru[parseInt(id)];
    const guru = guruDariMock ?? (guruDariState ? mockFallback(guruDariState) : null);

    if (!guru) {
        return (
            <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#042C53" }}>Guru tidak ditemukan</div>
                    <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: "8px 20px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            {/* NAVBAR */}
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", fontFamily: "inherit" }}
                    >
                        ← Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ ...s.avatar("#185FA5", "#fff"), fontSize: 13, fontWeight: 700 }}>BS</div>
            </nav>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

                {/* KOLOM KIRI */}
                <div>

                    {/* Header profil */}
                    <div style={s.card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                            <div style={s.avatar(guru.warnaBg, guru.warnaText, 80)}>
                                {guru.inisial}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>{guru.nama}</div>
                                <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{guru.mapel} · {guru.kota}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                                    <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating}</span>
                                    <span style={{ fontSize: 13, color: "#aaa" }}>{guru.totalUlasan} ulasan</span>
                                    {guru.terverifikasi && <span style={s.badge("#E1F5EE", "#085041")}>Terverifikasi ✓</span>}
                                </div>
                            </div>
                        </div>
                        {/* Statistik */}
                        <div style={{ display: "flex", gap: 32, paddingTop: 16, borderTop: "1px solid #E6F1FB" }}>
                            {[
                                { nilai: `${guru.totalSiswa}+`, label: "Siswa Diajar" },
                                { nilai: `${guru.kepuasan}%`, label: "Kepuasan Siswa" },
                            ].map(({ nilai, label }) => (
                                <div key={label} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: "#042C53" }}>{nilai}</div>
                                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tentang */}
                    <div style={s.card}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 12 }}>Tentang</div>
                        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75 }}>{guru.bio}</p>
                    </div>

                    {/* Mata Pelajaran */}
                    <div style={s.card}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 14 }}>Mata Pelajaran</div>
                        <div>
                            {guru.mataPelajaran.map((mp) => (
                                <span key={mp} style={s.chip}>{mp}</span>
                            ))}
                        </div>
                    </div>

                    {/* Ulasan */}
                    <div style={s.card}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>Ulasan Siswa</div>
                            <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating} · {guru.totalUlasan} ulasan</span>
                        </div>
                        {guru.ulasan.map((u, i) => (
                            <div key={u.id} style={{ padding: "16px 0", borderBottom: i < guru.ulasan.length - 1 ? "1px solid #E6F1FB" : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <div style={s.avatar(u.warnaBg, u.warnaText, 34)}>{u.inisial}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{u.nama}</div>
                                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{u.waktu}</div>
                                    </div>
                                    <div style={{ marginLeft: "auto" }}>
                                        <Bintang jumlah={u.bintang} />
                                    </div>
                                </div>
                                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{u.komentar}</p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* KOLOM KANAN */}
                <BookingCard guru={guru} />

            </div>
        </div>
    );
}