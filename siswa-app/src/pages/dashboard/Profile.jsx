// Profile.jsx — field lengkap sesuai tabel users (v2)
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useFavorit from "../../hooks/useFavorit";
import InboxBell from "../../components/InboxBell";

/* ─── Warna avatar (sama seperti Dashboard) ─── */
const warnaList = [
    { bg: "#185FA5", text: "#fff" },
    { bg: "#B5D4F4", text: "#0C447C" },
    { bg: "#9FE1CB", text: "#085041" },
    { bg: "#FAC775", text: "#633806" },
];
const getWarna = (index) => warnaList[index % warnaList.length];
const getInisial = (nama) =>
    nama?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() ?? "?";

/* ─── Shared styles ─── */
const s = {
    page: {
        background: "#f5f8ff",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    },
    navbar: {
        background: "#fff",
        borderBottom: "1px solid #E6F1FB",
        padding: "0 28px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    logo: { fontWeight: 800, fontSize: 20, color: "#0C447C" },
    container: { maxWidth: 860, margin: "0 auto", padding: "32px 24px" },
    card: {
        background: "#fff",
        border: "1px solid #E6F1FB",
        borderRadius: 16,
        padding: 28,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: "#042C53",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    label: { fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6, display: "block", letterSpacing: 0.3 },
    input: {
        width: "100%",
        padding: "11px 14px",
        border: "1.5px solid #e0e0e0",
        borderRadius: 10,
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
        background: "#fff",
        color: "#042C53",
        transition: "border-color 0.15s",
    },
    inputDisabled: {
        background: "#f7f9fc",
        color: "#aaa",
        cursor: "not-allowed",
    },
    btnPrimary: {
        background: "#185FA5",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "10px 22px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "background 0.15s",
    },
    btnSecondary: {
        background: "none",
        color: "#185FA5",
        border: "1.5px solid #185FA5",
        borderRadius: 10,
        padding: "10px 22px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
    },
    badge: (bg, color) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: bg,
        color: color,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 100,
    }),
    divider: { borderTop: "1px solid #E6F1FB", margin: "20px 0" },
    toast: (type) => ({
        position: "fixed",
        bottom: 28,
        right: 28,
        background: type === "success" ? "#E1F5EE" : "#FCEBEB",
        color: type === "success" ? "#0F6E56" : "#A32D2D",
        border: `1px solid ${type === "success" ? "#9FE1CB" : "#F7C1C1"}`,
        borderRadius: 12,
        padding: "12px 20px",
        fontSize: 13,
        fontWeight: 700,
        zIndex: 9999,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }),
};

