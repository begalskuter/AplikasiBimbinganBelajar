import { useState, useEffect } from "react";

const STYLES = `
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);    }
  }
  @keyframes overlayFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .auth-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(4, 44, 83, 0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: overlayFadeIn 0.2s ease;
  }

  .auth-modal {
    background: #fff;
    border-radius: 24px;
    width: 100%; max-width: 480px;
    max-height: 92vh;
    overflow-y: auto;
    padding: 40px 40px 36px;
    box-shadow: 0 24px 80px rgba(4, 44, 83, 0.2);
    animation: modalFadeIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }

  .auth-tab-btn {
    flex: 1; padding: 10px 0; border: none; background: transparent;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    border-radius: 10px; transition: all 0.2s;
    color: #888;
  }
  .auth-tab-btn.active {
    background: #185FA5; color: #fff;
    box-shadow: 0 4px 12px rgba(24, 95, 165, 0.3);
  }

  .auth-input-group { margin-bottom: 18px; }
  .auth-input-group label {
    display: block; font-size: 13px; font-weight: 600;
    color: #374151; margin-bottom: 6px;
  }
  .auth-input {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #E5E7EB;
    border-radius: 10px; font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1a1a2e; background: #F9FAFB;
    outline: none; transition: all 0.2s;
    box-sizing: border-box;
  }
  .auth-input:focus {
    border-color: #378ADD;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(55,138,221,0.12);
  }
  .auth-input::placeholder { color: #B0B8C4; }

  .auth-input-icon-wrap {
    position: relative;
  }
  .auth-input-icon-wrap .auth-input {
    padding-left: 40px;
  }
  .auth-input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: #9CA3AF; font-size: 17px; pointer-events: none;
  }
  .auth-input-icon-wrap .eye-toggle {
    position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #9CA3AF; font-size: 17px; padding: 0;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .auth-input-icon-wrap .eye-toggle:hover { color: #378ADD; }

  .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .auth-btn-submit {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #185FA5 0%, #378ADD 100%);
    color: #fff; border: none; border-radius: 12px;
    font-size: 15px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 16px rgba(24,95,165,0.25);
    margin-top: 6px;
  }
  .auth-btn-submit:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(24,95,165,0.35);
  }
  .auth-btn-submit:active { transform: translateY(0); }

  .auth-divider {
    display: flex; align-items: center; gap: 12; margin: 20px 0;
  }
  .auth-divider-line {
    flex: 1; height: 1px; background: #E5E7EB;
  }
  .auth-divider-text {
    font-size: 12px; color: #9CA3AF; font-weight: 500; white-space: nowrap;
    padding: 0 8px;
  }

  .auth-close-btn {
    position: absolute; top: 18px; right: 18px;
    background: #F3F4F6; border: none; border-radius: 8px;
    width: 34px; height: 34px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; color: #6B7280;
    font-size: 18px; transition: all 0.2s;
  }
  .auth-close-btn:hover { background: #E5E7EB; color: #374151; }

  .auth-switch-link {
    color: #185FA5; font-weight: 600; cursor: pointer;
    background: none; border: none; font-size: inherit;
    font-family: inherit; text-decoration: underline; padding: 0;
  }
  .auth-switch-link:hover { color: #0C447C; }

  .auth-error {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: #B91C1C;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px;
  }
`;

