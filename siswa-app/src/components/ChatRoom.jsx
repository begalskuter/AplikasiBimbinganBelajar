import React, { useState, useEffect, useRef } from "react";
import { listenMessages, sendMessage, markAsRead } from "../services/firestoreService";

export default function ChatRoom({ chatId, currentUserId, currentRole, otherUserName, otherUserAvatar, subtitle }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    markAsRead(chatId, currentRole);
    const unsubscribe = listenMessages(chatId, (data) => {
      setMessages(data);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [chatId, currentRole]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;
    const text = inputText.trim();
    setInputText("");
    await sendMessage(chatId, currentUserId, currentRole, text);
    scrollToBottom();
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!chatId) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC" }}>
        <div style={{ textAlign: "center", color: "#94A3B8" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 16, opacity: 0.5 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p style={{ fontSize: 16, margin: 0 }}>Pilih percakapan untuk mulai mengirim pesan</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#F0F4F8", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", background: "#fff", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E2E8F0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontWeight: "bold", fontSize: 18 }}>
          {otherUserAvatar ? <img src={otherUserAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : otherUserName?.[0]}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{otherUserName}</div>
          <div style={{ fontSize: 13, color: "#64748B" }}>Topik: {subtitle || "Diskusi"}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-scroll" style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 14, marginTop: 40 }}>Mulai obrolan...</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_role === currentRole;
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "70%", padding: "12px 18px", borderRadius: 20, fontSize: 15, lineHeight: 1.5,
                  background: isMe ? "#185FA5" : "#fff",
                  color: isMe ? "#fff" : "#334155",
                  borderBottomRightRadius: isMe ? 4 : 20,
                  borderBottomLeftRadius: isMe ? 20 : 4,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, marginHorizonal: 6 }}>
                  {formatDate(msg.created_at)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "20px 24px", background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <form onSubmit={handleSend} style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            placeholder="Ketik pesan Anda di sini..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            style={{ 
              flex: 1, padding: "14px 20px", border: "1px solid #CBD5E1", 
              borderRadius: 100, fontSize: 15, outline: "none", fontFamily: "inherit",
              background: "#F8FAFC"
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: 52, height: 52, borderRadius: "50%", background: inputText.trim() ? "#185FA5" : "#E2E8F0",
              color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: inputText.trim() ? "pointer" : "not-allowed", transition: "all 0.2s"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
