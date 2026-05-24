import { useEffect, useState } from "react";
import {
  listenChatsByTeacher,
  listenChatMessages,
  sendChatMessage,
} from "../../services/firestoreService";

const s = {
  card: {
    background: "#fff",
    border: "1px solid #E6F1FB",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(12,68,124,0.06)",
  },
  header: {
    padding: 24,
    borderBottom: "1px solid #E6F1FB",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#042C53",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    minHeight: 520,
  },
  list: {
    borderRight: "1px solid #E6F1FB",
    background: "#f8fbff",
    padding: 14,
  },
  chatItem: (active) => ({
    border: active ? "1.5px solid #185FA5" : "1px solid #E6F1FB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    background: active ? "#E6F1FB" : "#fff",
    cursor: "pointer",
  }),
  studentName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#042C53",
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 13,
    color: "#777",
    lineHeight: 1.5,
  },
  room: {
    display: "flex",
    flexDirection: "column",
    minHeight: 520,
  },
  roomHeader: {
    padding: 18,
    borderBottom: "1px solid #E6F1FB",
    background: "#fff",
  },
  messages: {
    flex: 1,
    padding: 18,
    background: "#f8fbff",
    overflowY: "auto",
  },
  inputArea: {
    padding: 14,
    borderTop: "1px solid #E6F1FB",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    background: "#fff",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #B5D4F4",
    borderRadius: 12,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 18px",
    background: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  empty: {
    height: "100%",
    minHeight: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#777",
    padding: 28,
  },
};

export default function ChatGuru({ guruData }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const guruId = String(guruData?.id || "unknown_teacher");
  const guruName = guruData?.nama || "Guru";

  useEffect(() => {
    if (!guruData?.id) return;

    const unsubscribe = listenChatsByTeacher(guruData.id, (items) => {
      setChats(items);

      if (!selectedChat && items.length > 0) {
        setSelectedChat(items[0]);
      }
    });

    return () => unsubscribe();
  }, [guruData?.id, selectedChat]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const unsubscribe = listenChatMessages(selectedChat.id, (items) => {
      setMessages(items);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  const handleSend = async (e) => {
    e.preventDefault();

    const cleanText = text.trim();
    if (!selectedChat?.id || !cleanText || sending) return;

    setSending(true);

    try {
      await sendChatMessage({
        chatId: selectedChat.id,
        senderId: guruId,
        senderName: guruName,
        senderRole: "guru",
        text: cleanText,
      });

      setText("");
    } catch (error) {
      console.error("Gagal mengirim pesan guru:", error);
      alert("Gagal mengirim pesan. Cek koneksi atau Firestore Rules.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.title}>Chat Siswa</div>
        <div style={s.subtitle}>
          Pilih siswa yang ingin dijawab. Pesan tampil realtime di aplikasi siswa dan guru.
        </div>
      </div>

      <div style={s.layout}>
        <div style={s.list}>
          {chats.length === 0 ? (
            <div style={{ padding: 18, color: "#777", textAlign: "center" }}>
              Belum ada chat dari siswa.
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                style={s.chatItem(selectedChat?.id === chat.id)}
              >
                <div style={s.studentName}>{chat.studentName || "Siswa"}</div>
                <div style={s.lastMessage}>
                  {chat.lastMessage || "Belum ada pesan."}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={s.room}>
          {!selectedChat ? (
            <div style={s.empty}>
              Pilih chat siswa terlebih dahulu.
            </div>
          ) : (
            <>
              <div style={s.roomHeader}>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#042C53" }}>
                  {selectedChat.studentName || "Siswa"}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                  Room: {selectedChat.id}
                </div>
              </div>

              <div style={s.messages}>
                {messages.length === 0 ? (
                  <div style={s.empty}>Belum ada pesan di room ini.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {messages.map((msg) => {
                      const isMine = String(msg.senderId) === guruId;

                      return (
                        <div
                          key={msg.id}
                          style={{
                            display: "flex",
                            justifyContent: isMine ? "flex-end" : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "72%",
                              background: isMine ? "#185FA5" : "#fff",
                              color: isMine ? "#fff" : "#042C53",
                              border: isMine ? "none" : "1px solid #E6F1FB",
                              borderRadius: isMine
                                ? "16px 16px 4px 16px"
                                : "16px 16px 16px 4px",
                              padding: "10px 13px",
                              boxShadow: "0 4px 12px rgba(12,68,124,0.06)",
                              wordBreak: "break-word",
                            }}
                          >
                            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.75, marginBottom: 4 }}>
                              {msg.senderName || "Pengguna"}
                            </div>
                            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <form onSubmit={handleSend} style={s.inputArea}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis balasan..."
                  style={s.input}
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  style={{
                    ...s.button,
                    background: sending || !text.trim() ? "#B5D4F4" : "#185FA5",
                    cursor: sending || !text.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "..." : "Kirim"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
