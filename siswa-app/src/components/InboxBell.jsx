import React, { useState, useEffect, useRef } from "react";
import { listenInboxByRole, markInboxAsRead } from "../services/firestoreService";

export default function InboxBell({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!role) return;
    const unsubscribe = listenInboxByRole(role, (data) => {
      setMessages(data);
    });
    return () => unsubscribe();
  }, [role]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = messages.filter(m => !m.is_read).length;

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    await markInboxAsRead(id);
  };

  const formatDate = (ts) => {
    if (!ts) return "Baru Saja";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none", border: "none", cursor: "pointer", position: "relative",
          width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s"
        }}
        onMouseOver={e => e.currentTarget.style.background = "#F1F5F9"}
        onMouseOut={e => e.currentTarget.style.background = "none"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: 2, right: 2, background: "#EF4444", color: "#fff",
            fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff"
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: 48, right: 0, width: 340, background: "#fff",
          borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid #E2E8F0",
          overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: 450, zIndex: 100
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 15 }}>Notifikasi</div>
            {unreadCount > 0 && (
              <div style={{ fontSize: 12, color: "#185FA5", background: "#E6F1FB", padding: "4px 8px", borderRadius: 100, fontWeight: 700 }}>
                {unreadCount} Baru
              </div>
            )}
          </div>
          
          <div style={{ overflowY: "auto", flex: 1, padding: 12, background: "#F8FAFC" }}>
            <style>{`
              .notif-scroll::-webkit-scrollbar { width: 4px; }
              .notif-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            `}</style>
            <div className="notif-scroll" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>Tidak ada notifikasi.</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{ 
                    background: msg.is_read ? "#fff" : "#EFF6FF", 
                    border: "1px solid", borderColor: msg.is_read ? "#E2E8F0" : "#BFDBFE",
                    borderRadius: 10, padding: 12, display: "flex", gap: 12, transition: "all 0.2s" 
                  }}>
                    <div style={{ 
                      width: 36, height: 36, borderRadius: "50%", background: msg.is_read ? "#F1F5F9" : "#DBEAFE", 
                      color: msg.is_read ? "#64748B" : "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{msg.title}</div>
                      <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.4, marginBottom: 8 }}>{msg.message}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{formatDate(msg.created_at)}</div>
                        {!msg.is_read && (
                          <button 
                            onClick={(e) => handleMarkAsRead(e, msg.id)}
                            style={{ background: "none", border: "none", color: "#185FA5", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0 }}
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
