import { useEffect, useState } from "react";

const features = [
    {
        icon: "ti-map-pin",
        title: "Guru di Sekitarmu",
        desc: "Temukan guru terbaik berdasarkan lokasi dan mata pelajaran yang kamu butuhkan dengan mudah.",
    },
    {
        icon: "ti-star",
        title: "Rating & Ulasan Nyata",
        desc: "Setiap guru memiliki rating dari siswa nyata. Pilih guru dengan percaya diri berdasarkan ulasan terpercaya.",
    },
    {
        icon: "ti-calendar",
        title: "Jadwal Fleksibel",
        desc: "Atur jadwal belajar sesuai waktu luangmu. Booking sesi kapan saja langsung dari aplikasi.",
    },
    {
        icon: "ti-shield-check",
        title: "Guru Terverifikasi",
        desc: "Semua guru telah melalui proses verifikasi ketat untuk memastikan kualitas pengajaran terbaik.",
    },
    {
        icon: "ti-chart-line",
        title: "Pantau Perkembangan",
        desc: "Dashboard siswa yang lengkap untuk memantau progres belajar dan pencapaian dari waktu ke waktu.",
    },
    {
        icon: "ti-messages",
        title: "Konsultasi Langsung",
        desc: "Chat langsung dengan guru sebelum booking untuk memastikan kecocokan metode belajar.",
    },
];

const steps = [
    { num: "1", title: "Buat Akun Gratis", desc: "Daftar dengan email dan lengkapi profil singkat kamu. Cukup 2 menit!" },
    { num: "2", title: "Cari Guru yang Tepat", desc: "Filter berdasarkan mata pelajaran, lokasi, rating, dan jadwal yang sesuai." },
    { num: "3", title: "Booking Sesi Belajar", desc: "Pilih waktu yang cocok dan konfirmasi booking langsung dari platform." },
    { num: "4", title: "Mulai Belajar!", desc: "Ikuti sesi belajar dan raih prestasi terbaikmu bersama guru pilihan." },
];

const subjects = [
    { icon: "🧮", name: "Matematika", count: "280+ guru" },
    { icon: "⚗️", name: "IPA & Kimia", count: "195+ guru" },
    { icon: "🌍", name: "Bahasa Inggris", count: "310+ guru" },
    { icon: "📖", name: "Bahasa Indonesia", count: "150+ guru" },
    { icon: "⚡", name: "Fisika", count: "172+ guru" },
    { icon: "🖥️", name: "Informatika", count: "98+ guru" },
    { icon: "🗺️", name: "IPS & Sejarah", count: "134+ guru" },
    { icon: "🎨", name: "Seni & Budaya", count: "67+ guru" },
];

const topGurus = [
    { initials: "BW", name: "Bu Wulandari", subject: "Matematika · Yogyakarta", rating: "4.9", featured: true },
    { initials: "AP", name: "Pak Andi", subject: "Fisika · Semarang", rating: "4.8", featured: false },
    { initials: "SR", name: "Bu Sari", subject: "Bahasa Inggris · Magelang", rating: "4.8", featured: false },
];

