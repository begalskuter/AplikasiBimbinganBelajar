import { useState, useEffect } from "react";
import { listenInboxByRole } from "../services/firestoreService";

export default function InboxWidget({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!role) return;
    const unsubscribe = listenInboxByRole(role, (data) => {
      setMessages(data);
      setUnreadCount(data.length); // Sederhana: semua pesan dianggap unread untuk demo
    });
    return () => unsubscribe();
  }, [role]);

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {isOpen && (
        <div style={{ position: "absolute", bottom: 70, right: 0, width: 320, background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid #E6F1FB", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: 400 }}>
          <div style={{ padding: "16px 20px", background: "#185FA5", color: "#fff", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Kotak Masuk ({unreadCount})</span>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: 12, background: "#fafcff" }}>
            {messages.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: 13 }}>Belum ada pesan.</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} style={{ background: "#fff", border: "1px solid #E6F1FB", borderRadius: 10, padding: 12, marginBottom: 8, boxShadow: "0 2px 8px rgba(24,95,165,0.05)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#042C53", marginBottom: 4 }}>{msg.title}</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{msg.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56, height: 56, borderRadius: "50%", background: "#185FA5", color: "#fff", border: "none",
          boxShadow: "0 8px 24px rgba(24,95,165,0.3)", cursor: "pointer", fontSize: 24,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "transform 0.2s"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
      >
        📬
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: -2, right: -2, background: "#E24B4A", color: "#fff",
            fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff"
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
}
