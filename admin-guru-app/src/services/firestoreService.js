import {
  addDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  limit,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const addAdminNotification = async ({
  type = "teacher_register",
  title,
  message,
  teacherId = null,
  teacherName = "-",
}) => {
  return await addDoc(collection(db, "notifications"), {
    type,
    title,
    message,
    teacherId,
    teacherName,
    isRead: false,
    createdAt: serverTimestamp(),
  });
};

export const listenAdminNotifications = (callback) => {
  const q = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(notifications);
  });
};

export const addActivityLog = async ({
  type,
  title,
  description,
  actorRole = "-",
  actorName = "-",
  relatedId = null,
}) => {
  return await addDoc(collection(db, "activityLogs"), {
    type,
    title,
    description,
    actorRole,
    actorName,
    relatedId,
    createdAt: serverTimestamp(),
  });
};

export const listenActivityLogs = (callback) => {
  const q = query(
    collection(db, "activityLogs"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(logs);
  });
};

export const listenChatsByTeacher = (teacherId, callback) => {
  const safeTeacherId = String(teacherId || "unknown_teacher");

  const q = query(
    collection(db, "chats"),
    where("teacherId", "==", safeTeacherId)
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs
      .map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
      .sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
        const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
        return timeB - timeA;
      });

    callback(chats);
  }, (error) => {
    console.error("Gagal listen daftar chat guru:", error);
  });
};

export const listenChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    callback(messages);
  }, (error) => {
    console.error("Gagal listen pesan chat guru:", error);
  });
};

export const sendChatMessage = async ({
  chatId,
  senderId,
  senderName,
  senderRole = "guru",
  text,
}) => {
  const cleanText = String(text || "").trim();

  if (!chatId || !cleanText) {
    throw new Error("Chat ID dan pesan wajib diisi.");
  }

  const messageData = {
    senderId: String(senderId || "unknown_sender"),
    senderName: senderName || "Guru",
    senderRole,
    text: cleanText,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "chats", chatId, "messages"), messageData);

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: cleanText,
    lastMessageAt: serverTimestamp(),
  });
};
