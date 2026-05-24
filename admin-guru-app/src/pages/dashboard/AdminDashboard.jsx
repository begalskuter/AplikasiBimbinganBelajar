import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminOverview from "../../components/admin/AdminOverview";
import VerifikasiGuru from "../../components/admin/VerifikasiGuru";
import DataGuru from "../../components/admin/DataGuru";
import DataSiswa from "../../components/admin/DataSiswa";
import KelasJadwal from "../../components/admin/KelasJadwal";
import PembayaranAdmin from "../../components/admin/PembayaranAdmin";
import GajiGuru from "../../components/admin/GajiGuru";
import LaporanAdmin from "../../components/admin/LaporanAdmin";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auth check: Pastikan user login dan role-nya admin.
    // Jika tidak ada session, kita otomatis buat mock session agar langsung bisa diakses.
    let userStr = localStorage.getItem("user");
    let token = localStorage.getItem("token");

    if (!token || !userStr) {
      const mockUser = {
        name: "Super Admin (Bypass)",
        email: "admin@synau.com",
        role: "admin"
      };
      localStorage.setItem("token", "mock-token-admin");
      localStorage.setItem("user", JSON.stringify(mockUser));
      token = "mock-token-admin";
      userStr = JSON.stringify(mockUser);
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        navigate("/");
        return;
      }
      setAdminData(user);
    } catch (error) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderContent = () => {
    switch (activePage) {
      case "overview": return <AdminOverview />;
      case "verifikasi": return <VerifikasiGuru />;
      case "guru": return <DataGuru />;
      case "siswa": return <DataSiswa />;
      case "kelas": return <KelasJadwal />;
      case "pembayaran": return <PembayaranAdmin />;
      case "gaji": return <GajiGuru />;
      case "laporan": return <LaporanAdmin />;
      default: return <AdminOverview />;
    }
  };

  // Mock pending count for verification badge in sidebar
  const pendingVerificationCount = 7;

  if (!adminData) return null;

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f4f7fb",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <AdminSidebar
        activePage={activePage}
        onNavigate={setActivePage}
        adminData={adminData}
        onLogout={handleLogout}
        pendingCount={pendingVerificationCount}
      />
      <div style={{
        flex: 1,
        marginLeft: 272, // Lebar sidebar
        padding: "36px 48px",
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box"
      }}>
        {renderContent()}
      </div>
    </div>
  );
}
