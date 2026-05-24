import React, { useState } from "react";
import ChatList from "../../components/chat/ChatList";
import ChatRoom from "../../components/chat/ChatRoom";

export default function ChatPageGuru({ guruData }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatData, setActiveChatData] = useState(null);

  const handleSelectChat = (chatId, chatData) => {
    setActiveChatId(chatId);
    setActiveChatData(chatData);
  };

  const opponentName = activeChatData?.siswa_name || "Siswa";
  const opponentAvatar = activeChatData?.siswa_avatar || "";
  const subtitle = activeChatData?.mata_pelajaran || (activeChatData?.booking_id ? `Booking ID: ${activeChatData.booking_id}` : "Diskusi");

  // user_id adalah ID user akun login, bukan ID tabel guru
  const userId = guruData?.user_id;

  if (!userId) {
    return <div style={{ padding: 40, textAlign: "center" }}>Memuat profil...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#042C53', marginBottom: 8 }}>Pesan Saya</h1>
        <p style={{ color: '#64748B' }}>Kelola percakapan Anda dengan siswa di sini.</p>
      </div>

      <div style={{ 
        display: "flex", 
        height: "600px", 
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid #E2E8F0"
      }}>
        {/* Sidebar / ChatList (35%) */}
        <div style={{ width: "35%", flexShrink: 0 }}>
          <ChatList 
            role="guru" 
            userId={userId} 
            onSelectChat={handleSelectChat}
            activeChatId={activeChatId}
          />
        </div>

        {/* Main Area / ChatRoom (65%) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChatRoom 
            chatId={activeChatId}
            currentUserId={userId}
            currentRole="guru"
            otherUserName={opponentName}
            otherUserAvatar={opponentAvatar}
            subtitle={subtitle}
          />
        </div>
      </div>
    </div>
  );
}