/* ─── Navbar ─── */
function Navbar({ siswa, onBack, onLogout }) {
    const inisial = siswa?.nama_panggilan?.[0]?.toUpperCase() ?? siswa?.name?.[0]?.toUpperCase() ?? "S";
    return (
        <nav style={s.navbar}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                    onClick={onBack}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#185FA5", padding: 0, lineHeight: 1 }}
                    title="Kembali"
                >
                    ←
                </button>
                <div style={s.logo}>
                    Syn<span style={{ color: "#378ADD" }}>au</span>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <InboxBell role="siswa" />
                <span style={{ fontSize: 13, color: "#555" }}>
                    Halo, <strong style={{ color: "#042C53" }}>{siswa?.nama_panggilan || siswa?.name}!</strong>
                </span>
                <div
                    style={{
                        width: 34, height: 34, borderRadius: "50%", background: "#185FA5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 13, color: "#fff",
                    }}
                >
                    {inisial}
                </div>
                <button
                    onClick={onLogout}
                    style={{ background: "none", border: "1px solid #e0e0e0", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#666", cursor: "pointer", fontFamily: "inherit" }}
                >
                    Keluar
                </button>
            </div>
        </nav>
    );
}

/* ─── Toast ─── */
function Toast({ msg, type, onClose }) {
    useEffect(() => {
        if (!msg) return;
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [msg]);
    if (!msg) return null;
    return <div style={s.toast(type)}>{type === "success" ? "✅" : "❌"} {msg}</div>;
}

/* ─── Foto Profil ─── */
function FotoProfil({ siswa, onFotoUpdated }) {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const warna = getWarna(0);
    const inisial = getInisial(siswa?.name ?? siswa?.nama_panggilan ?? "S");

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran foto maksimal 2MB.");
            return;
        }
        const form = new FormData();
        form.append("foto", file);
        setUploading(true);
        try {
            const res = await api.post("/profile/foto", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onFotoUpdated(res.data.foto_url);
        } catch {
            alert("Gagal mengunggah foto.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
                {siswa?.foto_url ? (
                    <img
                        src={siswa.foto_url}
                        alt="Foto profil"
                        style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #E6F1FB" }}
                    />
                ) : (
                    <div
                        style={{
                            width: 80, height: 80, borderRadius: "50%",
                            background: warna.bg, color: warna.text,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, fontSize: 24, border: "3px solid #E6F1FB",
                        }}
                    >
                        {inisial}
                    </div>
                )}
                <button
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                    style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: 26, height: 26, borderRadius: "50%",
                        background: "#185FA5", border: "2px solid #fff",
                        color: "#fff", fontSize: 13, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        cursor: uploading ? "wait" : "pointer",
                    }}
                    title="Ganti foto"
                >
                    {uploading ? "⏳" : "✏️"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            </div>
            <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#042C53" }}>{siswa?.name}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Siswa · {siswa?.kota ?? "—"}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>JPG/PNG, maks 2MB</div>
            </div>
        </div>
    );
}

/* ─── Textarea Field ─── */
function TextareaField({ label, value, onChange, placeholder }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={s.label}>{label}</label>
            <textarea
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                style={{ ...s.input, resize: "vertical", borderColor: focused ? "#185FA5" : "#e0e0e0", lineHeight: 1.6 }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    );
}

/* ─── Form Info Pribadi (field lengkap sesuai tabel users) ─── */
function FormInfoPribadi({ siswa, onSimpan }) {
    const [form, setForm] = useState({
        name: siswa?.name ?? "",
        nama_panggilan: siswa?.nama_panggilan ?? "",
        email: siswa?.email ?? "",
        no_hp: siswa?.no_hp ?? "",
        tanggal_lahir: siswa?.tanggal_lahir ?? "",
        alamat_lengkap: siswa?.alamat_lengkap ?? "",
        kelurahan: siswa?.kelurahan ?? "",
        kecamatan: siswa?.kecamatan ?? "",
        kota: siswa?.kota ?? "",
        provinsi: siswa?.provinsi ?? "",
    });
    const [loading, setLoading] = useState(false);
    const [dirty, setDirty] = useState(false);

    const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setDirty(true); };

    const handleSubmit = async () => {
        if (!form.name.trim()) { alert("Nama lengkap wajib diisi."); return; }
        setLoading(true);
        try {
            const res = await api.put("/profile", form);
            onSimpan(res.data.user ?? form, "Profil berhasil diperbarui.");
            setDirty(false);
        } catch (err) {
            onSimpan(null, err?.response?.data?.message ?? "Gagal menyimpan.");
        } finally {
            setLoading(false);
        }
    };

    const groupTitle = (text) => (
        <div style={{ fontSize: 11, fontWeight: 700, color: "#185FA5", letterSpacing: 0.5, marginBottom: 12, marginTop: 20, paddingBottom: 6, borderBottom: "1px solid #E6F1FB" }}>
            {text}
        </div>
    );

    return (
        <div>
            {/* ── Data Diri ── */}
            {groupTitle("DATA DIRI")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InputField label="Nama Lengkap" value={form.name} onChange={(v) => set("name", v)} placeholder="Nama lengkap" />
                <InputField label="Nama Panggilan" value={form.nama_panggilan} onChange={(v) => set("nama_panggilan", v)} placeholder="Nama panggilan" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InputField label="Email" value={form.email} onChange={() => { }} disabled hint="Email tidak bisa diubah." />
                <InputField label="No. HP / WhatsApp" value={form.no_hp} onChange={(v) => set("no_hp", v)} placeholder="08xxxxxxxxxx" type="tel" />
            </div>
            <div style={{ width: "50%", paddingRight: 8 }}>
                <InputField label="Tanggal Lahir" value={form.tanggal_lahir} onChange={(v) => set("tanggal_lahir", v)} type="date" />
            </div>

            {/* ── Alamat ── */}
            {groupTitle("ALAMAT")}
            <div style={{ marginBottom: 16 }}>
                <TextareaField label="Alamat Lengkap" value={form.alamat_lengkap} onChange={(v) => set("alamat_lengkap", v)} placeholder="Jl. Contoh No. 1, RT/RW..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <InputField label="Kelurahan" value={form.kelurahan} onChange={(v) => set("kelurahan", v)} placeholder="Nama kelurahan" />
                <InputField label="Kecamatan" value={form.kecamatan} onChange={(v) => set("kecamatan", v)} placeholder="Nama kecamatan" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InputField label="Kota / Kabupaten" value={form.kota} onChange={(v) => set("kota", v)} placeholder="Contoh: Sidoarjo" />
                <InputField label="Provinsi" value={form.provinsi} onChange={(v) => set("provinsi", v)} placeholder="Contoh: Jawa Timur" />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button onClick={handleSubmit} disabled={loading || !dirty} style={{ ...s.btnPrimary, opacity: loading || !dirty ? 0.6 : 1 }}>
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </div>
    );
}

/* ─── Input helper ─── */
function InputField({ label, value, onChange, placeholder, disabled, hint, type = "text" }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={s.label}>{label.toUpperCase()}</label>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                style={{ ...s.input, borderColor: focused ? "#185FA5" : "#e0e0e0", ...(disabled ? s.inputDisabled : {}) }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {hint && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{hint}</div>}
        </div>
    );
}

/* ─── Form Ganti Password ─── */
function FormGantiPassword({ onSimpan }) {
    const [form, setForm] = useState({ password_lama: "", password_baru: "", konfirmasi: "" });
    const [show, setShow] = useState({ lama: false, baru: false, konfirmasi: false });
    const [loading, setLoading] = useState(false);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
    const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

    const handleSubmit = async () => {
        if (!form.password_lama || !form.password_baru || !form.konfirmasi) {
            onSimpan(false, "Semua field password wajib diisi."); return;
        }
        if (form.password_baru.length < 8) {
            onSimpan(false, "Password baru minimal 8 karakter."); return;
        }
        if (form.password_baru !== form.konfirmasi) {
            onSimpan(false, "Konfirmasi password tidak cocok."); return;
        }
        setLoading(true);
        try {
            await api.put("/profile/password", {
                password_lama: form.password_lama,
                password_baru: form.password_baru,
            });
            onSimpan(true, "Password berhasil diperbarui.");
            setForm({ password_lama: "", password_baru: "", konfirmasi: "" });
        } catch (err) {
            onSimpan(false, err?.response?.data?.message ?? "Gagal mengubah password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <PasswordField label="Password Lama" value={form.password_lama} onChange={(v) => set("password_lama", v)} show={show.lama} onToggle={() => toggle("lama")} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <PasswordField label="Password Baru" value={form.password_baru} onChange={(v) => set("password_baru", v)} show={show.baru} onToggle={() => toggle("baru")} hint="Minimal 8 karakter" />
                    <PasswordField label="Konfirmasi Password Baru" value={form.konfirmasi} onChange={(v) => set("konfirmasi", v)} show={show.konfirmasi} onToggle={() => toggle("konfirmasi")} />
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button onClick={handleSubmit} disabled={loading} style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Menyimpan..." : "Ubah Password"}
                </button>
            </div>
        </div>
    );
}

function PasswordField({ label, value, onChange, show, onToggle, hint }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={s.label}>{label.toUpperCase()}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...s.input, borderColor: focused ? "#185FA5" : "#e0e0e0", paddingRight: 44 }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
                <button
                    onClick={onToggle}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#aaa", padding: 0 }}
                    tabIndex={-1}
                >
                    {show ? "🙈" : "👁️"}
                </button>
            </div>
            {hint && <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{hint}</div>}
        </div>
    );
}

/* ─── Riwayat Booking ─── */
function RiwayatBooking({ riwayat, loading }) {
    const statusConfig = {
        confirmed: { bg: "#E1F5EE", color: "#0F6E56", label: "Terkonfirmasi" },
        pending: { bg: "#E6F1FB", color: "#0C447C", label: "Pending" },
        cancelled: { bg: "#FCEBEB", color: "#A32D2D", label: "Dibatalkan" },
        done: { bg: "#F1EFE8", color: "#5F5E5A", label: "Selesai" },
    };

    if (loading) return <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>Memuat riwayat...</p>;
    if (!riwayat || riwayat.length === 0)
        return <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>Belum ada riwayat sesi.</p>;

    return (
        <div>
            {riwayat.map((j, i) => {
                const tgl = new Date(j.tanggal_mulai + "T00:00:00");
                const cfg = statusConfig[j.status] ?? statusConfig.pending;
                return (
                    <div
                        key={j.id}
                        style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "14px 0",
                            borderBottom: i < riwayat.length - 1 ? "1px solid #E6F1FB" : "none",
                        }}
                    >
                        <div
                            style={{
                                width: 44, height: 44, background: "#E6F1FB", borderRadius: 10,
                                display: "flex", flexDirection: "column", alignItems: "center",
                                justifyContent: "center", flexShrink: 0,
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#185FA5" }}>{tgl.getDate()}</div>
                            <div style={{ fontSize: 10, color: "#888" }}>{tgl.toLocaleString("id-ID", { month: "short" })}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{j.guru?.nama ?? "Guru"}</div>
                            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                {j.guru?.mapel} · Paket {j.paket} · {Array.isArray(j.hari_dipilih) ? j.hari_dipilih.join(", ") : j.hari_dipilih}
                            </div>
                        </div>
                        <span style={s.badge(cfg.bg, cfg.color)}>{cfg.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Guru Favorit ─── */
function GuruFavoritList({ guruList, favoritIds, onLihat, onHapus }) {
    const favoritGuru = guruList.filter((g) => favoritIds.includes(g.id));

    if (favoritGuru.length === 0)
        return (
            <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "24px 0" }}>
                Belum ada guru favorit.<br />
                <span style={{ fontSize: 12 }}>Klik ❤️ di halaman profil guru untuk menambahkan.</span>
            </p>
        );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {favoritGuru.map((guru, i) => {
                const warna = getWarna(i);
                const inisial = getInisial(guru.nama);
                return (
                    <div
                        key={guru.id}
                        style={{
                            display: "flex", alignItems: "center", gap: 14,
                            padding: "14px 16px", background: "#f5f8ff",
                            borderRadius: 12, border: "1px solid #E6F1FB",
                        }}
                    >
                        <div
                            style={{
                                width: 42, height: 42, borderRadius: "50%",
                                background: warna.bg, color: warna.text,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 700, fontSize: 13, flexShrink: 0,
                            }}
                        >
                            {inisial}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{guru.nama}</div>
                            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                                {guru.mapel} · ★ {guru.rating} · {guru.kota}
                            </div>
                        </div>
                        <button onClick={() => onLihat(guru)} style={{ ...s.btnPrimary, padding: "7px 14px", fontSize: 12 }}>Lihat</button>
                        <button
                            onClick={() => onHapus(guru.id)}
                            style={{ background: "none", border: "1px solid #F7C1C1", borderRadius: 8, color: "#A32D2D", fontSize: 12, fontWeight: 700, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}
                        >
                            Hapus
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Main Page ─── */
export default function Profile() {
    const navigate = useNavigate();
    const [siswa, setSiswa] = useState(() => JSON.parse(localStorage.getItem("user")) ?? {});
    const [guruList, setGuruList] = useState([]);
    const [riwayat, setRiwayat] = useState([]);
    const [loadingRiwayat, setLoadingRiwayat] = useState(true);
    const [toast, setToast] = useState({ msg: "", type: "success" });

    // Favorit dari DB via hook — tetap ada meski logout & login lagi
    const { favoritIds, hapus: hapusFavorit } = useFavorit();

    const showToast = (msg, type = "success") => setToast({ msg, type });

    useEffect(() => {
        /* Ambil data profil terbaru dari server */
        api.get("/profile")
            .then((res) => {
                const user = res.data.user ?? res.data;
                setSiswa(user);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .catch(() => { });

        /* Riwayat booking */
        api.get("/booking")
            .then((res) => setRiwayat(res.data))
            .catch(() => setRiwayat([]))
            .finally(() => setLoadingRiwayat(false));

        /* Guru list untuk favorit */
        api.get("/guru")
            .then((res) => setGuruList(res.data))
            .catch(() => { });
    }, []);

    const handleProfilSimpan = (updatedUser, msg) => {
        if (updatedUser) {
            setSiswa(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            showToast(msg, "success");
        } else {
            showToast(msg, "error");
        }
    };

    const handleFotoUpdated = (fotoUrl) => {
        const updated = { ...siswa, foto_url: fotoUrl };
        setSiswa(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        showToast("Foto profil berhasil diperbarui.", "success");
    };

    const handlePasswordSimpan = (success, msg) => showToast(msg, success ? "success" : "error");

    const handleHapusFavorit = async (guruId) => {
        await hapusFavorit(guruId);
        showToast("Guru dihapus dari favorit.", "success");
    };

    const handleLogout = async () => {
        try { await api.post("/auth/logout"); } catch (_) { }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // favorit_guru tidak perlu dihapus — sudah di DB
        navigate("/");
    };

    return (
        <div style={s.page}>
            <Navbar siswa={siswa} onBack={() => navigate("/dashboard")} onLogout={handleLogout} />

            <div style={s.container}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#042C53", letterSpacing: "-0.5px" }}>
                        Profil Saya
                    </h1>
                    <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
                        Kelola informasi akun dan pengaturan pribadimu.
                    </p>
                </div>

                {/* ── Foto Profil ── */}
                <div style={s.card}>
                    <div style={s.sectionTitle}>📸 Foto Profil</div>
                    <FotoProfil siswa={siswa} onFotoUpdated={handleFotoUpdated} />
                </div>

                {/* ── Info Pribadi ── */}
                <div style={s.card}>
                    <div style={s.sectionTitle}>👤 Informasi Pribadi</div>
                    <FormInfoPribadi siswa={siswa} onSimpan={handleProfilSimpan} />
                </div>

                {/* ── Ganti Password ── */}
                <div style={s.card}>
                    <div style={s.sectionTitle}>🔒 Keamanan Akun</div>
                    <FormGantiPassword onSimpan={handlePasswordSimpan} />
                </div>

                {/* ── Guru Favorit ── */}
                <div style={s.card}>
                    <div style={s.sectionTitle}>❤️ Guru Favorit</div>
                    <GuruFavoritList
                        guruList={guruList}
                        favoritIds={favoritIds}
                        onLihat={(guru) => navigate(`/guru/${guru.id}`, { state: { guru } })}
                        onHapus={handleHapusFavorit}
                    />
                </div>

                {/* ── Riwayat Booking ── */}
                <div style={s.card}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div style={s.sectionTitle}>📋 Riwayat Sesi</div>
                        <span style={{ fontSize: 13, color: "#888" }}>{riwayat.length} sesi</span>
                    </div>
                    <RiwayatBooking riwayat={riwayat} loading={loadingRiwayat} />
                </div>
            </div>

            <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "success" })} />
        </div>
    );
}