import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { createActivityLog } from "../services/firestoreService";

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

function PasswordInput({ label, placeholder, value, onChange, focused, onFocus, onBlur, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          style={{ ...inputStyle, paddingRight: "42px", borderColor: focused ? "#1565C0" : "#e0e0e0" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#999", padding: "4px", display: "flex", alignItems: "center",
          }}
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
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

function LoginForm({ onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    setPending(false);
    try {
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onClose();

      const role = user?.role;
      if (role === "admin") {
        navigate("/dashboardadmin");
      } else if (role === "guru") {
        navigate("/dashboardguru");
      } else {
        setError("Akun ini bukan akun guru atau admin.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      // 403 + status "pending" = guru belum diverifikasi admin
      if (err.response?.status === 403 && err.response?.data?.status === "pending") {
        setPending(true);
      } else {
        setError(err.response?.data?.message || "Login gagal. Periksa kembali email dan password Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tampilan khusus akun masih menunggu verifikasi
  if (pending) {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF3E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
          ⏳
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#042C53", marginBottom: 10 }}>
          Akun Sedang Diverifikasi
        </div>
        <p style={{ fontSize: 14, color: "#777", lineHeight: 1.7, marginBottom: 8 }}>
          Pendaftaranmu sudah kami terima. Tim admin sedang memeriksa dokumenmu.
        </p>
        <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginBottom: 24 }}>
          Proses verifikasi membutuhkan{" "}
          <strong style={{ color: "#633806" }}>1–3 hari kerja</strong>.<br />
          Kamu akan bisa login setelah akun disetujui admin.
        </p>
        <div style={{ background: "#FEF3E2", border: "1px solid #FAC775", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#633806", marginBottom: 20, textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <span>
            Jika sudah lebih dari 3 hari kerja dan belum ada konfirmasi, hubungi kami di{" "}
            <strong>admin@synau.id</strong>
          </span>
        </div>
        <button
          onClick={() => setPending(false)}
          style={{ width: "100%", padding: "12px", background: "none", border: "1px solid #B5D4F4", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#185FA5", cursor: "pointer", fontFamily: "inherit" }}
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

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
        <PasswordInput
          label="Password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          focused={focused === "password"}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused(null)}
        />
      </div>
      {error && (
        <div style={{ color: "#D32F2F", fontSize: 13, marginBottom: 8, marginTop: 4 }}>
          {error}
        </div>
      )}
      <div style={{ textAlign: "right", marginBottom: "24px" }}>
        <a href="#" style={{ fontSize: "12px", color: "#1565C0", textDecoration: "none" }}>
          Lupa password?
        </a>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "13px",
          background: loading ? "#ccc" : "#1565C0",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: loading ? "default" : "pointer",
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </div>
  );
}

function RegisterForm({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    namaLengkap: "",
    namaPanggilan: "",
    email: "",
    tanggalLahir: "",
    noHp: "",
    alamatLengkap: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    password: "",
  });
  const [files, setFiles] = useState({ cv: null, ktp: null, ijazah: null });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTNC, setShowTNC] = useState(false);
  const [tncExpanded, setTncExpanded] = useState(false);
  const [tncAgreed, setTncAgreed] = useState(false);

  const handlePreSubmit = () => {
    const requiredFields = ['namaLengkap', 'email', 'password'];
    for (const key of requiredFields) {
      if (!form[key]) {
        setError("Harap isi semua field yang wajib.");
        return;
      }
    }
    if (!files.cv || !files.ktp || !files.ijazah) {
      setError("Harap upload semua dokumen yang diperlukan (CV, KTP, Ijazah/Surat Aktif Kuliah).");
      return;
    }
    setError("");
    setShowTNC(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.namaLengkap);
    formData.append("nama_panggilan", form.namaPanggilan);
    formData.append("email", form.email);
    formData.append("tanggal_lahir", form.tanggalLahir);
    formData.append("no_hp", form.noHp);
    formData.append("alamat_lengkap", form.alamatLengkap);
    formData.append("kelurahan", form.kelurahan);
    formData.append("kecamatan", form.kecamatan);
    formData.append("kota", form.kota);
    formData.append("provinsi", form.provinsi);
    formData.append("password", form.password);
    formData.append("password_confirmation", form.password);
    if (files.cv) formData.append("cv", files.cv);
    if (files.ktp) formData.append("ktp", files.ktp);
    if (files.ijazah) formData.append("ijazah", files.ijazah);

    try {
      const res = await api.post("/auth/register-guru", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("registration_pending", "true");
      
      // FIREBASE LOG: Pendaftaran Guru Baru
      createActivityLog({
        actor_id: res.data?.user?.id || 'new',
        actor_role: 'guru',
        actor_name: form.namaLengkap,
        action: 'register',
        description: 'Mendaftar sebagai guru baru dan menunggu verifikasi admin',
      });

      onRegisterSuccess();
    } catch (err) {
      setError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : err.response?.data?.message || "Gagal mendaftar. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Nama Lengkap</label>
          <input type="text" placeholder="Dewi Puspitasari" {...field("namaLengkap")} disabled={showTNC} />
        </div>
        <div>
          <label style={labelStyle}>Nama Panggilan</label>
          <input type="text" placeholder="Dewi" {...field("namaPanggilan")} disabled={showTNC} />
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Email</label>
        <input type="email" placeholder="email@contoh.com" {...field("email")} disabled={showTNC} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Tanggal Lahir</label>
          <input type="date" {...field("tanggalLahir")} disabled={showTNC} />
        </div>
        <div>
          <label style={labelStyle}>No. HP</label>
          <input type="tel" placeholder="08xx-xxxx-xxxx" {...field("noHp")} disabled={showTNC} />
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Alamat Lengkap <span style={{ color: "#aaa", fontWeight: 400 }}>(Nama jalan, nomor rumah)</span></label>
        <textarea
          placeholder="Jl. Mawar No. 12"
          rows={2}
          value={form.alamatLengkap}
          onChange={(e) => setForm({ ...form, alamatLengkap: e.target.value })}
          onFocus={() => setFocusedField("alamatLengkap")}
          onBlur={() => setFocusedField(null)}
          disabled={showTNC}
          style={{ ...inputStyle, resize: "none", borderColor: focusedField === "alamatLengkap" ? "#1565C0" : "#e0e0e0" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Kelurahan</label>
          <input type="text" placeholder="Giwangan" {...field("kelurahan")} disabled={showTNC} />
        </div>
        <div>
          <label style={labelStyle}>Kecamatan</label>
          <input type="text" placeholder="Umbulharjo" {...field("kecamatan")} disabled={showTNC} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Kota / Kabupaten</label>
          <input type="text" placeholder="Yogyakarta" {...field("kota")} disabled={showTNC} />
        </div>
        <div>
          <label style={labelStyle}>Provinsi</label>
          <input type="text" placeholder="DI Yogyakarta" {...field("provinsi")} disabled={showTNC} />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <PasswordInput
          label="Password"
          placeholder="Min. 8 karakter"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          focused={focusedField === "password"}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          disabled={showTNC}
        />
      </div>

      <div style={{ borderTop: "1px solid #e8e8e8", margin: "8px 0 20px", position: "relative" }}>
        <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#fff", padding: "0 12px", fontSize: 12, fontWeight: 600, color: "#999" }}>
          Dokumen Pendaftaran
        </span>
      </div>

      <FileUploadField
        label="Upload CV"
        accept=".pdf,.doc,.docx"
        description="Format: PDF atau DOC (maks. 5MB)"
        icon="📄"
        fileName={files.cv?.name}
        onChange={(file) => !showTNC && setFiles({ ...files, cv: file })}
      />
      <FileUploadField
        label="Scan KTP"
        accept=".jpg,.jpeg,.png,.pdf"
        description="Format: JPG, PNG, atau PDF (maks. 5MB)"
        icon="🪪"
        fileName={files.ktp?.name}
        onChange={(file) => !showTNC && setFiles({ ...files, ktp: file })}
      />
      <FileUploadField
        label="Ijazah Min. S1 / Surat Aktif Kuliah"
        accept=".jpg,.jpeg,.png,.pdf"
        description="Format: JPG, PNG, atau PDF (maks. 5MB)"
        icon="🎓"
        fileName={files.ijazah?.name}
        onChange={(file) => !showTNC && setFiles({ ...files, ijazah: file })}
      />

      {error && (
        <div style={{ color: "#D32F2F", fontSize: 13, marginBottom: 12, marginTop: 12, textAlign: "center" }}>
          {error}
        </div>
      )}

      {showTNC ? (
        <div style={{ marginTop: 24, padding: 18, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, animation: "modalSlide 0.3s ease-out" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#042C53', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Syarat & Ketentuan
            <button onClick={() => setTncExpanded(!tncExpanded)} style={{ background: 'none', border: 'none', color: '#1565C0', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
              {tncExpanded ? 'Sembunyikan' : 'Lihat Detail'}
            </button>
          </h4>

          {tncExpanded && (
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, maxHeight: 150, overflowY: 'auto', marginBottom: 16, paddingRight: 8 }}>
              <p style={{ marginBottom: 6 }}>1. Data yang diberikan adalah benar dan dapat dipertanggungjawabkan.</p>
              <p style={{ marginBottom: 6 }}>2. Menyetujui kebijakan potongan biaya layanan platform sebesar 10% dari setiap transaksi.</p>
              <p style={{ marginBottom: 6 }}>3. Bersedia menjaga nama baik Synau dan memberikan pelayanan terbaik kepada siswa.</p>
              <p style={{ marginBottom: 6 }}>4. Synau berhak menonaktifkan akun jika ditemukan pelanggaran terhadap kode etik pengajar.</p>
              <p style={{ marginBottom: 6 }}>5. Semua dokumen yang diunggah akan dijaga kerahasiaannya sesuai dengan Kebijakan Privasi.</p>
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: tncExpanded ? 0 : 12, background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <input
              type="checkbox"
              checked={tncAgreed}
              onChange={(e) => setTncAgreed(e.target.checked)}
              style={{ marginTop: 2, width: 16, height: 16, accentColor: '#1565C0', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 13, color: '#333', lineHeight: 1.4, fontWeight: 500 }}>
              Saya telah membaca dan menyetujui Syarat & Ketentuan pendaftaran guru Synau.
            </span>
          </label>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setShowTNC(false)} disabled={loading} style={{ flex: 1, padding: '12px', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Batal
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={!tncAgreed || loading}
              style={{ flex: 1, padding: '12px', background: (!tncAgreed || loading) ? '#ccc' : '#1565C0', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: (!tncAgreed || loading) ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
            >
              {loading ? 'Memproses...' : 'Setuju & Daftar'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handlePreSubmit}
          style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s", marginTop: "12px" }}
        >
          Daftar Sekarang
        </button>
      )}
    </div>
  );
}

function SuccessMessage({ onClose }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #1D9E75, #28c840)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36, color: "#fff", boxShadow: "0 8px 24px rgba(29,158,117,0.3)", animation: "successPop 0.5s ease-out" }}>
        ✓
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#042C53", marginBottom: 8 }}>Data Diterima!</h3>
      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 8, maxWidth: 320, margin: "0 auto 8px" }}>
        Pendaftaran Anda sedang diproses.
      </p>
      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 28, maxWidth: 320, margin: "0 auto 28px" }}>
        Tim admin kami akan memeriksa dokumen Anda dalam 1-3 hari kerja. Silakan tunggu konfirmasi selanjutnya untuk dapat mulai mengajar.
      </p>
      <button
        onClick={onClose}
        style={{ width: "100%", padding: "13px", background: "#1565C0", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
      >
        Tutup
      </button>
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultTab === 'status') {
        setShowSuccess(true);
      } else {
        setActiveTab(defaultTab);
        setShowSuccess(false);
      }
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
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "480px",
            position: "relative",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
            animation: "modalSlide 0.3s ease-out",
          }}
        >
          {/* HEADER — tidak ikut scroll */}
          <div style={{ padding: "36px 40px 0", flexShrink: 0 }}>
            <button
              onClick={onClose}
              style={{ position: "absolute", top: "16px", right: "16px", background: "#f5f5f5", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "18px", color: "#666", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", zIndex: 1 }}
            >
              ×
            </button>

            {!showSuccess && (
              <>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "26px", fontWeight: "800", color: "#1565C0", letterSpacing: "-0.5px", marginBottom: "4px" }}>Synau</div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>
                    {activeTab === "login" ? "Masuk ke Akun" : "Daftar sebagai Guru"}
                  </div>
                  <div style={{ fontSize: "14px", color: "#777" }}>
                    {activeTab === "login"
                      ? "Guru & Admin masuk di sini."
                      : "Lengkapi data dan dokumen untuk mendaftar."}
                  </div>
                </div>

                <div style={{ display: "flex", background: "#f0f4ff", borderRadius: "12px", padding: "4px", marginBottom: "20px" }}>
                  <button style={tabBtn("login")} onClick={() => setActiveTab("login")}>Masuk</button>
                  <button style={tabBtn("register")} onClick={() => setActiveTab("register")}>Daftar</button>
                </div>
              </>
            )}
          </div>

          {/* FORM — bagian yang scroll */}
          <div style={{ padding: "0 40px 36px", overflowY: "auto", flex: 1 }}>
            {showSuccess ? (
              <SuccessMessage onClose={onClose} />
            ) : activeTab === "login" ? (
              <LoginForm onClose={onClose} />
            ) : (
              <RegisterForm onRegisterSuccess={() => setShowSuccess(true)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}