function EyeIcon({ show }) {
  return show ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function LoginForm({ onSwitchToRegister, onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    // TODO: ganti dengan API call ke Laravel
    setTimeout(() => {
      setLoading(false);
      // Simulasi sukses — nanti replace dengan navigate('/dashboard')
      alert("Login berhasil! (Hubungkan ke API Laravel)");
      onClose();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="auth-error">
          <i className="ti ti-alert-circle" style={{ fontSize: 16 }} />
          {error}
        </div>
      )}

      {/* Email */}
      <div className="auth-input-group">
        <label htmlFor="login-email">Email</label>
        <div className="auth-input-icon-wrap">
          <i className="ti ti-mail auth-input-icon" />
          <input
            id="login-email"
            type="email"
            className="auth-input"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="auth-input-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label htmlFor="login-password" style={{ margin: 0 }}>Password</label>
          <a href="#" style={{ fontSize: 12, color: "#185FA5", fontWeight: 600, textDecoration: "none" }}
            onClick={(e) => e.preventDefault()}>
            Lupa password?
          </a>
        </div>
        <div className="auth-input-icon-wrap">
          <i className="ti ti-lock auth-input-icon" />
          <input
            id="login-password"
            type={showPw ? "text" : "password"}
            className="auth-input"
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
          <button type="button" className="eye-toggle" onClick={() => setShowPw(!showPw)}>
            <EyeIcon show={showPw} />
          </button>
        </div>
      </div>

      <button type="submit" className="auth-btn-submit" disabled={loading}>
        {loading ? (
          <>
            <svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
            </svg>
            Memproses...
          </>
        ) : (
          <>
            <i className="ti ti-login" />
            Masuk ke Synau
          </>
        )}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 20 }}>
        Belum punya akun?{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitchToRegister}>
          Daftar gratis
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitchToLogin, onClose }) {
  const [form, setForm] = useState({
    namaLengkap: "", namaPanggilan: "", email: "",
    tanggalLahir: "", alamat: "", password: "", konfirmasiPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { namaLengkap, namaPanggilan, email, tanggalLahir, alamat, password, konfirmasiPassword } = form;
    if (!namaLengkap || !namaPanggilan || !email || !tanggalLahir || !alamat || !password || !konfirmasiPassword) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== konfirmasiPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setLoading(true);
    // TODO: ganti dengan API call ke Laravel
    setTimeout(() => {
      setLoading(false);
      alert("Registrasi berhasil! (Hubungkan ke API Laravel)");
      onClose();
    }, 1400);
  };

  const inp = (id, label, type, placeholder, field, extra = {}) => (
    <div className="auth-input-group" style={extra.fullWidth ? {} : {}}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-icon-wrap">
        {extra.icon && <i className={`ti ${extra.icon} auth-input-icon`} />}
        <input
          id={id}
          type={type}
          className="auth-input"
          placeholder={placeholder}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          style={extra.icon ? {} : { paddingLeft: 14 }}
          autoComplete={extra.autoComplete}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="auth-error">
          <i className="ti ti-alert-circle" style={{ fontSize: 16 }} />
          {error}
        </div>
      )}

      {/* Nama Lengkap + Panggilan */}
      <div className="auth-row">
        <div className="auth-input-group">
          <label htmlFor="reg-nama-lengkap">Nama Lengkap</label>
          <div className="auth-input-icon-wrap">
            <i className="ti ti-user auth-input-icon" />
            <input id="reg-nama-lengkap" type="text" className="auth-input"
              placeholder="Nama lengkap" value={form.namaLengkap}
              onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
              autoComplete="name" />
          </div>
        </div>
        <div className="auth-input-group">
          <label htmlFor="reg-nama-panggilan">Nama Panggilan</label>
          <div className="auth-input-icon-wrap">
            <i className="ti ti-id-badge auth-input-icon" />
            <input id="reg-nama-panggilan" type="text" className="auth-input"
              placeholder="Nama panggilan" value={form.namaPanggilan}
              onChange={(e) => setForm({ ...form, namaPanggilan: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="auth-input-group">
        <label htmlFor="reg-email">Email</label>
        <div className="auth-input-icon-wrap">
          <i className="ti ti-mail auth-input-icon" />
          <input id="reg-email" type="email" className="auth-input"
            placeholder="nama@email.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email" />
        </div>
      </div>

      {/* Tanggal Lahir */}
      <div className="auth-input-group">
        <label htmlFor="reg-tgl-lahir">Tanggal Lahir</label>
        <div className="auth-input-icon-wrap">
          <i className="ti ti-calendar auth-input-icon" />
          <input id="reg-tgl-lahir" type="date" className="auth-input"
            value={form.tanggalLahir}
            onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
            max={new Date().toISOString().split("T")[0]} />
        </div>
      </div>

      {/* Alamat */}
      <div className="auth-input-group">
        <label htmlFor="reg-alamat">Alamat</label>
        <div className="auth-input-icon-wrap">
          <i className="ti ti-map-pin auth-input-icon" />
          <input id="reg-alamat" type="text" className="auth-input"
            placeholder="Jl. Contoh No. 1, Kota" value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            autoComplete="street-address" />
        </div>
      </div>

      {/* Password + Konfirmasi */}
      <div className="auth-row">
        <div className="auth-input-group">
          <label htmlFor="reg-password">Password</label>
          <div className="auth-input-icon-wrap">
            <i className="ti ti-lock auth-input-icon" />
            <input id="reg-password" type={showPw ? "text" : "password"}
              className="auth-input" placeholder="Min. 8 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password" />
            <button type="button" className="eye-toggle" onClick={() => setShowPw(!showPw)}>
              <EyeIcon show={showPw} />
            </button>
          </div>
        </div>
        <div className="auth-input-group">
          <label htmlFor="reg-konfirmasi">Konfirmasi</label>
          <div className="auth-input-icon-wrap">
            <i className="ti ti-lock-check auth-input-icon" />
            <input id="reg-konfirmasi" type={showPw2 ? "text" : "password"}
              className="auth-input" placeholder="Ulangi password"
              value={form.konfirmasiPassword}
              onChange={(e) => setForm({ ...form, konfirmasiPassword: e.target.value })}
              autoComplete="new-password" />
            <button type="button" className="eye-toggle" onClick={() => setShowPw2(!showPw2)}>
              <EyeIcon show={showPw2} />
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="auth-btn-submit" disabled={loading}>
        {loading ? (
          <>
            <svg style={{ animation: "spin 1s linear infinite", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
            </svg>
            Mendaftar...
          </>
        ) : (
          <>
            <i className="ti ti-rocket" />
            Daftar Sekarang
          </>
        )}
      </button>

      <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 20 }}>
        Sudah punya akun?{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitchToLogin}>
          Masuk di sini
        </button>
      </p>
    </form>
  );
}

export default function AuthModal({ isOpen, defaultTab = "login", onClose }) {
  const [tab, setTab] = useState(defaultTab);

  // Sync tab saat modal dibuka dari tombol berbeda
  useEffect(() => {
    if (isOpen) setTab(defaultTab);
  }, [isOpen, defaultTab]);

  // Tutup modal saat tekan Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Cegah scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{STYLES}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Overlay — klik di luar = tutup */}
      <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="auth-modal">
          {/* Tombol tutup */}
          <button className="auth-close-btn" onClick={onClose} aria-label="Tutup">
            <i className="ti ti-x" />
          </button>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 26, color: "#0C447C", letterSpacing: "-0.5px", marginBottom: 4 }}>
              Syn<span style={{ color: "#378ADD" }}>au</span>
            </div>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>
              {tab === "login" ? "Selamat datang kembali! 👋" : "Bergabung dan mulai belajar! 🚀"}
            </p>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 28, gap: 4 }}>
            <button className={`auth-tab-btn ${tab === "login" ? "active" : ""}`}
              type="button" onClick={() => setTab("login")}>
              <i className="ti ti-login" style={{ marginRight: 6 }} />
              Masuk
            </button>
            <button className={`auth-tab-btn ${tab === "register" ? "active" : ""}`}
              type="button" onClick={() => setTab("register")}>
              <i className="ti ti-user-plus" style={{ marginRight: 6 }} />
              Daftar
            </button>
          </div>

          {/* Form */}
          {tab === "login" ? (
            <LoginForm onSwitchToRegister={() => setTab("register")} onClose={onClose} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setTab("login")} onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
}
