import { useState, useEffect } from "react";

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

function InputField({ label, type = "text", placeholder, value, onChange, style = {}, accept, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        accept={accept}
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

function FileUploadField({ label, accept, description, icon, onChange, fileName }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={labelStyle}>{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "#1565C0" : fileName ? "#1D9E75" : "#d0d0d0"}`,
          borderRadius: "10px",
          padding: "16px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "#f0f4ff" : fileName ? "#f0faf5" : "#fafafa",
          transition: "all 0.2s",
          position: "relative",
        }}
        onClick={() => document.getElementById(`file-${label.replace(/\s/g, '')}`).click()}
      >
        <input
          id={`file-${label.replace(/\s/g, '')}`}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
          style={{ display: "none" }}
        />
        {fileName ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18, color: "#1D9E75" }}>✓</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1D9E75" }}>{fileName}</span>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 24, color: "#aaa", marginBottom: 4 }}>{icon || "📎"}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>Klik atau seret file ke sini</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{description}</div>
          </>
        )}
      </div>
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
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
      >
        Masuk
      </button>
    </div>
  );
}

function RegisterForm({ onSuccess, onRegisterSuccess }) {
  const [form, setForm] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    email: "",
    tanggalLahir: "",
    noHp: "",
    alamat: "",
    password: "",
  });
  const [files, setFiles] = useState({
    cv: null,
    ktp: null,
    ijazah: null,
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['namaLengkap', 'email', 'password'];
    for (const key of requiredFields) {
      if (!form[key]) {
        alert("Harap isi semua field yang wajib.");
        return;
      }
    }
    if (!files.cv || !files.ktp || !files.ijazah) {
      alert("Harap upload semua dokumen yang diperlukan (CV, KTP, Ijazah/Surat Aktif Kuliah).");
      return;
    }

    // Build FormData for file upload
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    // TODO: ganti dengan API call ke Laravel
    // const res = await api.post('/auth/register-guru', formData);
    console.log("Register payload:", form, files);

    // Show success message
    onRegisterSuccess();
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
          <input type="text" placeholder="Dewi Puspitasari" {...field("namaLengkap")} />
        </div>
        <div>
          <label style={labelStyle}>Nama Panggilan</label>
          <input type="text" placeholder="Dewi" {...field("namaPanggilan")} />
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

      {/* Divider */}
      <div style={{
        borderTop: "1px solid #e8e8e8",
        margin: "8px 0 20px",
        position: "relative",
      }}>
        <span style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: "#fff", padding: "0 12px", fontSize: 12, fontWeight: 600, color: "#999",
        }}>
          Dokumen Pendaftaran
        </span>
      </div>

      {/* Upload CV */}
      <FileUploadField
        label="Upload CV"
        accept=".pdf,.doc,.docx"
        description="Format: PDF atau DOC (maks. 5MB)"
        icon="📄"
        fileName={files.cv?.name}
        onChange={(file) => setFiles({ ...files, cv: file })}
      />

      {/* Scan KTP */}
      <FileUploadField
        label="Scan KTP"
        accept=".jpg,.jpeg,.png,.pdf"
        description="Format: JPG, PNG, atau PDF (maks. 5MB)"
        icon="🪪"
        fileName={files.ktp?.name}
        onChange={(file) => setFiles({ ...files, ktp: file })}
      />

      {/* Ijazah / Surat Aktif Kuliah */}
      <FileUploadField
        label="Ijazah Min. S1 / Surat Aktif Kuliah"
        accept=".jpg,.jpeg,.png,.pdf"
        description="Format: JPG, PNG, atau PDF (maks. 5MB)"
        icon="🎓"
        fileName={files.ijazah?.name}
        onChange={(file) => setFiles({ ...files, ijazah: file })}
      />

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
          fontFamily: "inherit",
          transition: "background 0.2s",
          marginTop: "4px",
        }}
      >
        Daftar Sekarang
      </button>
    </div>
  );
}

function SuccessMessage({ onClose }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "linear-gradient(135deg, #1D9E75, #28c840)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", fontSize: 36, color: "#fff",
        boxShadow: "0 8px 24px rgba(29,158,117,0.3)",
        animation: "successPop 0.5s ease-out"
      }}>
        ✓
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#042C53", marginBottom: 8 }}>
        Pendaftaran Berhasil!
      </h3>
      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 8, maxWidth: 320, margin: "0 auto 8px" }}>
        Data Anda sudah diterima.
      </p>
      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
        Silakan tunggu konfirmasi dari admin. Kami akan menghubungi Anda melalui email dalam 1-3 hari kerja.
      </p>
      <div style={{
        background: "#E6F1FB", borderRadius: 12, padding: "16px 20px",
        marginBottom: 24, textAlign: "left"
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#185FA5", marginBottom: 8 }}>
          📋 Proses Selanjutnya:
        </div>
        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
          1. Admin memeriksa dokumen Anda<br />
          2. Verifikasi data & kelengkapan<br />
          3. Konfirmasi via email<br />
          4. Akun aktif & siap mengajar!
        </div>
      </div>
      <button
        onClick={onClose}
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
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
      >
        Tutup
      </button>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync activeTab when defaultTab changes (e.g., from navbar button)
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setShowSuccess(false);
    }
  }, [isOpen, defaultTab]);

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
    fontFamily: "inherit",
  });

  return (
    <>
      <style>{`
        @keyframes successPop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes modalSlide {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
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
            maxWidth: "480px",
            padding: "40px",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
            fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
            animation: "modalSlide 0.3s ease-out",
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
              transition: "background 0.2s",
              zIndex: 1,
            }}
          >
            ×
          </button>

          {showSuccess ? (
            <SuccessMessage onClose={onClose} />
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "26px", fontWeight: "800", color: "#1565C0", letterSpacing: "-0.5px", marginBottom: "4px" }}>
                  Synau
                </div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>
                  {activeTab === "login" ? "Masuk ke Akun" : "Daftar sebagai Guru"}
                </div>
                <div style={{ fontSize: "14px", color: "#777" }}>
                  {activeTab === "login"
                    ? "Selamat datang kembali! Silakan masuk."
                    : "Lengkapi data dan dokumen untuk mendaftar."}
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
                <RegisterForm
                  onSuccess={(token) => { console.log("token:", token); onClose(); }}
                  onRegisterSuccess={() => setShowSuccess(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
