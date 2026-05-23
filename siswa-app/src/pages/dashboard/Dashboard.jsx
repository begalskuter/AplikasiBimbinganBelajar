import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

// Warna avatar berdasarkan index
const warnaList = [
    { bg: "#185FA5", text: "#fff" },
    { bg: "#B5D4F4", text: "#0C447C" },
    { bg: "#9FE1CB", text: "#085041" },
    { bg: "#FAC775", text: "#633806" },
];

const getWarna = (index) => warnaList[index % warnaList.length];
const getInisial = (nama) => nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const filterMapel = ["Semua", "Matematika", "Fisika", "Bahasa Inggris", "IPA", "Biologi", "Kimia"];

const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    container: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24 },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    btn: { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
};

function Navbar({ siswa, onLogout }) {
    const inisial = siswa?.nama_panggilan?.[0]?.toUpperCase() ?? siswa?.name?.[0]?.toUpperCase() ?? "S";
    return (
        <nav style={s.navbar}>
            <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 13, color: "#555" }}>
                    Halo, <strong style={{ color: "#042C53" }}>{siswa?.nama_panggilan || siswa?.name}!</strong>
                </span>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                    {inisial}
                </div>
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
                    <span key={f} onClick={() => setFilterAktif(f)} style={{ ...s.badge(filterAktif === f ? "#185FA5" : "#E6F1FB", filterAktif === f ? "#fff" : "#0C447C"), cursor: "pointer", fontSize: 12, padding: "5px 14px" }}>
                        {f}
                    </span>
                ))}
            </div>
        </div>
    );
}

