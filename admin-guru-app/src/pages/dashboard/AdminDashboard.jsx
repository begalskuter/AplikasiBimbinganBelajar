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
import InboxBell from "../../components/InboxBell";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      navigate("/");
      return;
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
      <div style={{ flex: 1, marginLeft: 272, display: 'flex', flexDirection: 'column', height: "100vh", boxSizing: "border-box" }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 48px', borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
          <InboxBell role="admin" />
        </div>
        <div style={{ padding: "36px 48px", overflowY: "auto", flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}