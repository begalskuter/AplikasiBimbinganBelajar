import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// MOCK DATA — nanti ganti dengan API call ke Laravel
// ============================================================
const mockSiswa = {
    nama: "Budi Santoso",
    namaPanggilan: "Budi",
    kota: "Yogyakarta",
    inisial: "BS",
};

const mockGuruTerbaik = [
    { id: 1, inisial: "BW", nama: "Bu Wulandari, S.Pd", mapel: "Matematika", rating: 4.9, kota: "Yogyakarta", jarak: "2km", warnaBg: "#185FA5", warnaText: "#fff" },
    { id: 2, inisial: "AP", nama: "Pak Andi Prasetyo", mapel: "Fisika", rating: 4.8, kota: "Yogyakarta", jarak: "4km", warnaBg: "#B5D4F4", warnaText: "#0C447C" },
    { id: 3, inisial: "SR", nama: "Bu Sari Rahayu", mapel: "Bahasa Inggris", rating: 4.8, kota: "Sleman", jarak: "6km", warnaBg: "#9FE1CB", warnaText: "#085041" },
    { id: 4, inisial: "DH", nama: "Bu Dewi Hartini", mapel: "IPA & Biologi", rating: 4.7, kota: "Bantul", jarak: "8km", warnaBg: "#FAC775", warnaText: "#633806" },
    { id: 5, inisial: "RP", nama: "Pak Rudi Prasetyo, M.Pd", mapel: "Matematika", rating: 4.7, kota: "Yogyakarta", jarak: "3km", warnaBg: "#B5D4F4", warnaText: "#0C447C" },
    { id: 6, inisial: "NA", nama: "Bu Nisa Aulia", mapel: "Kimia", rating: 4.6, kota: "Sleman", jarak: "5km", warnaBg: "#9FE1CB", warnaText: "#085041" },
    { id: 7, inisial: "FH", nama: "Pak Fajar Hidayat", mapel: "Fisika", rating: 4.6, kota: "Bantul", jarak: "7km", warnaBg: "#FAC775", warnaText: "#633806" },
    { id: 8, inisial: "LM", nama: "Bu Laila Munawaroh, S.Pd", mapel: "Bahasa Indonesia", rating: 4.5, kota: "Yogyakarta", jarak: "9km", warnaBg: "#185FA5", warnaText: "#fff" },
    { id: 9, inisial: "YP", nama: "Pak Yoga Pratama", mapel: "Matematika", rating: 4.5, kota: "Sleman", jarak: "10km", warnaBg: "#B5D4F4", warnaText: "#0C447C" },
    { id: 10, inisial: "RI", nama: "Bu Rina Indrawati, M.Pd", mapel: "Bahasa Inggris", rating: 4.5, kota: "Bantul", jarak: "11km", warnaBg: "#9FE1CB", warnaText: "#085041" },
    { id: 11, inisial: "TS", nama: "Pak Taufik Setiawan", mapel: "Kimia", rating: 4.4, kota: "Yogyakarta", jarak: "5km", warnaBg: "#FAC775", warnaText: "#633806" },
    { id: 12, inisial: "AS", nama: "Bu Ayu Setyaningsih", mapel: "IPA & Biologi", rating: 4.4, kota: "Sleman", jarak: "7km", warnaBg: "#185FA5", warnaText: "#fff" },
    { id: 13, inisial: "BH", nama: "Pak Bagas Hernawan", mapel: "Fisika", rating: 4.3, kota: "Bantul", jarak: "12km", warnaBg: "#B5D4F4", warnaText: "#0C447C" },
    { id: 14, inisial: "MR", nama: "Bu Mega Ratnasari, S.Pd", mapel: "Bahasa Indonesia", rating: 4.3, kota: "Yogyakarta", jarak: "6km", warnaBg: "#9FE1CB", warnaText: "#085041" },
    { id: 15, inisial: "DF", nama: "Pak Dimas Firmansyah", mapel: "Matematika", rating: 4.3, kota: "Sleman", jarak: "8km", warnaBg: "#FAC775", warnaText: "#633806" },
    { id: 16, inisial: "PN", nama: "Bu Putri Ningrum", mapel: "Kimia", rating: 4.2, kota: "Bantul", jarak: "13km", warnaBg: "#185FA5", warnaText: "#fff" },
    { id: 17, inisial: "HW", nama: "Pak Hendra Wijaya, M.Pd", mapel: "Fisika", rating: 4.2, kota: "Yogyakarta", jarak: "4km", warnaBg: "#B5D4F4", warnaText: "#0C447C" },
    { id: 18, inisial: "EK", nama: "Bu Eka Kurniawati", mapel: "Bahasa Inggris", rating: 4.1, kota: "Sleman", jarak: "14km", warnaBg: "#9FE1CB", warnaText: "#085041" },
];

