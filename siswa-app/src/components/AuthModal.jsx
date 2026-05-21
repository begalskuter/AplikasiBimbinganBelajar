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

function InputField({ label, type = "text", placeholder, value, onChange, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          ...inputStyle,
          borderColor: focused ? "#1565C0" : "#e0e0e0",
          ...style,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });

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
        />
      </div>
      <div style={{ marginBottom: "8px" }}>
        <InputField
          label="Password"
          type="password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <div style={{ textAlign: "right", marginBottom: "24px" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1565C0", textDecoration: "none" }}>
          Lupa password?
        </a>
      </div>
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "13px",
          background: "#1565C0",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: "pointer",
        }}
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
    alamat: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    // TODO: ganti dengan API call ke Laravel
    // const res = await api.post('/auth/register', form);
    console.log("Register payload:", form);
    // onSuccess(res.data.token);
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm({ ...form, [name]: e.target.value }),
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
    style: {
      ...inputStyle,
      borderColor: focusedField === name ? "#1565C0" : "#e0e0e0",
    },
  });

  return (
    <div>
      {/* Nama Lengkap & Panggilan */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Nama Lengkap</label>
          <input type="text" placeholder="Budi Santoso" {...field("namaLengkap")} />
        </div>
        <div>
          <label style={labelStyle}>Nama Panggilan</label>
          <input type="text" placeholder="Budi" {...field("namaPanggilan")} />
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Email</label>
        <input type="email" placeholder="email@contoh.com" {...field("email")} />
      </div>

      {/* Tanggal Lahir & No HP */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Tanggal Lahir</label>
          <input type="date" {...field("tanggalLahir")} />
        </div>
        <div>
          <label style={labelStyle}>No. HP</label>
          <input type="tel" placeholder="08xx-xxxx-xxxx" {...field("noHp")} />
        </div>
      </div>

      {/* Alamat */}
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Alamat</label>
        <textarea
          placeholder="Jl. Contoh No.1, Kota"
          rows={2}
          value={form.alamat}
          onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          onFocus={() => setFocusedField("alamat")}
          onBlur={() => setFocusedField(null)}
          style={{
            ...inputStyle,
            resize: "none",
            borderColor: focusedField === "alamat" ? "#1565C0" : "#e0e0e0",
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Password</label>
        <input type="password" placeholder="Min. 8 karakter" {...field("password")} />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "13px",
          background: "#1565C0",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: "pointer",
        }}
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
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "460px",
            padding: "40px",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {/* Tombol tutup */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#f5f5f5",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "18px",
              color: "#666",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "26px", fontWeight: "800", color: "#1565C0", letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Synau
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>
              {activeTab === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
            </div>
            <div style={{ fontSize: "14px", color: "#777" }}>
              {activeTab === "login"
                ? "Selamat datang kembali! Silakan masuk."
                : "Daftar gratis dan mulai belajar hari ini."}
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#f0f4ff", borderRadius: "12px", padding: "4px", marginBottom: "28px" }}>
            <button style={tabBtn("login")} onClick={() => setActiveTab("login")}>Masuk</button>
            <button style={tabBtn("register")} onClick={() => setActiveTab("register")}>Daftar</button>
          </div>

          {/* Form */}
          {activeTab === "login" ? (
            <LoginForm onSuccess={(token) => { console.log("token:", token); onClose(); }} />
          ) : (
            <RegisterForm onSuccess={(token) => { console.log("token:", token); onClose(); }} />
          )}
        </div>
      </div>
    </>
  );
}