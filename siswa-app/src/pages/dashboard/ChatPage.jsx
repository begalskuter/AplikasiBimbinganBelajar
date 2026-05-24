import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList";
import ChatRoom from "../../components/ChatRoom";
import { useLocation } from "react-router-dom";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatData, setActiveChatData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Parse query params (e.g. ?chatId=...)
    const params = new URLSearchParams(location.search);
    const chatIdParam = params.get("chatId");
    if (chatIdParam) {
      setActiveChatId(chatIdParam);
    }
  }, [location]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSelectChat = (chatId, chatData) => {
    setActiveChatId(chatId);
    setActiveChatData(chatData);
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <p>Silakan login untuk mengakses halaman pesan.</p>
      </div>
    );
  }

  // Get opponent name and avatar from active chat data
  const opponentName = activeChatData?.guru_name || "Guru";
  const opponentAvatar = activeChatData?.guru_avatar || "";
  const subtitle = activeChatData?.mata_pelajaran || "Diskusi";

  return (
    <div style={{ 
      display: "flex", 
      height: "calc(100vh - 80px)", // Assuming navbar height is 80px
      background: "#fff",
      margin: "-2rem", // Counteract default dashboard padding if any
      overflow: "hidden"
    }}>
      {/* Sidebar / ChatList (30%) */}
      <div style={{ width: "320px", flexShrink: 0 }}>
        <ChatList 
          role="siswa" 
          userId={user.id} 
          onSelectChat={handleSelectChat}
          activeChatId={activeChatId}
        />
      </div>

      {/* Main Area / ChatRoom (70%) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatRoom 
          chatId={activeChatId}
          currentUserId={user.id}
          currentRole="siswa"
          otherUserName={opponentName}
          otherUserAvatar={opponentAvatar}
          subtitle={subtitle}
        />
      </div>
    </div>
  );
}
