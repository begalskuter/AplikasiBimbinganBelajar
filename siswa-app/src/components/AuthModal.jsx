import { useState } from "react";

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

// Data provinsi & kota — nanti bisa diambil dari API wilayah Indonesia
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
        style={{
          ...inputStyle,
          borderColor: focused ? "#1565C0" : "#e0e0e0",
          color: value ? "#1a1a1a" : "#aaa",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);

  const handleSubmit = async () => {
    // TODO: ganti dengan API call ke Laravel
    // const res = await api.post('/auth/login', form);
    console.log("Login payload:", form);
    // onSuccess(res.data.token);
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <InputField
          label="Email"
          type="email"
          placeholder="email@contoh.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          focused={focused === "email"}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
        />
      </div>
      <div style={{ marginBottom: "8px" }}>
        <InputField
          label="Password"
          type="password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          focused={focused === "password"}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused(null)}
        />
      </div>
      <div style={{ textAlign: "right", marginBottom: "24px" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1565C0", textDecoration: "none" }}>
          Lupa password?
        </a>
      </div>
      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
      >
        Masuk
      </button>
    </div>
  );
}

function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    email: "",
    tanggalLahir: "",
    noHp: "",
    alamatLengkap: "",   // jalan, no rumah, RT/RW
    kelurahan: "",
    kecamatan: "",
    kota: "",            // dari dropdown — ini yang dipakai filter LBS
    provinsi: "",
    password: "",
  });
  const [focused, setFocused] = useState(null);

  const f = (name) => ({
    value: form[name],
    onChange: (e) => {
      const updated = { ...form, [name]: e.target.value };
      // Reset kota saat provinsi berubah
      if (name === "provinsi") updated.kota = "";
      setForm(updated);
    },
    focused: focused === name,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
  });

  const kotaOptions = form.provinsi ? dataWilayah[form.provinsi] ?? [] : [];

  const handleSubmit = async () => {
    // TODO: ganti dengan API call ke Laravel
    // Payload sudah include 'kota' yang bersih untuk filter LBS
    // const res = await api.post('/auth/register', form);
    console.log("Register payload:", form);
    // onSuccess(res.data.token);
  };

  return (
    <div>
      {/* Nama */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Nama Lengkap" placeholder="Budi Santoso" {...f("namaLengkap")} />
        <InputField label="Nama Panggilan" placeholder="Budi" {...f("namaPanggilan")} />
      </div>

      {/* Email */}
      <div style={{ marginBottom: "14px" }}>
        <InputField label="Email" type="email" placeholder="email@contoh.com" {...f("email")} />
      </div>

      {/* Tanggal Lahir & No HP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Tanggal Lahir" type="date" {...f("tanggalLahir")} />
        <InputField label="No. HP" type="tel" placeholder="08xx-xxxx-xxxx" {...f("noHp")} />
      </div>

      {/* Divider alamat */}
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px", marginTop: "4px" }}>
        Alamat
      </div>

      {/* Alamat Lengkap */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Jalan / No. Rumah / RT/RW</label>
        <textarea
          placeholder="Jl. Contoh No.1, RT 02/RW 03"
          rows={2}
          value={form.alamatLengkap}
          onChange={(e) => setForm({ ...form, alamatLengkap: e.target.value })}
          onFocus={() => setFocused("alamatLengkap")}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle, resize: "none", borderColor: focused === "alamatLengkap" ? "#1565C0" : "#e0e0e0" }}
        />
      </div>

      {/* Kelurahan & Kecamatan */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <InputField label="Kelurahan / Desa" placeholder="Mlati" {...f("kelurahan")} />
        <InputField label="Kecamatan" placeholder="Mlati" {...f("kecamatan")} />
      </div>

      {/* Provinsi & Kota */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <SelectField
          label="Provinsi"
          placeholder="Pilih provinsi..."
          options={Object.keys(dataWilayah)}
          {...f("provinsi")}
        />
        <SelectField
          label="Kota / Kabupaten"
          placeholder={form.provinsi ? "Pilih kota..." : "Pilih provinsi dulu"}
          options={kotaOptions}
          {...f("kota")}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "20px" }}>
        <InputField label="Password" type="password" placeholder="Min. 8 karakter" {...f("password")} />
      </div>

      <button
        onClick={handleSubmit}
        style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}
      >
        Daftar Sekarang
      </button>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  const tabBtn = (tab) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
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
        {/* ── HEADER (tidak ikut scroll) ── */}
        <div style={{ padding: "36px 40px 0", flexShrink: 0 }}>
          {/* Tombol tutup */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "16px", right: "16px", background: "#f5f5f5", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "18px", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>

          {/* Logo + judul */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#1565C0", letterSpacing: "-0.5px", marginBottom: "4px" }}>Synau</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>
              {activeTab === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
            </div>
            <div style={{ fontSize: "14px", color: "#777" }}>
              {activeTab === "login" ? "Selamat datang kembali! Silakan masuk." : "Daftar gratis dan mulai belajar hari ini."}
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#f0f4ff", borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
            <button style={tabBtn("login")} onClick={() => setActiveTab("login")}>Masuk</button>
            <button style={tabBtn("register")} onClick={() => setActiveTab("register")}>Daftar</button>
          </div>
        </div>

        {/* ── FORM (bagian yang scroll) ── */}
        <div style={{ padding: "0 40px 36px", overflowY: "auto", flex: 1 }}>
          {activeTab === "login" ? (
            <LoginForm onSuccess={(token) => { console.log("token:", token); onClose(); }} />
          ) : (
            <RegisterForm onSuccess={(token) => { console.log("token:", token); onClose(); }} />
          )}
        </div>
      </div>
    </div>
  );
}