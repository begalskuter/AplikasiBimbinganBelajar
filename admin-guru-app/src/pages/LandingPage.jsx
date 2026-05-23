import { useEffect, useState } from "react";
import AuthModal from '../components/AuthModal'

const features = [
    {
        icon: "ti-currency-dollar",
        title: "Penghasilan Tambahan",
        desc: "Dapatkan penghasilan fleksibel dengan mengajar siswa di sekitar kotamu. Tentukan tarif sendiri sesuai keahlianmu.",
    },
    {
        icon: "ti-calendar-event",
        title: "Jadwal Fleksibel",
        desc: "Atur jadwal mengajar sesuai waktu luangmu. Tidak ada jam kerja tetap — kamu yang menentukan.",
    },
    {
        icon: "ti-star",
        title: "Bangun Reputasi",
        desc: "Kumpulkan rating & ulasan dari siswa. Semakin tinggi ratingmu, semakin banyak siswa yang tertarik.",
    },
    {
        icon: "ti-shield-check",
        title: "Terverifikasi & Terpercaya",
        desc: "Proses verifikasi kami memastikan hanya guru berkualitas. Profil terverifikasi meningkatkan kepercayaan siswa.",
    },
    {
        icon: "ti-chart-line",
        title: "Dashboard Lengkap",
        desc: "Pantau penghasilan, jadwal, dan progress siswa dari satu dashboard. Kelola semua sesi mengajarmu dengan mudah.",
    },
    {
        icon: "ti-users",
        title: "Jangkauan Luas",
        desc: "Terhubung dengan ribuan siswa di seluruh Indonesia. Perluas jaringan dan dampak mengajarmu.",
    },
];

const steps = [
    { num: "1", title: "Daftar & Lengkapi Profil", desc: "Buat akun dan upload dokumen yang diperlukan (CV, KTP, Ijazah). Cukup beberapa menit!" },
    { num: "2", title: "Tunggu Verifikasi", desc: "Tim admin akan memeriksa dan memverifikasi data pendaftaranmu dalam 1-3 hari kerja." },
    { num: "3", title: "Atur Profil Mengajar", desc: "Setelah diverifikasi, lengkapi profil mengajar — mata pelajaran, jadwal, dan tarif." },
    { num: "4", title: "Mulai Mengajar!", desc: "Terima booking dari siswa dan mulai sesi mengajar. Dapatkan penghasilan & bangun reputasi!" },
];

const stats = [
    { icon: "ti-users", num: "800+", label: "Guru Aktif" },
    { icon: "ti-map-pin", num: "50+", label: "Kota" },
    { icon: "ti-star", num: "4.9★", label: "Rating Rata-rata" },
    { icon: "ti-books", num: "30+", label: "Mata Pelajaran" },
];

