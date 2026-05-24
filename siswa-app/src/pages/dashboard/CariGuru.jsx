import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import InboxBell from "../../components/InboxBell";

const warnaList = [
    { bg: "#185FA5", text: "#fff" },
    { bg: "#B5D4F4", text: "#0C447C" },
    { bg: "#9FE1CB", text: "#085041" },
    { bg: "#FAC775", text: "#633806" },
];
const getWarna = (index) => warnaList[index % warnaList.length];
const getInisial = (nama) => nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const filterMapel = ["Semua", "Matematika", "Fisika", "Bahasa Inggris", "IPA", "Biologi", "Kimia", "Bahasa Indonesia"];
const filterKota = ["Semua Kota", "Yogyakarta", "Sleman", "Bantul"];
const sortOptions = [
    { value: "rating", label: "Rating Tertinggi" },
    { value: "nama", label: "Nama A–Z" },
];

const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    btn: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%" },
};

function GuruCard({ guru, index, onLihat }) {
    const [hovered, setHovered] = useState(false);
    const warna = getWarna(index);
    const inisial = getInisial(guru.nama);
    return (
        <div
            style={{ background: "#fff", border: "1px solid #B5D4F4", borderRadius: 14, padding: 18, cursor: "pointer", transition: "all 0.2s", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 8px 24px rgba(24,95,165,0.1)" : "none" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: warna.bg, color: warna.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {inisial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.mapel}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{guru.kota}</span>
            </div>
            <button onClick={() => onLihat(guru)} style={s.btn}>Lihat Profil</button>
        </div>
    );
}

export default function CariGuru() {
    const navigate = useNavigate();
    const siswa = JSON.parse(localStorage.getItem('user')) ?? {};
    const inisialSiswa = siswa?.nama_panggilan?.[0]?.toUpperCase() ?? siswa?.name?.[0]?.toUpperCase() ?? "S";

    const [allGuru, setAllGuru] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filterAktif, setFilterAktif] = useState("Semua");
    const [kotaAktif, setKotaAktif] = useState("Semua Kota");
    const [sortBy, setSortBy] = useState("rating");

    useEffect(() => {
        // Fetch semua guru dari API
        // Nanti bisa tambah query params: /guru?mapel=xxx&kota=xxx
        api.get('/guru')
            .then(res => setAllGuru(res.data))
            .catch(() => setAllGuru([]))
            .finally(() => setLoading(false));
    }, []);

    const guruTampil = allGuru
        .filter((g) => {
            const cocokQuery = g.nama?.toLowerCase().includes(query.toLowerCase()) || g.mapel?.toLowerCase().includes(query.toLowerCase());
            const cocokMapel = filterAktif === "Semua" || g.mapel?.toLowerCase().includes(filterAktif.toLowerCase());
            const cocokKota = kotaAktif === "Semua Kota" || g.kota === kotaAktif;
            return cocokQuery && cocokMapel && cocokKota;
        })
        .sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "nama") return a.nama.localeCompare(b.nama);
            return 0;
        });

    const handleLihatProfil = (guru) => {
        navigate(`/guru/${guru.id}`, { state: { guru } });
    };

    return (
        <div style={s.page}>
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", fontFamily: "inherit" }}
                    >
                        ← Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <InboxBell role="siswa" />
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                        {inisialSiswa}
                    </div>
                </div>
            </nav>

            <div style={s.container}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>Cari Guru</h1>
                    <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                        {loading ? "Memuat data guru..." : `${guruTampil.length} guru ditemukan`}
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>

                    {/* SIDEBAR FILTER */}
                    <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 22, position: "sticky", top: 76 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Filter</div>

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

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 10 }}>Mata Pelajaran</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {filterMapel.map((f) => (
                                    <div key={f} onClick={() => setFilterAktif(f)} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: filterAktif === f ? 700 : 500, cursor: "pointer", background: filterAktif === f ? "#E6F1FB" : "transparent", color: filterAktif === f ? "#185FA5" : "#555", transition: "all 0.15s" }}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 10 }}>Kota</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {filterKota.map((k) => (
                                    <div key={k} onClick={() => setKotaAktif(k)} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: kotaAktif === k ? 700 : 500, cursor: "pointer", background: kotaAktif === k ? "#E6F1FB" : "transparent", color: kotaAktif === k ? "#185FA5" : "#555", transition: "all 0.15s" }}>
                                        {k}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => { setQuery(""); setFilterAktif("Semua"); setKotaAktif("Semua Kota"); setSortBy("rating"); }}
                            style={{ width: "100%", padding: "9px", background: "none", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13, color: "#888", cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Reset Filter
                        </button>
                    </div>

                    {/* GRID GURU */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <span style={{ fontSize: 13, color: "#888" }}>Urutkan:</span>
                            <div style={{ display: "flex", gap: 8 }}>
                                {sortOptions.map((opt) => (
                                    <button key={opt.value} onClick={() => setSortBy(opt.value)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", fontFamily: "inherit", background: sortBy === opt.value ? "#185FA5" : "#E6F1FB", color: sortBy === opt.value ? "#fff" : "#185FA5", transition: "all 0.15s" }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ fontSize: 13, color: "#aaa" }}>Memuat data guru...</div>
                            </div>
                        ) : guruTampil.length === 0 ? (
                            <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Guru tidak ditemukan</div>
                                <div style={{ fontSize: 13, color: "#aaa" }}>Coba ubah filter atau kata kunci pencarian.</div>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                                {guruTampil.map((g, i) => (
                                    <GuruCard key={g.id} guru={g} index={i} onLihat={handleLihatProfil} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}