const mockGuruFavorit = {
    id: 1, inisial: "BW", nama: "Bu Wulandari", mapel: "Matematika", rating: 4.9, totalSesi: 5,
    warnaBg: "#185FA5", warnaText: "#fff",
};

const mockJadwal = [
    { id: 1, guruId: 1, mapel: "Matematika", guru: "Bu Wulandari", tanggal: "23", bulan: "Mei", waktu: "15.00–17.00", label: "Besok", labelBg: "#E1F5EE", labelColor: "#0F6E56" },
    { id: 2, guruId: 2, mapel: "Fisika", guru: "Pak Andi", tanggal: "26", bulan: "Mei", waktu: "13.00–15.00", label: "Sabtu", labelBg: "#E6F1FB", labelColor: "#0C447C" },
];

const filterMapel = ["Semua", "Matematika", "Fisika", "Bahasa Inggris", "IPA", "Biologi"];

// ============================================================
// STYLES
// ============================================================
const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    avatar: { width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24 },
    guruCard: { background: "#fff", border: "1px solid #B5D4F4", borderRadius: 14, padding: 18, cursor: "pointer", transition: "all 0.2s" },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    btn: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
};

// ============================================================
// SUB-COMPONENTS
// ============================================================
function Navbar({ siswa, onLogout }) {
    return (
        <nav style={s.navbar}>
            <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "#555" }}>
                    Halo, <strong style={{ color: "#042C53" }}>{siswa.namaPanggilan}</strong>!
                </span>
                <div style={s.avatar}>{siswa.inisial}</div>
                <button onClick={onLogout} style={{ background: "none", border: "1px solid #e0e0e0", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
                    Keluar
                </button>
            </div>
        </nav>
    );
}

function SearchSection({ query, setQuery, filterAktif, setFilterAktif }) {
    return (
        <div style={{ ...s.card, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 14 }}>Cari Guru</div>
            <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 16 }}>🔍</span>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nama guru atau mata pelajaran..."
                    style={{ width: "100%", padding: "11px 16px 11px 42px", border: "1.5px solid #e0e0e0", borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#185FA5")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {filterMapel.map((f) => (
                    <span
                        key={f}
                        onClick={() => setFilterAktif(f)}
                        style={{
                            ...s.badge(filterAktif === f ? "#185FA5" : "#E6F1FB", filterAktif === f ? "#fff" : "#0C447C"),
                            cursor: "pointer",
                            fontSize: 12,
                            padding: "5px 14px",
                            transition: "all 0.15s",
                        }}
                    >
                        {f}
                    </span>
                ))}
            </div>
        </div>
    );
}

function GuruCard({ guru, isTop, onLihat }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{
                ...s.guruCard,
                border: isTop ? "2px solid #185FA5" : "1px solid #B5D4F4",
                position: "relative",
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered ? "0 8px 24px rgba(24,95,165,0.1)" : "none",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isTop && (
                <div style={{ position: "absolute", top: -11, left: 14, background: "#185FA5", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>
                    #1 Terbaik
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, marginTop: isTop ? 6 : 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: guru.warnaBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: guru.warnaText, flexShrink: 0 }}>
                    {guru.inisial}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.mapel}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{guru.kota} · {guru.jarak}</span>
            </div>
            <button
                onClick={() => onLihat(guru)}
                style={{ ...s.btn, width: "100%", marginTop: 12, padding: "9px" }}
            >
                Lihat Profil
            </button>
        </div>
    );
}

