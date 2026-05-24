import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from '../../services/api';
import useFavorit from '../../hooks/useFavorit';
import { listenReviews, submitReview, createActivityLog, getOrCreateChatByUsers } from '../../services/firestoreService';
import InboxBell from "../../components/InboxBell";

const warnaList = [
    { bg: "#185FA5", text: "#fff" },
    { bg: "#B5D4F4", text: "#0C447C" },
    { bg: "#9FE1CB", text: "#085041" },
    { bg: "#FAC775", text: "#633806" },
];
const getWarna = (index) => warnaList[(index ?? 0) % warnaList.length];
const getInisial = (nama) => nama?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?";

const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 24, marginBottom: 20 },
    badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color: color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }),
    chip: { display: "inline-flex", alignItems: "center", background: "#f0f4ff", color: "#185FA5", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, margin: "4px" },
    avatarBox: (bg, color, size) => ({ width: size, height: size, borderRadius: "50%", background: bg, color: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }),
};

function Bintang({ jumlah }) {
    return (
        <span style={{ color: "#F5C400", fontSize: 13, letterSpacing: 1 }}>
            {"★".repeat(jumlah)}{"☆".repeat(5 - jumlah)}
        </span>
    );
}

function BookingCard({ guru, isFavorit, onToggleFavorit }) {
    const navigate = useNavigate();
    const [paket, setPaket] = useState("mingguan");

    const harga = paket === "mingguan" ? guru.harga?.mingguan : guru.harga?.bulanan;
    const hargaFormatted = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(harga ?? 0);

    const handleBooking = () => {
        navigate(`/booking/${guru.id}`, { state: { guru, paket } });
    };

    const handleChat = async () => {
        const siswa = JSON.parse(localStorage.getItem('user'));
        if (!siswa) {
            alert("Harap login terlebih dahulu untuk chat.");
            return;
        }
        
        try {
            const chatId = await getOrCreateChatByUsers(
                guru.user_id || guru.id, // pastikan backend return user_id
                siswa.id,
                guru.nama,
                siswa.name || siswa.nama_panggilan || "Siswa",
                guru.mapel,
                guru.foto_profil || "",
                siswa.foto_url || ""
            );
            navigate(`/chat?chatId=${chatId}`);
        } catch (error) {
            console.error("Gagal membuka chat:", error);
            alert("Gagal membuka chat.");
        }
    };

    return (
        <div>
            {/* BOOKING CARD */}
            <div style={{ ...s.card, position: "sticky", top: 80, marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 16 }}>Pilih Paket</div>

                {/* Toggle paket */}
                <div style={{ display: "flex", background: "#f0f4ff", borderRadius: 10, padding: 4, marginBottom: 16 }}>
                    {["mingguan", "bulanan"].map((p) => (
                        <div key={p} onClick={() => setPaket(p)} style={{ flex: 1, padding: "8px", borderRadius: 8, textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", background: paket === p ? "#185FA5" : "transparent", color: paket === p ? "#fff" : "#185FA5" }}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </div>
                    ))}
                </div>

                {/* Harga */}
                <div style={{ background: "#E6F1FB", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Harga {paket}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#042C53" }}>{hargaFormatted}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        {guru.harga?.sesiPerMinggu ?? 2}x sesi / {paket === "mingguan" ? "minggu" : "bulan"} · {guru.harga?.menitPerSesi ?? 90} menit/sesi
                    </div>
                </div>

                {/* Jadwal tersedia — read only */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>Jadwal Tersedia</div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>Pilihan hari bisa diatur saat booking</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {(guru.jadwal ?? []).map((hari) => (
                            <div key={hari} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1.5px solid #B5D4F4", background: "#E6F1FB", color: "#185FA5" }}>
                                {hari}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tombol Booking */}
                <button onClick={handleBooking} style={{ width: "100%", padding: 13, background: "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
                    Booking Sekarang
                </button>

                {/* Tombol Favorit */}
                <button
                    onClick={onToggleFavorit}
                    style={{ width: "100%", padding: 11, background: isFavorit ? "#FEF3E2" : "none", border: `1px solid ${isFavorit ? "#FAC775" : "#B5D4F4"}`, borderRadius: 12, fontSize: 13, fontWeight: 600, color: isFavorit ? "#633806" : "#185FA5", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", marginBottom: 10 }}
                >
                    {isFavorit ? "❤️ Tersimpan sebagai Favorit" : "🤍 Tambah ke Favorit"}
                </button>

                {/* Tombol Chat */}
                <button
                    onClick={handleChat}
                    style={{ width: "100%", padding: 11, background: "#fff", border: "1px solid #1D9E75", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#1D9E75", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                >
                    💬 Chat Guru
                </button>
            </div>

            {/* KONTAK PENGADUAN */}
            <div style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53", marginBottom: 12 }}>📞 Butuh Bantuan?</div>
                <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>
                    Ada masalah dengan guru atau proses booking? Hubungi layanan pengaduan kami.
                </p>
                <a
                    href="https://wa.me/6281234567890?text=Halo%20Synau%2C%20saya%20ingin%20melaporkan%20masalah..."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#E9F7EF", border: "1px solid #A9DFBF", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#1D6A39", textDecoration: "none", marginBottom: 8 }}
                >
                    <span>💬</span> WhatsApp: 0812-3456-7890
                </a>
                <a
                    href="mailto:pengaduan@synau.id"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#EBF5FB", border: "1px solid #AED6F1", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#1A5276", textDecoration: "none" }}
                >
                    <span>📧</span> pengaduan@synau.id
                </a>
            </div>
        </div>
    );
}

export default function DetailGuru() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [guru, setGuru] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firebaseReviews, setFirebaseReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);

    const siswa = JSON.parse(localStorage.getItem('user')) ?? {};
    const inisialSiswa = siswa?.nama_panggilan?.[0]?.toUpperCase() ?? siswa?.name?.[0]?.toUpperCase() ?? "S";

    // ✅ Hook dipanggil di level komponen
    const { favoritIds, toggle } = useFavorit();
    const isFavorit = favoritIds.map(String).includes(String(id));

    const handleToggleFavorit = () => toggle(parseInt(id));

    useEffect(() => {
        const unsubscribe = listenReviews(id, (data) => setFirebaseReviews(data));
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        api.get(`/guru/${id}`)
            .then(res => {
                const data = res.data;
                setGuru({
                    id: data.id,
                    nama: data.nama,
                    mapel: data.mata_pelajaran?.[0] ?? data.mapel,
                    mataPelajaran: data.mata_pelajaran ?? [],
                    kota: data.kota,
                    rating: data.rating,
                    totalUlasan: data.total_ulasan ?? 0,
                    totalSiswa: data.total_siswa ?? 0,
                    kepuasan: data.kepuasan ?? 95,
                    terverifikasi: data.terverifikasi,
                    bio: data.bio,
                    jadwal: data.jadwal ?? [],
                    slot_jam_per_hari: data.slot_jam_per_hari ?? {}, // ← tambah ini
                    harga: data.harga ?? { mingguan: 0, bulanan: 0, sesiPerMinggu: 2, menitPerSesi: 90 },
                    ulasan: data.ulasan ?? [],
                    warnaBg: getWarna(data.id).bg,
                    warnaText: getWarna(data.id).text,
                });
            })
            .catch(() => {
                const guruState = location.state?.guru;
                if (guruState) {
                    setGuru({
                        ...guruState,
                        mataPelajaran: guruState.mata_pelajaran ?? [guruState.mapel],
                        totalUlasan: 0, totalSiswa: guruState.total_siswa ?? 0, kepuasan: 95,
                        bio: `${guruState.nama} adalah pengajar ${guruState.mapel} berpengalaman di ${guruState.kota}.`,
                        harga: guruState.harga ?? { mingguan: 120000, bulanan: 400000, sesiPerMinggu: 2, menitPerSesi: 90 },
                        ulasan: [],
                        warnaBg: getWarna(guruState.id).bg,
                        warnaText: getWarna(guruState.id).text,
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 14, color: "#888" }}>Memuat profil guru...</div>
            </div>
        );
    }

    if (!guru) {
        return (
            <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#042C53" }}>Guru tidak ditemukan</div>
                    <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: "8px 20px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>Kembali</button>
                </div>
            </div>
        );
    }

    const handleReviewSubmit = async () => {
        if (!newReview.trim()) return;
        await submitReview(id, siswa.id, siswa.name || siswa.nama_panggilan, newRating, newReview);
        
        // Activity Log untuk ulasan
        createActivityLog({
            actor_id: siswa.id,
            actor_role: 'siswa',
            actor_name: siswa.name || siswa.nama_panggilan,
            action: 'review',
            description: `Memberikan ulasan bintang ${newRating} kepada guru.`,
        });

        setNewReview("");
        setNewRating(5);
    };

    const combinedRatingRaw = guru.totalUlasan + firebaseReviews.length === 0 ? 0 : 
        ((guru.rating * guru.totalUlasan) + firebaseReviews.reduce((sum, r) => sum + Number(r.rating), 0)) / (guru.totalUlasan + firebaseReviews.length);
    const combinedRating = combinedRatingRaw > 0 ? combinedRatingRaw.toFixed(1) : 0;

    return (
        <div style={s.page}>
            <nav style={s.navbar}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid #B5D4F4", borderRadius: 8, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 600, padding: "7px 14px", fontFamily: "inherit" }}>
                        ← Kembali
                    </button>
                    <div style={s.logo}>Syn<span style={{ color: "#378ADD" }}>au</span></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <InboxBell role="siswa" />
                    <div style={s.avatarBox("#185FA5", "#fff", 34)}>{inisialSiswa}</div>
                </div>
            </nav>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

                {/* KOLOM KIRI */}
                <div>
                    {/* Header profil */}
                    <div style={s.card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                            <div style={s.avatarBox(guru.warnaBg, guru.warnaText, 80)}>
                                {getInisial(guru.nama)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>{guru.nama}</div>
                                <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{guru.mapel} · {guru.kota}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                                    <span style={s.badge("#E6F1FB", "#0C447C")}>★ {combinedRating}</span>
                                    <span style={{ fontSize: 13, color: "#aaa" }}>{guru.totalUlasan + firebaseReviews.length} ulasan</span>
                                    {guru.terverifikasi && <span style={s.badge("#E1F5EE", "#085041")}>Terverifikasi ✓</span>}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 32, paddingTop: 16, borderTop: "1px solid #E6F1FB" }}>
                            {[{ nilai: `${guru.totalSiswa}+`, label: "Siswa Diajar" }, { nilai: `${guru.kepuasan}%`, label: "Kepuasan Siswa" }].map(({ nilai, label }) => (
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
                        <div>{guru.mataPelajaran.map((mp) => <span key={mp} style={s.chip}>{mp}</span>)}</div>
                    </div>

                    {/* Ulasan */}
                    <div style={s.card}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53" }}>Ulasan Siswa <span style={{fontSize: 11, background: '#E6F1FB', color: '#185FA5', padding: '2px 8px', borderRadius: 8, marginLeft: 8}}>Realtime</span></div>
                            <span style={s.badge("#E6F1FB", "#0C447C")}>★ {combinedRating} · {guru.totalUlasan + firebaseReviews.length} ulasan</span>
                        </div>

                        {/* Input Ulasan Baru */}
                        <div style={{ background: "#f5f8ff", padding: 16, borderRadius: 12, marginBottom: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#042C53", marginBottom: 8 }}>Beri ulasan untuk {guru.nama}</div>
                            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                                {[1,2,3,4,5].map(star => (
                                    <span key={star} onClick={() => setNewRating(star)} style={{ cursor: 'pointer', fontSize: 20, color: star <= newRating ? "#F5C400" : "#ddd" }}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Ceritakan pengalaman belajarmu..."
                                rows={3}
                                style={{ width: "100%", padding: 12, border: "1px solid #B5D4F4", borderRadius: 8, fontSize: 13, fontFamily: "inherit", resize: "none", boxSizing: "border-box", marginBottom: 12 }}
                            />
                            <button onClick={handleReviewSubmit} style={{ background: "#185FA5", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                Kirim Ulasan
                            </button>
                        </div>

                        {firebaseReviews.map((u, i) => (
                            <div key={u.id} style={{ padding: "16px 0", borderBottom: "1px solid #E6F1FB" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <div style={s.avatarBox(getWarna(i).bg, getWarna(i).text, 34)}>{getInisial(u.siswa_name)}</div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{u.siswa_name}</div>
                                        <div style={{ fontSize: 11, color: "#1D9E75", marginTop: 2, fontWeight: 600 }}>Baru Saja</div>
                                    </div>
                                    <div style={{ marginLeft: "auto" }}><Bintang jumlah={u.rating} /></div>
                                </div>
                                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{u.komentar}</p>
                            </div>
                        ))}

                        {guru.ulasan.map((u, i) => (
                            <div key={u.id} style={{ padding: "16px 0", borderBottom: i < guru.ulasan.length - 1 ? "1px solid #E6F1FB" : "none" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                    <div style={s.avatarBox(getWarna(i+10).bg, getWarna(i+10).text, 34)}>
                                        {getInisial(u.nama)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{u.nama}</div>
                                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{u.waktu}</div>
                                    </div>
                                    <div style={{ marginLeft: "auto" }}><Bintang jumlah={u.bintang} /></div>
                                </div>
                                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{u.komentar}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KOLOM KANAN */}
                <BookingCard guru={guru} isFavorit={isFavorit} onToggleFavorit={handleToggleFavorit} />

            </div>
        </div>
    );
}