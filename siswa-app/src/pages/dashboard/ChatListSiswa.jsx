import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listenChatsByStudent } from "../../services/firestoreService";

const s = {
    page: {
        background: "#f5f8ff",
        minHeight: "100vh",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    },
    navbar: {
        background: "#fff",
        borderBottom: "1px solid #E6F1FB",
        padding: "0 28px",
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 10,
    },
    backButton: {
        background: "#fff",
        border: "1px solid #B5D4F4",
        borderRadius: 10,
        cursor: "pointer",
        color: "#185FA5",
        fontSize: 13,
        fontWeight: 700,
        padding: "8px 14px",
        fontFamily: "inherit",
    },
    title: {
        fontSize: 20,
        fontWeight: 800,
        color: "#0C447C",
    },
    container: {
        maxWidth: 860,
        margin: "0 auto",
        padding: "28px 18px",
    },
    card: {
        background: "#fff",
        border: "1px solid #E6F1FB",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 10px 30px rgba(12,68,124,0.06)",
    },
    heading: {
        fontSize: 24,
        fontWeight: 800,
        color: "#042C53",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#777",
        marginBottom: 22,
    },
    chatItem: {
        border: "1px solid #E6F1FB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        background: "#f8fbff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#185FA5",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
    },
    empty: {
        padding: 34,
        textAlign: "center",
        color: "#777",
        background: "#f8fbff",
        borderRadius: 16,
        border: "1px dashed #B5D4F4",
    },
};

const getInitial = (name) => {
    if (!name) return "G";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

export default function ChatListSiswa() {
    const navigate = useNavigate();
    const siswa = JSON.parse(localStorage.getItem("user")) ?? {};
    const studentId = siswa.id || siswa.email || "unknown_student";

    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsubscribe = listenChatsByStudent(studentId, (items) => {
            setChats(items);
        });

        return () => unsubscribe();
    }, [studentId]);

    return (
        <div style={s.page}>
            <nav style={s.navbar}>
                <button onClick={() => navigate(-1)} style={s.backButton}>
                    Kembali
                </button>
                <div style={s.title}>Riwayat Chat</div>
            </nav>

            <main style={s.container}>
                <div style={s.card}>
                    <div style={s.heading}>Chat Guru</div>
                    <div style={s.subtitle}>
                        Pilih guru untuk melanjutkan percakapan realtime.
                    </div>

                    {chats.length === 0 ? (
                        <div style={s.empty}>
                            Belum ada riwayat chat. Buka detail guru lalu klik tombol Chat Guru.
                        </div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => navigate(`/chat/${chat.id}`)}
                                style={s.chatItem}
                            >
                                <div style={s.avatar}>{getInitial(chat.teacherName)}</div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: "#042C53", marginBottom: 5 }}>
                                        {chat.teacherName || "Guru"}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#777", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {chat.lastMessage || "Belum ada pesan."}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: "#185FA5" }}>
                                    Buka
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
