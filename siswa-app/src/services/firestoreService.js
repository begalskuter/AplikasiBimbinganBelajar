import {
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

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

export const addReview = async ({
  teacherId,
  studentId,
  studentName,
  rating,
  comment,
}) => {
  return await addDoc(collection(db, "reviews"), {
    teacherId,
    studentId,
    studentName,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
};

export const listenReviewsByTeacher = (teacherId, callback) => {
  const q = query(
    collection(db, "reviews"),
    where("teacherId", "==", teacherId)
  );

  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

    callback(reviews);
  }, (error) => {
    console.error("Gagal listen reviews realtime:", error);
  });
};


export const createChatRoomAfterBooking = async ({
  studentId,
  studentName,
  teacherId,
  teacherName,
  bookingId,
}) => {
  return await addDoc(collection(db, "chats"), {
    studentId,
    studentName,
    teacherId,
    teacherName,
    bookingId,
    participants: [studentId, teacherId],
    lastMessage: "Chat room dibuat setelah booking berhasil.",
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const createOrGetChatRoom = async ({
  studentId,
  studentName,
  teacherId,
  teacherName,
}) => {
  const safeStudentId = String(studentId || "unknown_student");
  const safeTeacherId = String(teacherId || "unknown_teacher");
  const chatId = `${safeStudentId}_${safeTeacherId}`;
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      studentId: safeStudentId,
      studentName: studentName || "Siswa",
      teacherId: safeTeacherId,
      teacherName: teacherName || "Guru",
      participants: [safeStudentId, safeTeacherId],
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }

  return chatId;
};

export const sendChatMessage = async ({
  chatId,
  senderId,
  senderName,
  senderRole = "siswa",
  text,
}) => {
  const cleanText = String(text || "").trim();

  if (!chatId || !cleanText) {
    throw new Error("Chat ID dan pesan wajib diisi.");
  }

  const messageData = {
    senderId: String(senderId || "unknown_sender"),
    senderName: senderName || "Pengguna",
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

export const listenChatMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(messages);
  }, (error) => {
    console.error("Gagal listen pesan chat realtime:", error);
  });
};

export const listenChatsByStudent = (studentId, callback) => {
  const safeStudentId = String(studentId || "unknown_student");

  const q = query(
    collection(db, "chats"),
    where("studentId", "==", safeStudentId)
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const timeA = a.lastMessageAt?.toMillis ? a.lastMessageAt.toMillis() : 0;
        const timeB = b.lastMessageAt?.toMillis ? b.lastMessageAt.toMillis() : 0;
        return timeB - timeA;
      });

    callback(chats);
  }, (error) => {
    console.error("Gagal listen daftar chat siswa:", error);
  });
};