const testimonials = [
    { initials: "DP", name: "Dewi Puspitasari, S.Pd", subject: "Guru Matematika · Yogyakarta", quote: "Sejak bergabung Synau, penghasilan saya meningkat signifikan. Platform yang sangat memudahkan!" },
    { initials: "AR", name: "Ahmad Ridwan, M.Pd", subject: "Guru Fisika · Semarang", quote: "Dashboard-nya lengkap dan mudah digunakan. Saya bisa fokus mengajar tanpa ribet admin." },
    { initials: "SN", name: "Siti Nurhaliza, S.Si", subject: "Guru Kimia · Magelang", quote: "Fleksibilitas jadwal Synau sangat cocok untuk saya yang juga mengajar di sekolah." },
];

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState('login');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", color: "#1a1a2e", overflowX: "hidden" }}>
            {/* Google Fonts & Icons */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');

        :root {
          --blue-50: #E6F1FB;
          --blue-100: #B5D4F4;
          --blue-200: #85B7EB;
          --blue-400: #378ADD;
          --blue-600: #185FA5;
          --blue-800: #0C447C;
          --blue-900: #042C53;
          --teal-400: #1D9E75;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .btn-primary {
          background: var(--blue-600);
          color: #fff;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .btn-primary:hover { background: var(--blue-800); transform: translateY(-1px); }

        .btn-secondary {
          background: transparent;
          color: var(--blue-600);
          border: 2px solid var(--blue-200);
          padding: 13px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: var(--blue-50); border-color: var(--blue-400); }

        .feature-card {
          background: #fff;
          border: 1px solid var(--blue-100);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.2s;
        }
        .feature-card:hover {
          border-color: var(--blue-400);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(55,138,221,0.1);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--teal-400);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--blue-600); }

        .footer-link {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #fff; }

        .btn-white {
          background: #fff;
          color: var(--blue-800);
          border: none;
          padding: 14px 36px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-white:hover { background: var(--blue-50); transform: translateY(-1px); }

        .btn-outline-white {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.4);
          padding: 13px 32px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 28px;
          text-align: center;
          transition: all 0.2s;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .testimonial-card {
          background: #fff;
          border: 1px solid var(--blue-100);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.2s;
        }
        .testimonial-card:hover {
          border-color: var(--blue-400);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(55,138,221,0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

            {/* NAVBAR */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(55,138,221,0.12)",
                padding: "0 5%",
                transition: "all 0.3s"
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 0, height: 64 }}>
                    <div style={{ fontWeight: 800, fontSize: 22, color: "#0C447C", letterSpacing: "-0.5px" }}>
                        Syn<span style={{ color: "#378ADD" }}>au</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 32, marginLeft: 48 }}>
                        <a href="#keunggulan" className="nav-link">Keunggulan</a>
                        <a href="#cara-bergabung" className="nav-link">Cara Bergabung</a>
                        <a href="#testimoni" className="nav-link">Testimoni</a>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
                        {localStorage.getItem('registration_pending') === 'true' && (
                            <button className="btn-secondary" style={{ borderColor: '#F5C400', color: '#B28E00', background: 'rgba(245,196,0,0.1)' }} onClick={() => { setAuthTab('status'); setAuthOpen(true) }}>
                                <i className="ti ti-clock" style={{ marginRight: 6 }}></i> Status Pendaftaran
                            </button>
                        )}
                        <button className="btn-secondary" onClick={() => { setAuthTab('login'); setAuthOpen(true) }}>Masuk</button>
                        <button className="btn-primary" onClick={() => { setAuthTab('register'); setAuthOpen(true) }}>Daftar Guru</button>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={{
                minHeight: "100vh",
                background: "linear-gradient(155deg, #E6F1FB 0%, #fff 50%, #f0f7ff 100%)",
                display: "flex", alignItems: "center",
                padding: "100px 5% 80px",
                position: "relative", overflow: "hidden"
            }}>
                <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(55,138,221,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%" }}>
                    {/* Left */}
                    <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#E6F1FB", border: "1px solid #B5D4F4", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "#185FA5", marginBottom: 24 }}>
                            <span className="badge-dot" />
                            Portal Guru & Admin Synau
                        </div>
                        <h1 style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: "#042C53", letterSpacing: "-1.5px", marginBottom: 20 }}>
                            Mengajar Lebih{" "}
                            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>Bermakna</em>
                            {" "}Bersama Synau
                        </h1>
                        <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                            Bergabunglah sebagai guru di Synau dan bantu ribuan siswa di Indonesia mencapai prestasi terbaik mereka. Fleksibel, terverifikasi, dan terpercaya.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <button className="btn-primary" onClick={() => { setAuthTab('register'); setAuthOpen(true) }}>
                                <i className="ti ti-chalkboard" /> Daftar Jadi Guru
                            </button>
                            <a href="#cara-bergabung" className="btn-secondary">Pelajari Lebih Lanjut</a>
                        </div>
                        <div style={{ display: "flex", gap: 32, marginTop: 44, paddingTop: 36, borderTop: "1px solid #B5D4F4" }}>
                            {[["800+", "Guru Aktif"], ["12K+", "Siswa Terhubung"], ["4.9★", "Rating Platform"]].map(([num, label]) => (
                                <div key={label}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "#0C447C", letterSpacing: "-1px" }}>{num}</div>
                                    <div style={{ fontSize: 13, color: "#888", fontWeight: 500, marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Illustration Card */}
                    <div style={{ position: "relative" }}>
                        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #B5D4F4", padding: 28, boxShadow: "0 20px 60px rgba(24,95,165,0.12)" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
                                <i className="ti ti-trending-up" style={{ color: "#1D9E75", fontSize: 14 }} /> Guru Berprestasi Bulan Ini
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {testimonials.map((t, i) => (
                                    <div key={t.initials} style={{
                                        display: "flex", alignItems: "center", gap: 14, padding: 14,
                                        background: i === 0 ? "#185FA5" : "#E6F1FB",
                                        borderRadius: 12, cursor: "pointer", transition: "all 0.2s"
                                    }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 700, fontSize: 14, flexShrink: 0,
                                            background: i === 0 ? "rgba(255,255,255,0.25)" : i === 1 ? "#B5D4F4" : "#9FE1CB",
                                            color: i === 0 ? "#fff" : i === 1 ? "#0C447C" : "#085041"
                                        }}>
                                            {t.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#fff" : "#042C53" }}>{t.name}</div>
                                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, color: i === 0 ? "#fff" : "#666" }}>{t.subject}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: i === 0 ? "#fff" : "#185FA5" }}>
                                            <span style={{ color: "#F5C400" }}>★</span> 4.9
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute", bottom: -16, right: -20,
                            background: "#1D9E75", color: "#fff", borderRadius: 12, padding: "12px 16px",
                            fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 8px 24px rgba(29,158,117,0.3)",
                            animation: "float 3s ease-in-out infinite"
                        }}>
                            <i className="ti ti-check" style={{ fontSize: 18 }} /> Terverifikasi & Terpercaya
                        </div>
                    </div>
                </div>
            </section>

            {/* KEUNGGULAN */}
            <section id="keunggulan" style={{ padding: "100px 5%", background: "#fafcff" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Mengapa Bergabung?</div>
                    <h2 style={{ fontWeight: 800, fontSize: 40, color: "#042C53", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Keunggulan Menjadi Guru{" "}
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>di Synau</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 540 }}>
                        Platform yang dirancang untuk mendukung karier mengajarmu dengan berbagai fitur dan kemudahan.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 60 }}>
                        {features.map((f) => (
                            <div key={f.title} className="feature-card">
                                <div style={{ width: 48, height: 48, background: "#E6F1FB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 22, color: "#185FA5" }}>
                                    <i className={`ti ${f.icon}`} />
                                </div>
                                <div style={{ fontSize: 17, fontWeight: 700, color: "#042C53", marginBottom: 10 }}>{f.title}</div>
                                <p style={{ fontSize: 14, color: "#777", lineHeight: 1.65 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CARA BERGABUNG */}
            <section id="cara-bergabung" style={{ padding: "100px 5%" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Cara Bergabung</div>
                        <h2 style={{ fontWeight: 800, fontSize: 40, color: "#042C53", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                            Jadi Guru Synau dalam<br />
                            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>4 Langkah Mudah</em>
                        </h2>
                        <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 40 }}>
                            Proses pendaftaran yang sederhana dan cepat. Mulai mengajar dan dapatkan penghasilan tambahan.
                        </p>
                        <div>
                            {steps.map((s, i) => (
                                <div key={s.num} style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: i < steps.length - 1 ? "1px solid #E6F1FB" : "none" }}>
                                    <div style={{ width: 36, height: 36, background: "#185FA5", color: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
                                        {s.num}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#042C53", marginBottom: 6 }}>{s.title}</h3>
                                        <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mockup - Requirements Card */}
                    <div style={{ background: "#E6F1FB", borderRadius: 20, border: "1px solid #B5D4F4", padding: 28, position: "relative", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#042C53", marginBottom: 20 }}>
                            <i className="ti ti-file-check" style={{ color: "#185FA5", marginRight: 8 }} />
                            Dokumen yang Diperlukan
                        </div>
                        {[
                            { icon: "ti-file-cv", label: "Curriculum Vitae (CV)", desc: "Format PDF atau DOC", color: "#185FA5" },
                            { icon: "ti-id", label: "Scan KTP", desc: "Foto jelas, format JPG/PNG/PDF", color: "#378ADD" },
                            { icon: "ti-certificate", label: "Ijazah Min. S1 / Surat Aktif Kuliah", desc: "Bukti pendidikan terakhir", color: "#1D9E75" },
                        ].map((doc, i) => (
                            <div key={doc.label} style={{
                                background: "#fff", border: "1px solid #B5D4F4", borderRadius: 12, padding: 16,
                                marginBottom: i < 2 ? 12 : 0, display: "flex", alignItems: "center", gap: 14
                            }}>
                                <div style={{
                                    width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                                    background: `${doc.color}15`, color: doc.color, fontSize: 20, flexShrink: 0
                                }}>
                                    <i className={`ti ${doc.icon}`} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{doc.label}</div>
                                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{doc.desc}</div>
                                </div>
                                <i className="ti ti-circle-check" style={{ color: "#1D9E75", fontSize: 20 }} />
                            </div>
                        ))}
                        <div style={{
                            marginTop: 16, background: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.2)",
                            borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10
                        }}>
                            <i className="ti ti-info-circle" style={{ color: "#1D9E75", fontSize: 18, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: "#1D9E75", fontWeight: 500, lineHeight: 1.4 }}>
                                Maks. 5MB per file. Format: PDF, DOC, JPG, PNG
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATISTIK */}
            <section style={{ padding: "100px 5%", background: "#042C53" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#85B7EB", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Synau dalam Angka</div>
                    <h2 style={{ fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Bergabung dengan Komunitas<br />
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#85B7EB" }}>Guru Terbaik Indonesia</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 540 }}>
                        Ribuan guru telah mempercayai Synau sebagai platform mengajar pilihan mereka.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 52 }}>
                        {stats.map((s) => (
                            <div key={s.label} className="stat-card">
                                <div style={{ fontSize: 28, marginBottom: 8, color: "#85B7EB" }}>
                                    <i className={`ti ${s.icon}`} />
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{s.num}</div>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONI */}
            <section id="testimoni" style={{ padding: "100px 5%", background: "#fafcff" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 60 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Testimoni Guru</div>
                        <h2 style={{ fontWeight: 800, fontSize: 40, color: "#042C53", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                            Apa Kata{" "}
                            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>Guru Kami?</em>
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                        {testimonials.map((t) => (
                            <div key={t.initials} className="testimonial-card">
                                <div style={{ fontSize: 28, color: "#B5D4F4", marginBottom: 16 }}>"</div>
                                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>{t.quote}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #E6F1FB", paddingTop: 16 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: "50%", background: "#E6F1FB",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 700, fontSize: 13, color: "#185FA5"
                                    }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#042C53" }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: "#888" }}>{t.subject}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #185FA5 0%, #042C53 100%)", textAlign: "center", padding: "100px 5%" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <h2 style={{ fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Siap Bergabung Menjadi{" "}
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#85B7EB" }}>Guru Synau?</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 40 }}>
                        Daftarkan dirimu sekarang dan mulai perjalanan mengajar yang bermakna bersama ribuan siswa di Indonesia.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                        <button className="btn-white" onClick={() => { setAuthTab('register'); setAuthOpen(true) }}>Daftar Sekarang — Gratis!</button>
                        <button className="btn-outline-white" onClick={() => { setAuthTab('login'); setAuthOpen(true) }}>Sudah Punya Akun? Masuk</button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: "#042C53", padding: "60px 5% 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.5px" }}>
                                Syn<span style={{ color: "#85B7EB" }}>au</span>
                            </div>
                            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginTop: 12, maxWidth: 260 }}>
                                Platform bimbingan belajar yang menghubungkan siswa dengan guru terbaik di seluruh Indonesia.
                            </p>
                        </div>
                        {[
                            { title: "Platform", links: ["Cari Guru", "Mata Pelajaran", "Cara Kerja", "Harga"] },
                            { title: "Bergabung", links: ["Daftar Siswa", "Daftar Guru", "Masuk"] },
                            { title: "Perusahaan", links: ["Tentang Kami", "Blog", "Kontak", "Kebijakan Privasi"] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{col.title}</h4>
                                {col.links.map((link) => (
                                    <a key={link} href="#" className="footer-link">{link}</a>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>© 2025 Synau. Hak cipta dilindungi.</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Dibuat dengan ❤️ untuk pendidikan Indonesia</p>
                    </div>
                </div>
            </footer>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
        </div>
    );
}
