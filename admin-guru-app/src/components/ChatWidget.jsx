import { useState, useEffect, useRef } from "react";
import { listenChats, listenMessages, sendMessage, markAsRead } from "../services/firestoreService";

export default function ChatWidget({ role, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Total unread untuk badge (berdasarkan field unread_siswa atau unread_guru)
  const unreadField = role === "guru" ? "unread_guru" : "unread_siswa";
  const totalUnread = chats.reduce((sum, chat) => sum + (chat[unreadField] || 0), 0);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = listenChats(role, userId, (data) => {
      setChats(data);
      // Update active chat details if it's open
      if (activeChat) {
        const updated = data.find(c => c.id === activeChat.id);
        if (updated) setActiveChat(updated);
      }
    });
    return () => unsubscribe();
  }, [role, userId, activeChat?.id]); // depend on activeChat.id

  useEffect(() => {
    if (!activeChat) return;
    // Mark as read saat obrolan dibuka
    markAsRead(activeChat.id, role);
    const unsubscribe = listenMessages(activeChat.id, (data) => {
      setMessages(data);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [activeChat?.id, role]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    const text = inputText.trim();
    setInputText("");
    await sendMessage(activeChat.id, userId, role, text);
    scrollToBottom();
  };

  const getOpponent = (chat) => {
    if (role === "siswa") {
      return { name: chat.guru_name || "Guru", avatar: chat.guru_avatar, unread: chat.unread_siswa || 0, subtitle: chat.mata_pelajaran };
    } else {
      return { name: chat.siswa_name || "Siswa", avatar: chat.siswa_avatar, unread: chat.unread_guru || 0, subtitle: chat.mata_pelajaran || `Booking ID: ${chat.booking_id}` };
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: role === "guru" ? 100 : 24, zIndex: 9999, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {isOpen && (
        <div style={{
          position: "absolute", bottom: 70, right: 0, width: 340, height: 500,
          background: "#fff", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          border: "1px solid #E6F1FB", overflow: "hidden", display: "flex", flexDirection: "column",
          animation: "fadeUp 0.3s ease-out"
        }}>
          <style>{`
            @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .chat-scroll::-webkit-scrollbar { width: 5px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
          `}</style>
          
          {/* Header */}
          <div style={{ padding: "14px 20px", background: "#185FA5", color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
            {activeChat && (
              <button onClick={() => setActiveChat(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: 0 }}>
                ←
              </button>
            )}
            <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>
              {activeChat ? getOpponent(activeChat).name : "Chat Siswa"}
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 20, padding: 0 }}>×</button>
          </div>

          {/* Content */}
          <div className="chat-scroll" style={{ flex: 1, background: activeChat ? "#F0F4F8" : "#fff", overflowY: "auto" }}>
            {!activeChat ? (
              // CHAT LIST
              chats.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 13 }}>
                  Belum ada pesan dari siswa.
                </div>
              ) : (
                chats.map(chat => {
                  const opp = getOpponent(chat);
                  return (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      style={{
                        padding: "16px 20px", display: "flex", gap: 12, cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9", background: opp.unread > 0 ? "#F8FAFC" : "#fff",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "#F1F5F9"}
                      onMouseOut={e => e.currentTarget.style.background = opp.unread > 0 ? "#F8FAFC" : "#fff"}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#E2E8F0", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontWeight: "bold" }}>
                        {opp.avatar ? <img src={opp.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : opp.name[0]}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{opp.name}</div>
                          <div style={{ fontSize: 11, color: opp.unread > 0 ? "#185FA5" : "#94A3B8", fontWeight: opp.unread > 0 ? 700 : 400 }}>{formatDate(chat.last_message_time)}</div>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {chat.last_message || "Belum ada pesan"}
                        </div>
                      </div>
                      {opp.unread > 0 && (
                        <div style={{ width: 20, height: 20, background: "#185FA5", borderRadius: "50%", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                          {opp.unread}
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : (
              // CHAT ROOM
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <span style={{ background: "#E2E8F0", color: "#475569", fontSize: 11, padding: "4px 12px", borderRadius: 100 }}>
                    Topik: {getOpponent(activeChat).subtitle}
                  </span>
                </div>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 12, marginTop: 20 }}>Mulai obrolan...</div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender_role === role;
                    return (
                      <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "80%", padding: "10px 14px", borderRadius: 16, fontSize: 13, lineHeight: 1.4,
                          background: isMe ? "#185FA5" : "#fff",
                          color: isMe ? "#fff" : "#334155",
                          borderBottomRightRadius: isMe ? 4 : 16,
                          borderBottomLeftRadius: isMe ? 16 : 4,
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4, marginHorizonal: 4 }}>
                          {formatDate(msg.created_at)}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {activeChat && (
            <form onSubmit={handleSend} style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #E2E8F0", display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: 20, fontSize: 13, outline: "none", fontFamily: "inherit" }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                style={{
                  width: 38, height: 38, borderRadius: "50%", background: inputText.trim() ? "#185FA5" : "#E2E8F0",
                  color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: inputText.trim() ? "pointer" : "not-allowed", transition: "background 0.2s"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56, height: 56, borderRadius: "50%", background: "#1D9E75", color: "#fff", border: "none",
          boxShadow: "0 8px 24px rgba(29,158,117,0.3)", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", position: "relative", transition: "transform 0.2s"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="currentColor"/>
          <path d="M7 9H17V11H7V9Z" fill="currentColor"/>
          <path d="M7 12H14V14H7V12Z" fill="currentColor"/>
        </svg>
        {totalUnread > 0 && (
          <div style={{
            position: "absolute", top: -2, right: -2, background: "#E24B4A", color: "#fff",
            fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff"
          }}>
            {totalUnread > 9 ? '9+' : totalUnread}
          </div>
        )}
      </button>
    </div>
  );
}