function SesiMendatang({ jadwal }) {
    return (
        <div style={{ ...s.card, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>📅 Sesi Mendatang</div>
            {jadwal.length === 0 ? (
                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" }}>Belum ada sesi terjadwal.</p>
            ) : (
                jadwal.map((j, i) => (
                    <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < jadwal.length - 1 ? "1px solid #E6F1FB" : "none" }}>
                        <div style={{ width: 40, height: 40, background: "#E6F1FB", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#185FA5" }}>{j.tanggal}</div>
                            <div style={{ fontSize: 10, color: "#888" }}>{j.bulan}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{j.mapel}</div>
                            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{j.guru} · {j.waktu}</div>
                        </div>
                        <span style={s.badge(j.labelBg, j.labelColor)}>{j.label}</span>
                    </div>
                ))
            )}
        </div>
    );
}

function GuruFavorit({ guru, onLihat }) {
    return (
        <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>🏆 Guru Favoritmu</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#E6F1FB", borderRadius: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: guru.warnaBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: guru.warnaText, fontSize: 14, flexShrink: 0 }}>
                    {guru.inisial}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.totalSesi} sesi · ★ {guru.rating}</div>
                </div>
                <button onClick={() => onLihat(guru)} style={s.btn}>Lihat Profil</button>
            </div>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Dashboard() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filterAktif, setFilterAktif] = useState("Semua");

    // Filter mock data berdasarkan search & filter mapel
    // Nanti ganti bagian ini dengan data dari API Laravel
    const guruTampil = mockGuruTerbaik
        .filter((g) => {
            const cocokQuery = g.nama.toLowerCase().includes(query.toLowerCase()) || g.mapel.toLowerCase().includes(query.toLowerCase());
            const cocokFilter = filterAktif === "Semua" || g.mapel.toLowerCase().includes(filterAktif.toLowerCase());
            return cocokQuery && cocokFilter;
        })
        .slice(0, 4); // Tampilkan maks 4 di dashboard, sisanya di halaman Cari Guru

    const handleLihatProfil = (guru) => {
        // Navigasi ke halaman detail guru, bawa data guru via state
        navigate(`/guru/${guru.id}`, { state: { guru } });
    };

    const handleLogout = () => {
        // TODO: clear token/session, lalu redirect ke landing page
        navigate("/");
    };

    return (
        <div style={s.page}>
            <Navbar siswa={mockSiswa} onLogout={handleLogout} />

            <div style={s.container}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>
                        Selamat datang, {mockSiswa.namaPanggilan}! 👋
                    </h1>
                    <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                        Mau belajar apa hari ini? Temukan guru terbaik di sekitarmu.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

                    {/* KOLOM KIRI */}
                    <div>
                        <SearchSection
                            query={query}
                            setQuery={setQuery}
                            filterAktif={filterAktif}
                            setFilterAktif={setFilterAktif}
                        />

                        <div style={s.card}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>
                                    ★ Guru Terbaik di {mockSiswa.kota}
                                </div>
                                <span onClick={() => navigate("/cari-guru")} style={{ fontSize: 12, color: "#185FA5", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</span>
                            </div>

                            {guruTampil.length === 0 ? (
                                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>
                                    Guru tidak ditemukan. Coba kata kunci lain.
                                </p>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                                    {guruTampil.map((g, i) => (
                                        <GuruCard key={g.id} guru={g} isTop={i === 0 && filterAktif === "Semua" && query === ""} onLihat={handleLihatProfil} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <SesiMendatang jadwal={mockJadwal} />
                        <GuruFavorit guru={mockGuruFavorit} onLihat={handleLihatProfil} />
                    </div>

                </div>
            </div>
        </div>
    );
}