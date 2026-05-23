import { useState } from "react";
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #e0e0e0",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#444",
  marginBottom: "6px",
};

const dataWilayah = {
  "DI Yogyakarta": ["Kota Yogyakarta", "Kabupaten Sleman", "Kabupaten Bantul", "Kabupaten Gunungkidul", "Kabupaten Kulonprogo"],
  "Jawa Tengah": ["Kota Semarang", "Kota Magelang", "Kabupaten Magelang", "Kabupaten Klaten", "Kabupaten Purworejo", "Kota Surakarta"],
  "Jawa Barat": ["Kota Bandung", "Kota Bogor", "Kota Bekasi", "Kabupaten Bogor", "Kabupaten Bekasi"],
  "Jawa Timur": ["Kota Surabaya", "Kota Malang", "Kabupaten Malang", "Kota Kediri"],
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur"],
};

function InputField({ label, type = "text", placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ ...inputStyle, borderColor: focused ? "#1565C0" : "#e0e0e0" }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder, focused, onFocus, onBlur }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ ...inputStyle, borderColor: focused ? "#1565C0" : "#e0e0e0", color: value ? "#1a1a1a" : "#aaa", background: "#fff", cursor: "pointer" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16, textAlign: "center" }}>
      {message}
    </div>
  );
}

function LoginForm({ onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ErrorBox message={error} />
      <div style={{ marginBottom: "16px" }}>
        <InputField
          label="Email" type="email" placeholder="email@contoh.com"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          focused={focused === "email"} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
        />
      </div>
      <div style={{ marginBottom: "8px" }}>
        <InputField
          label="Password" type="password" placeholder="Masukkan password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          focused={focused === "password"} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
        />
      </div>
      <div style={{ textAlign: "right", marginBottom: "24px" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1565C0", textDecoration: "none" }}>Lupa password?</a>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "13px", background: loading ? "#93C5FD" : "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </div>
  );
}

function RegisterForm({ onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    namaLengkap: "", namaPanggilan: "", email: "",
    tanggalLahir: "", noHp: "", alamatLengkap: "",
    kelurahan: "", kecamatan: "", kota: "", provinsi: "", password: "",
  });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const f = (name) => ({
    value: form[name],
    onChange: (e) => {
      const updated = { ...form, [name]: e.target.value };
      if (name === "provinsi") updated.kota = "";
      setForm(updated);
    },
    focused: focused === name,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  const kotaOptions = form.provinsi ? dataWilayah[form.provinsi] ?? [] : [];

  const handleSubmit = async () => {
    if (!form.namaLengkap || !form.email || !form.password) {
      setError("Nama lengkap, email, dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/auth/register', {
        name: form.namaLengkap,
        nama_panggilan: form.namaPanggilan,
        email: form.email,
        password: form.password,
        tanggal_lahir: form.tanggalLahir || null,
        no_hp: form.noHp,
        alamat_lengkap: form.alamatLengkap,
        kelurahan: form.kelurahan,
        kecamatan: form.kecamatan,
        kota: form.kota,
        provinsi: form.provinsi,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onClose();
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ErrorBox message={error} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Nama Lengkap" placeholder="Budi Santoso" {...f("namaLengkap")} />
        <InputField label="Nama Panggilan" placeholder="Budi" {...f("namaPanggilan")} />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <InputField label="Email" type="email" placeholder="email@contoh.com" {...f("email")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Tanggal Lahir" type="date" {...f("tanggalLahir")} />
        <InputField label="No. HP" type="tel" placeholder="08xx-xxxx-xxxx" {...f("noHp")} />
      </div>

      <div style={{ fontSize: "12px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px", marginTop: "4px" }}>
        Alamat
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Jalan / No. Rumah / RT/RW</label>
        <textarea
          placeholder="Jl. Contoh No.1, RT 02/RW 03" rows={2}
          value={form.alamatLengkap}
          onChange={(e) => setForm({ ...form, alamatLengkap: e.target.value })}
          onFocus={() => setFocused("alamatLengkap")} onBlur={() => setFocused(null)}
          style={{ ...inputStyle, resize: "none", borderColor: focused === "alamatLengkap" ? "#1565C0" : "#e0e0e0" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Kelurahan / Desa" placeholder="Mlati" {...f("kelurahan")} />
        <InputField label="Kecamatan" placeholder="Mlati" {...f("kecamatan")} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <SelectField label="Provinsi" placeholder="Pilih provinsi..." options={Object.keys(dataWilayah)} {...f("provinsi")} />
        <SelectField label="Kota / Kabupaten" placeholder={form.provinsi ? "Pilih kota..." : "Pilih provinsi dulu"} options={kotaOptions} {...f("kota")} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <InputField label="Password" type="password" placeholder="Min. 8 karakter" {...f("password")} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "13px", background: loading ? "#93C5FD" : "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Memproses..." : "Daftar Sekarang"}
      </button>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  const tabBtn = (tab) => ({
    flex: 1, padding: "10px", border: "none", borderRadius: "9px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    background: activeTab === tab ? "#1565C0" : "transparent",
    color: activeTab === tab ? "#fff" : "#1565C0",
    transition: "all 0.2s",
  });

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px", position: "relative", maxHeight: "90vh", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {/* HEADER */}
        <div style={{ padding: "36px 40px 0", flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "16px", right: "16px", background: "#f5f5f5", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "18px", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >×</button>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#1565C0", letterSpacing: "-0.5px", marginBottom: "4px" }}>Synau</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>
              {activeTab === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
            </div>
            <div style={{ fontSize: "14px", color: "#777" }}>
              {activeTab === "login" ? "Selamat datang kembali! Silakan masuk." : "Daftar gratis dan mulai belajar hari ini."}
            </div>
          </div>

          <div style={{ display: "flex", background: "#f0f4ff", borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
            <button style={tabBtn("login")} onClick={() => setActiveTab("login")}>Masuk</button>
            <button style={tabBtn("register")} onClick={() => setActiveTab("register")}>Daftar</button>
          </div>
        </div>

        {/* FORM */}
        <div style={{ padding: "0 40px 36px", overflowY: "auto", flex: 1 }}>
          {activeTab === "login"
            ? <LoginForm onClose={onClose} />
            : <RegisterForm onClose={onClose} />
          }
        </div>
      </div>
    </div>
  );
}