const searchResults = [
    { initials: "BW", name: "Bu Wulandari, S.Pd", subject: "Matematika · SMP & SMA", rating: "4.9", highlighted: false },
    { initials: "RP", name: "Pak Rudi Prasetyo", subject: "Matematika · SMA & Kuliah", rating: "4.8", highlighted: true },
    { initials: "DH", name: "Bu Dewi Hartini", subject: "Matematika · SD & SMP", rating: "4.7", highlighted: false },
];

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", color: "#1a1a2e", overflowX: "hidden" }}>
            {/* Google Fonts */}
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

        .subject-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .subject-card:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--blue-400);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .guru-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: var(--blue-50);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .guru-item:hover { background: var(--blue-100); }
        .guru-item.featured { background: var(--blue-600); color: #fff; }

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
                        <a href="#fitur" className="nav-link">Fitur</a>
                        <a href="#cara-kerja" className="nav-link">Cara Kerja</a>
                        <a href="#mapel" className="nav-link">Mata Pelajaran</a>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
                        <a href="/login" className="nav-link" style={{ color: "#185FA5", fontWeight: 600 }}>Masuk</a>
                        <a href="/register" className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }}>Daftar Gratis</a>
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
                            Platform Bimbel #1 di Indonesia
                        </div>
                        <h1 style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: "#042C53", letterSpacing: "-1.5px", marginBottom: 20 }}>
                            Belajar Lebih{" "}
                            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>Cerdas</em>
                            {" "}Bersama Guru Terbaik
                        </h1>
                        <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                            Synau menghubungkan siswa dengan guru berpengalaman di sekitar kota kamu. Belajar kapan saja, di mana saja, dengan metode yang tepat.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <a href="/register" className="btn-primary">
                                <i className="ti ti-rocket" /> Mulai Belajar
                            </a>
                            <a href="#cara-kerja" className="btn-secondary">Lihat Cara Kerja</a>
                        </div>
                        <div style={{ display: "flex", gap: 32, marginTop: 44, paddingTop: 36, borderTop: "1px solid #B5D4F4" }}>
                            {[["12K+", "Siswa Aktif"], ["800+", "Guru Terverifikasi"], ["4.9★", "Rating Platform"]].map(([num, label]) => (
                                <div key={label}>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: "#0C447C", letterSpacing: "-1px" }}>{num}</div>
                                    <div style={{ fontSize: 13, color: "#888", fontWeight: 500, marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Guru Card */}
                    <div style={{ position: "relative" }}>
                        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #B5D4F4", padding: 24, boxShadow: "0 20px 60px rgba(24,95,165,0.12)" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                                <i className="ti ti-star-filled" style={{ color: "#F5C400", fontSize: 14 }} /> Guru Terbaik di Kotamu
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {topGurus.map((g) => (
                                    <div key={g.initials} className={`guru-item${g.featured ? " featured" : ""}`}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 700, fontSize: 14, flexShrink: 0,
                                            background: g.featured ? "rgba(255,255,255,0.25)" : g.initials === "AP" ? "#B5D4F4" : "#9FE1CB",
                                            color: g.featured ? "#fff" : g.initials === "AP" ? "#0C447C" : "#085041"
                                        }}>
                                            {g.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: g.featured ? "#fff" : "#042C53" }}>{g.name}</div>
                                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, color: g.featured ? "#fff" : "#666" }}>{g.subject}</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: g.featured ? "#fff" : "#185FA5" }}>
                                            <span style={{ color: "#F5C400" }}>★</span> {g.rating}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{
                            position: "absolute", bottom: -16, right: -20,
                            background: "#1D9E75", color: "#fff", borderRadius: 12, padding: "12px 16px",
                            fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 8px 24px rgba(29,158,117,0.3)"
                        }}>
                            <i className="ti ti-map-pin" style={{ fontSize: 18 }} /> Guru di sekitar kamu
                        </div>
                    </div>
                </div>
            </section>

            {/* FITUR */}
            <section id="fitur" style={{ padding: "100px 5%", background: "#fafcff" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Mengapa Synau?</div>
                    <h2 style={{ fontWeight: 800, fontSize: 40, color: "#042C53", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Semua yang Kamu Butuhkan<br />untuk{" "}
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>Belajar Optimal</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 540 }}>
                        Dari mencari guru hingga booking sesi belajar, semuanya mudah dan cepat di Synau.
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

            {/* CARA KERJA */}
            <section id="cara-kerja" style={{ padding: "100px 5%" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Cara Kerja</div>
                        <h2 style={{ fontWeight: 800, fontSize: 40, color: "#042C53", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                            Mulai Belajar dalam<br />
                            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#378ADD" }}>4 Langkah Mudah</em>
                        </h2>
                        <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 40 }}>
                            Proses yang sederhana agar kamu bisa langsung fokus belajar tanpa ribet.
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

                    {/* Mockup */}
                    <div style={{ background: "#E6F1FB", borderRadius: 20, border: "1px solid #B5D4F4", padding: 24, position: "relative", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                        </div>
                        <div style={{ background: "#fff", border: "1px solid #B5D4F4", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <i className="ti ti-search" style={{ color: "#378ADD", fontSize: 18 }} />
                            <span style={{ fontSize: 13, color: "#aaa" }}>Cari guru Matematika...</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, fontWeight: 600 }}>12 guru ditemukan di Yogyakarta</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {searchResults.map((r) => (
                                <div key={r.initials} style={{
                                    background: r.highlighted ? "#E6F1FB" : "#fff",
                                    border: `1px solid ${r.highlighted ? "#85B7EB" : "#B5D4F4"}`,
                                    borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                                        background: r.highlighted ? "#185FA5" : r.initials === "DH" ? "#9FE1CB" : "#B5D4F4",
                                        color: r.highlighted ? "#fff" : r.initials === "DH" ? "#085041" : "#0C447C"
                                    }}>
                                        {r.initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53" }}>{r.name}</div>
                                        <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{r.subject}</div>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "#185FA5", display: "flex", alignItems: "center", gap: 3 }}>
                                        <span style={{ color: "#F5C400", fontSize: 13 }}>★</span> {r.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MATA PELAJARAN */}
            <section id="mapel" style={{ padding: "100px 5%", background: "#042C53" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#85B7EB", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>Mata Pelajaran</div>
                    <h2 style={{ fontWeight: 800, fontSize: 40, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Ratusan Guru untuk<br />
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#85B7EB" }}>Semua Mata Pelajaran</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 540 }}>
                        Dari MIPA hingga Bahasa, temukan guru terbaik untuk setiap kebutuhanmu.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 52 }}>
                        {subjects.map((s) => (
                            <div key={s.name} className="subject-card">
                                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.name}</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{s.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #185FA5 0%, #042C53 100%)", textAlign: "center", padding: "100px 5%" }}>
                <div style={{ maxWidth: 640, margin: "0 auto" }}>
                    <h2 style={{ fontWeight: 800, fontSize: 44, color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>
                        Siap Raih Prestasi{" "}
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", color: "#85B7EB" }}>Terbaikmu?</em>
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 40 }}>
                        Bergabunglah bersama ribuan siswa yang sudah merasakan manfaat belajar bersama Synau.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                        <a href="/register" className="btn-white">Daftar Sekarang — Gratis!</a>
                        <a href="#mapel" className="btn-outline-white">Lihat Guru Tersedia</a>
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
        </div>
    );
}