import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";

const safeFirestoreEvent = async (operation, context = "") => {
  try {
    return await operation();
  } catch (error) {
    console.warn(`Firestore Event Warning [${context}]:`, error);
    return null;
  }
};

// 1. Inbox (Role-based Notification)
export const listenInboxByRole = (role, callback) => {
  if (!role) return () => {};
  try {
    const q = query(
      collection(db, "inbox"),
      where("role", "==", role)
    );
    return onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      });
      callback(data);
    }, (error) => { console.warn("Error listening inbox", error); });
  } catch (error) { console.warn("Failed inbox listener", error); return () => {}; }
};

export const createInboxNotification = async (role, title, message, link = "") => {
  return safeFirestoreEvent(async () => {
    await addDoc(collection(db, "inbox"), {
      role: role,
      title: title,
      message: message,
      link: link,
      is_read: false,
      created_at: serverTimestamp()
    });
    return true;
  }, "createInboxNotification");
};

export const markInboxAsRead = async (id) => {
  return safeFirestoreEvent(async () => {
    await setDoc(doc(db, "inbox", id), { is_read: true }, { merge: true });
    return true;
  }, "markInboxAsRead");
};

// 2. Activity Logs
export const createActivityLog = async (data) => {
  return safeFirestoreEvent(async () => {
    const docRef = await addDoc(collection(db, "activity_logs"), {
      actor_id: data.actor_id,
      actor_role: data.actor_role,
      actor_name: data.actor_name,
      action: data.action,
      description: data.description,
      target_type: data.target_type || null,
      target_id: data.target_id || null,
      created_at: serverTimestamp()
    });
    return docRef.id;
  }, "createActivityLog");
};

export const listenActivityLogs = (callback) => {
  try {
    const q = query(
      collection(db, "activity_logs"),
      orderBy("created_at", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => { console.warn("Error listening activity logs", error); });
  } catch (error) { console.warn("Failed activity listener", error); return () => {}; }
};

// 3. Chat Room Setup
export const createChatRoom = async (bookingId, siswa, guru, mapel) => {
  return safeFirestoreEvent(async () => {
    const chatRef = doc(db, "chats", bookingId.toString());
    await setDoc(chatRef, {
      booking_id: bookingId,
      siswa_id: siswa.id,
      siswa_name: siswa.name || siswa.nama_panggilan || "Siswa",
      siswa_avatar: siswa.foto_url || "",
      guru_id: guru.user_id || guru.id,
      guru_name: guru.nama || guru.name || "Guru",
      guru_avatar: guru.foto_profil || guru.foto_url || "",
      mata_pelajaran: mapel || "",
      created_at: serverTimestamp(),
      last_message: "Halo, saya baru saja melakukan booking sesi bimbingan.",
      last_message_time: serverTimestamp(),
      unread_guru: 1,
      unread_siswa: 0
    });

    // Create initial automated message
    await addDoc(collection(chatRef, "messages"), {
      sender_id: siswa.id,
      sender_role: "siswa",
      text: "Halo, saya baru saja melakukan booking sesi bimbingan.",
      created_at: serverTimestamp()
    });

    return chatRef.id;
  }, "createChatRoom");
};

export const getOrCreateChatByUsers = async (guruUserId, siswaUserId, guruName, siswaName, mapel, guruAvatar = "", siswaAvatar = "") => {
  return safeFirestoreEvent(async () => {
    const chatId = `chat_${guruUserId}_${siswaUserId}`;
    const chatRef = doc(db, "chats", chatId);
    const snap = await getDoc(chatRef);
    
    if (!snap.exists()) {
      await setDoc(chatRef, {
        siswa_id: siswaUserId,
        siswa_name: siswaName,
        siswa_avatar: siswaAvatar,
        guru_id: guruUserId,
        guru_name: guruName,
        guru_avatar: guruAvatar,
        mata_pelajaran: mapel || "Diskusi",
        last_message: "",
        last_message_time: serverTimestamp(),
        unread_siswa: 0,
        unread_guru: 0
      });
    }
    return chatId;
  }, "getOrCreateChatByUsers");
};

// 4. Reviews (Live update in DetailGuru)
export const submitReview = async (guruId, siswaId, siswaName, rating, komentar) => {
  return safeFirestoreEvent(async () => {
    const docRef = await addDoc(collection(db, "reviews"), {
      guru_id: guruId,
      siswa_id: siswaId,
      siswa_name: siswaName,
      rating: rating,
      komentar: komentar,
      created_at: serverTimestamp()
    });
    return docRef.id;
  }, "submitReview");
};

export const listenReviews = (guruId, callback) => {
  if (!guruId) return () => {};
  try {
    const q = query(
      collection(db, "reviews"),
      where("guru_id", "==", guruId.toString()),
      orderBy("created_at", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => { console.warn("Error listening reviews", error); });
  } catch (error) { console.warn("Failed review listener", error); return () => {}; }
};

// 5. Real-time Chat
export const listenChats = (role, userId, callback) => {
  if (!userId) return () => {};
  try {
    const fieldName = role === "guru" ? "guru_id" : "siswa_id";
    const q = query(
      collection(db, "chats"),
      where(fieldName, "==", userId)
    );
    return onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort locally to avoid Firebase composite index requirement
      data.sort((a, b) => {
        const timeA = a.last_message_time?.toMillis?.() || 0;
        const timeB = b.last_message_time?.toMillis?.() || 0;
        return timeB - timeA;
      });
      callback(data);
    }, (error) => { console.warn("Error listening chats", error); });
  } catch (error) { console.warn("Failed chats listener", error); return () => {}; }
};

export const listenMessages = (chatId, callback) => {
  if (!chatId) return () => {};
  try {
    const q = query(collection(db, "chats", chatId, "messages"));
    return onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeA - timeB;
      });
      callback(data);
    }, (error) => { console.warn("Error listening messages", error); });
  } catch (error) { console.warn("Failed messages listener", error); return () => {}; }
};

export const sendMessage = async (chatId, senderId, senderRole, text) => {
  return safeFirestoreEvent(async () => {
    const chatRef = doc(db, "chats", chatId);
    await addDoc(collection(chatRef, "messages"), {
      sender_id: senderId,
      sender_role: senderRole,
      text: text,
      created_at: serverTimestamp()
    });

    const updateData = {
      last_message: text,
      last_message_time: serverTimestamp()
    };
    if (senderRole === "guru") {
      updateData.unread_siswa = 1;
    } else {
      updateData.unread_guru = 1;
    }
    
    await setDoc(chatRef, updateData, { merge: true });
    return true;
  }, "sendMessage");
};

export const markAsRead = async (chatId, role) => {
  return safeFirestoreEvent(async () => {
    const chatRef = doc(db, "chats", chatId);
    const updateData = role === "guru" ? { unread_guru: 0 } : { unread_siswa: 0 };
    await setDoc(chatRef, updateData, { merge: true });
    return true;
  }, "markAsRead");
};
