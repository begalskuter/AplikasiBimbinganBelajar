import React, { useState, useEffect } from "react";
import { listenChats } from "../../services/firestoreService";

export default function ChatList({ role, userId, onSelectChat, activeChatId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = listenChats(role, userId, (data) => {
      setChats(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [role, userId]);

  const getOpponent = (chat) => {
    if (role === "siswa") {
      return { 
        name: chat.guru_name || "Guru", 
        avatar: chat.guru_avatar, 
        unread: chat.unread_siswa || 0, 
        subtitle: chat.mata_pelajaran 
      };
    } else {
      return { 
        name: chat.siswa_name || "Siswa", 
        avatar: chat.siswa_avatar, 
        unread: chat.unread_guru || 0, 
        subtitle: chat.mata_pelajaran || `Booking ID: ${chat.booking_id}` 
      };
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", borderRight: "1px solid #E2E8F0", borderRadius: "12px 0 0 12px" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC", borderRadius: "12px 0 0 0" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>Pesan</h2>
      </div>
      <div className="chat-scroll" style={{ flex: 1, overflowY: "auto" }}>
        <style>{`
          .chat-scroll::-webkit-scrollbar { width: 5px; }
          .chat-scroll::-webkit-scrollbar-track { background: transparent; }
          .chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}</style>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>Memuat...</div>
        ) : chats.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
            Belum ada obrolan.
          </div>
        ) : (
          chats.map(chat => {
            const opp = getOpponent(chat);
            const isActive = activeChatId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id, chat)}
                style={{
                  padding: "16px 20px", display: "flex", gap: 14, cursor: "pointer",
                  borderBottom: "1px solid #F1F5F9", 
                  background: isActive ? "#F1F5F9" : opp.unread > 0 ? "#F8FAFC" : "#fff",
                  transition: "background 0.2s"
                }}
                onMouseOver={e => !isActive && (e.currentTarget.style.background = "#F1F5F9")}
                onMouseOut={e => !isActive && (e.currentTarget.style.background = opp.unread > 0 ? "#F8FAFC" : "#fff")}
              >
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E2E8F0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontWeight: "bold", fontSize: 16 }}>
                  {opp.avatar ? <img src={opp.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : opp.name[0]}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontWeight: isActive ? 800 : 700, fontSize: 14, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{opp.name}</div>
                    <div style={{ fontSize: 11, color: opp.unread > 0 ? "#185FA5" : "#94A3B8", fontWeight: opp.unread > 0 ? 700 : 400 }}>{formatDate(chat.last_message_time)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: opp.unread > 0 ? "#334155" : "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: opp.unread > 0 ? 600 : 400 }}>
                    {chat.last_message || "Belum ada pesan"}
                  </div>
                </div>
                {opp.unread > 0 && (
                  <div style={{ width: 22, height: 22, background: "#185FA5", borderRadius: "50%", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
                    {opp.unread}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