function GuruCard({ guru, index, isTop, onLihat }) {
    const [hovered, setHovered] = useState(false);
    const warna = getWarna(index);
    const inisial = getInisial(guru.nama);
    return (
        <div
            style={{ background: "#fff", border: isTop ? "2px solid #185FA5" : "1px solid #B5D4F4", borderRadius: 14, padding: 18, cursor: "pointer", position: "relative", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 8px 24px rgba(24,95,165,0.1)" : "none", transition: "all 0.2s" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {isTop && (
                <div style={{ position: "absolute", top: -11, left: 14, background: "#185FA5", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 }}>
                    #1 Terbaik
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, marginTop: isTop ? 6 : 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: warna.bg, color: warna.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {inisial}
                </div>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.mapel}</div>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={s.badge("#E6F1FB", "#0C447C")}>★ {guru.rating}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{guru.kota}</span>
            </div>
            <button onClick={() => onLihat(guru)} style={{ ...s.btn, width: "100%", marginTop: 12, padding: "9px" }}>
                Lihat Profil
            </button>
        </div>
    );
}

function SesiMendatang({ jadwal, loading }) {
    return (
        <div style={{ ...s.card, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>📅 Sesi Mendatang</div>
            {loading ? (
                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" }}>Memuat...</p>
            ) : jadwal.length === 0 ? (
                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" }}>Belum ada sesi terjadwal.</p>
            ) : (
                jadwal.slice(0, 3).map((j, i) => {
                    const tgl = new Date(j.tanggal_mulai);
                    return (
                        <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < jadwal.length - 1 ? "1px solid #E6F1FB" : "none" }}>
                            <div style={{ width: 40, height: 40, background: "#E6F1FB", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "#185FA5" }}>{tgl.getDate()}</div>
                                <div style={{ fontSize: 10, color: "#888" }}>{tgl.toLocaleString("id-ID", { month: "short" })}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{j.guru?.user?.name ?? "Guru"}</div>
                                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Paket {j.paket} · {j.hari_dipilih?.join(", ")}</div>
                            </div>
                            <span style={s.badge(j.status === "confirmed" ? "#E1F5EE" : "#E6F1FB", j.status === "confirmed" ? "#0F6E56" : "#0C447C")}>
                                {j.status === "confirmed" ? "Terkonfirmasi" : "Pending"}
                            </span>
                        </div>
                    );
                })
            )}
        </div>
    );
}

function GuruFavorit({ guru, index, onLihat }) {
    if (!guru) return (
        <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>🏆 Guru Favoritmu</div>
            <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "16px 0" }}>Belum ada guru favorit.</p>
        </div>
    );
    const warna = getWarna(index ?? 0);
    const inisial = getInisial(guru.nama);
    return (
        <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>🏆 Guru Favoritmu</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#E6F1FB", borderRadius: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: warna.bg, color: warna.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {inisial}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{guru.mapel} · ★ {guru.rating}</div>
                </div>
                <button onClick={() => onLihat(guru)} style={s.btn}>Lihat Profil</button>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filterAktif, setFilterAktif] = useState("Semua");
    const [guruList, setGuruList] = useState([]);
    const [jadwal, setJadwal] = useState([]);
    const [loadingGuru, setLoadingGuru] = useState(true);
    const [loadingJadwal, setLoadingJadwal] = useState(true);

    const siswa = JSON.parse(localStorage.getItem('user')) ?? {};

    useEffect(() => {
        // Fetch guru berdasarkan kota siswa
        api.get(`/guru?kota=${siswa.kota ?? ''}`)
            .then(res => setGuruList(res.data))
            .catch(() => setGuruList([]))
            .finally(() => setLoadingGuru(false));

        // Fetch jadwal booking siswa
        api.get('/booking')
            .then(res => setJadwal(res.data))
            .catch(() => setJadwal([]))
            .finally(() => setLoadingJadwal(false));
    }, []);

    const guruTampil = guruList
        .filter((g) => {
            const cocokQuery = g.nama?.toLowerCase().includes(query.toLowerCase()) || g.mapel?.toLowerCase().includes(query.toLowerCase());
            const cocokFilter = filterAktif === "Semua" || g.mapel?.toLowerCase().includes(filterAktif.toLowerCase());
            return cocokQuery && cocokFilter;
        })
        .slice(0, 4);

    // Guru favorit = guru yang paling sering dibooking
    const guruFavorit = jadwal.length > 0
        ? (() => {
            const count = {};
            jadwal.forEach(j => { count[j.guru_id] = (count[j.guru_id] ?? 0) + 1; });
            const topId = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0];
            const topGuru = guruList.find(g => g.id === parseInt(topId));
            return topGuru ?? null;
        })()
        : null;

    const handleLihatProfil = (guru) => {
        navigate(`/guru/${guru.id}`, { state: { guru } });
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (_) { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={s.page}>
            <Navbar siswa={siswa} onLogout={handleLogout} />
            <div style={s.container}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>
                        Selamat datang, {siswa?.nama_panggilan || siswa?.name}! 👋
                    </h1>
                    <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>Mau belajar apa hari ini? Temukan guru terbaik di sekitarmu.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
                    <div>
                        <SearchSection query={query} setQuery={setQuery} filterAktif={filterAktif} setFilterAktif={setFilterAktif} />
                        <div style={s.card}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>
                                    ★ Guru Terbaik di {siswa?.kota ?? "Kotamu"}
                                </div>
                                <span onClick={() => navigate("/cari-guru")} style={{ fontSize: 12, color: "#185FA5", cursor: "pointer", fontWeight: 600 }}>Lihat semua →</span>
                            </div>
                            {loadingGuru ? (
                                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>Memuat guru...</p>
                            ) : guruTampil.length === 0 ? (
                                <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>Guru tidak ditemukan.</p>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                                    {guruTampil.map((g, i) => (
                                        <GuruCard key={g.id} guru={g} index={i} isTop={i === 0 && filterAktif === "Semua" && query === ""} onLihat={handleLihatProfil} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <SesiMendatang jadwal={jadwal} loading={loadingJadwal} />
                        <GuruFavorit guru={guruFavorit} index={0} onLihat={handleLihatProfil} />
                    </div>
                </div>
            </div>
        </div>
    );
}