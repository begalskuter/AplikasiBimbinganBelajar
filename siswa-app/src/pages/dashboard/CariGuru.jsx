import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// MOCK DATA — nanti ganti dengan API call ke Laravel
// ============================================================
const mockSemuaGuru = [
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

const filterMapel = ["Semua", "Matematika", "Fisika", "Bahasa Inggris", "IPA", "Biologi", "Kimia", "Bahasa Indonesia"];
const filterKota = ["Semua Kota", "Yogyakarta", "Sleman", "Bantul"];
const sortOptions = [
    { value: "rating", label: "Rating Tertinggi" },
    { value: "jarak", label: "Jarak Terdekat" },
    { value: "nama", label: "Nama A–Z" },
];

// ============================================================
// STYLES
// ============================================================
const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    avatar: { width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    btn: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%" },
};

function GuruCard({ guru, onLihat }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #B5D4F4",
                borderRadius: 14,
                padding: 18,
                cursor: "pointer",
                transition: "all 0.2s",
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered ? "0 8px 24px rgba(24,95,165,0.1)" : "none",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: guru.warnaBg, color: guru.warnaText,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 14, flexShrink: 0
                }}>
                    {guru.inisial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.mapel}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{guru.kota} · {guru.jarak}</span>
            </div>
            <button onClick={() => onLihat(guru)} style={s.btn}>Lihat Profil</button>
        </div>
    );
}

export default function CariGuru() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filterAktif, setFilterAktif] = useState("Semua");
    const [kotaAktif, setKotaAktif] = useState("Semua Kota");
    const [sortBy, setSortBy] = useState("rating");

    const guruTampil = mockSemuaGuru
        .filter((g) => {
            const cocokQuery =
                g.nama.toLowerCase().includes(query.toLowerCase()) ||
                g.mapel.toLowerCase().includes(query.toLowerCase());
            const cocokMapel = filterAktif === "Semua" || g.mapel.toLowerCase().includes(filterAktif.toLowerCase());
            const cocokKota = kotaAktif === "Semua Kota" || g.kota === kotaAktif;
            return cocokQuery && cocokMapel && cocokKota;
        })
        .sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "jarak") return parseInt(a.jarak) - parseInt(b.jarak);
            if (sortBy === "nama") return a.nama.localeCompare(b.nama);
            return 0;
        });

    const handleLihatProfil = (guru) => {
        navigate(`/guru/${guru.id}`, { state: { guru } });
    };

    return (
        <div style={s.page}>
            {/* NAVBAR */}
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}
                    >
                        Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={s.avatar}>BS</div>
                </div>
            </nav>

            <div style={s.container}>
                {/* HEADER */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>Cari Guru</h1>
                    <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                        {guruTampil.length} guru ditemukan
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>

                    {/* SIDEBAR FILTER */}
                    <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 22, position: "sticky", top: 76 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Filter</div>

                        {/* Search */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 8 }}>Cari</label>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 14 }}>🔍</span>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Nama atau mata pelajaran..."
                                    style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid #e0e0e0", borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                                    onFocus={(e) => (e.target.style.borderColor = "#185FA5")}
                                    onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                                />
                            </div>
                        </div>

                        {/* Filter Mapel */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 10 }}>Mata Pelajaran</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {filterMapel.map((f) => (
                                    <div
                                        key={f}
                                        onClick={() => setFilterAktif(f)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            fontSize: 13,
                                            fontWeight: filterAktif === f ? 700 : 500,
                                            cursor: "pointer",
                                            background: filterAktif === f ? "#E6F1FB" : "transparent",
                                            color: filterAktif === f ? "#185FA5" : "#555",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filter Kota */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 10 }}>Kota</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {filterKota.map((k) => (
                                    <div
                                        key={k}
                                        onClick={() => setKotaAktif(k)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            fontSize: 13,
                                            fontWeight: kotaAktif === k ? 700 : 500,
                                            cursor: "pointer",
                                            background: kotaAktif === k ? "#E6F1FB" : "transparent",
                                            color: kotaAktif === k ? "#185FA5" : "#555",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {k}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reset */}
                        <button
                            onClick={() => { setQuery(""); setFilterAktif("Semua"); setKotaAktif("Semua Kota"); setSortBy("rating"); }}
                            style={{ width: "100%", padding: "9px", background: "none", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13, color: "#888", cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Reset Filter
                        </button>
                    </div>

                    {/* GRID GURU */}
                    <div>
                        {/* Sort bar */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <span style={{ fontSize: 13, color: "#888" }}>Urutkan:</span>
                            <div style={{ display: "flex", gap: 8 }}>
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSortBy(opt.value)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            border: "none",
                                            fontFamily: "inherit",
                                            background: sortBy === opt.value ? "#185FA5" : "#E6F1FB",
                                            color: sortBy === opt.value ? "#fff" : "#185FA5",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {guruTampil.length === 0 ? (
                            <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Guru tidak ditemukan</div>
                                <div style={{ fontSize: 13, color: "#aaa" }}>Coba ubah filter atau kata kunci pencarian.</div>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                                {guruTampil.map((g) => (
                                    <GuruCard key={g.id} guru={g} onLihat={handleLihatProfil} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}