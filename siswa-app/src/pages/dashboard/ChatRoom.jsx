import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { listenChatMessages, sendChatMessage } from "../../services/firestoreService";

const s = {
    page: { background: "#f5f8ff", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" },
    navbar: { background: "#fff", borderBottom: "1px solid #E6F1FB", padding: "0 24px", height: 64, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10 },
    backButton: { background: "#fff", border: "1px solid #B5D4F4", borderRadius: 10, cursor: "pointer", color: "#185FA5", fontSize: 13, fontWeight: 700, padding: "8px 14px", fontFamily: "inherit", marginRight: 14 },
    logo: { fontWeight: 800, fontSize: 18, color: "#0C447C" },
    container: { maxWidth: 820, margin: "0 auto", padding: "28px 18px" },
    card: { background: "#fff", border: "1px solid #E6F1FB", borderRadius: 20, overflow: "hidden", boxShadow: "0 14px 35px rgba(12,68,124,0.08)" },
    header: { padding: 20, borderBottom: "1px solid #E6F1FB", display: "flex", alignItems: "center", gap: 14, background: "#fff" },
    avatar: { width: 48, height: 48, borderRadius: "50%", background: "#185FA5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 },
    body: { height: 420, padding: 20, background: "#f8fbff", overflowY: "auto" },
    emptyBox: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
    inputArea: { padding: 16, borderTop: "1px solid #E6F1FB", background: "#fff", display: "grid", gridTemplateColumns: "1fr auto", gap: 10 },
    input: { width: "100%", padding: "13px 15px", border: "1.5px solid #B5D4F4", borderRadius: 14, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    button: { padding: "13px 22px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" },
};

const getInitial = (name) => {
    if (!name) return "G";
    return name.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
};

export default function ChatRoom() {
    const navigate = useNavigate();
    const { chatId } = useParams();

    const siswa = JSON.parse(localStorage.getItem("user")) ?? {};
    const currentUserId = String(siswa.id || siswa.email || "unknown_student");

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!chatId) return;

        const chatRef = doc(db, "chats", chatId);
        const unsubscribe = onSnapshot(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                setChat({ id: snapshot.id, ...snapshot.data() });
            }
            setLoading(false);
        }, (error) => {
            console.error("Gagal membaca chat room:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = listenChatMessages(chatId, (items) => {
            setMessages(items);
        });

        return () => unsubscribe();
    }, [chatId]);

    const handleSend = async (e) => {
        e.preventDefault();

        const cleanText = text.trim();
        if (!cleanText || sending) return;

        setSending(true);

        try {
            await sendChatMessage({
                chatId,
                senderId: currentUserId,
                senderName: siswa.name || siswa.nama_panggilan || "Siswa",
                senderRole: "siswa",
                text: cleanText,
            });

            setText("");
        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            alert("Gagal mengirim pesan. Cek koneksi atau Firestore Rules.");
        } finally {
            setSending(false);
        }
    };

    const teacherName = chat?.teacherName || "Guru";
    const studentName = chat?.studentName || "Siswa";

    return (
        <div style={s.page}>
            <nav style={s.navbar}>
                <button onClick={() => navigate(-1)} style={s.backButton}>Kembali</button>
                <div style={s.logo}>Sinau Chat</div>
            </nav>

            <main style={s.container}>
                <div style={s.card}>
                    <div style={s.header}>
                        <div style={s.avatar}>{getInitial(teacherName)}</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#042C53", wordBreak: "break-word" }}>
                                {loading ? "Memuat chat..." : teacherName}
                            </div>
                            <div style={{ fontSize: 12, color: "#888", marginTop: 4, wordBreak: "break-word" }}>
                                Chat antara {studentName} dan {teacherName}
                            </div>
                        </div>
                    </div>

                    <div style={s.body}>
                        {messages.length === 0 ? (
                            <div style={s.emptyBox}>
                                <div>
                                    <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#E6F1FB", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, margin: "0 auto 16px" }}>
                                        CHAT
                                    </div>
                                    <div style={{ fontSize: 19, fontWeight: 800, color: "#042C53", marginBottom: 8 }}>
                                        Mulai percakapan
                                    </div>
                                    <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7, maxWidth: 430 }}>
                                        Kirim pesan pertama ke guru ini. Pesan akan tersimpan realtime di Firestore.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {messages.map((msg) => {
                                    const isMine = String(msg.senderId) === currentUserId;

                                    return (
                                        <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                                            <div style={{
                                                maxWidth: "72%",
                                                background: isMine ? "#185FA5" : "#fff",
                                                color: isMine ? "#fff" : "#042C53",
                                                border: isMine ? "none" : "1px solid #E6F1FB",
                                                borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                                padding: "10px 13px",
                                                boxShadow: "0 4px 12px rgba(12,68,124,0.06)",
                                                wordBreak: "break-word",
                                            }}>
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
                            placeholder="Tulis pesan..."
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
                </div>
            </main>
        </div>
    );
}
