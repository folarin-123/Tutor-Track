import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const MAX_MESSAGE_LENGTH = 2000;

export function conversationDocId(tutorId, studentId, channel) {
  return `${tutorId}__${studentId}__${channel}`;
}

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

function mapConversation(snapshot) {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    tutorId: data.tutorId || "",
    studentId: data.studentId || "",
    parentId: data.parentId || null,
    channel: data.channel === "parent" ? "parent" : "student",
    participants: Array.isArray(data.participants) ? data.participants : [],
    lastMessage: data.lastMessage || "",
    lastMessageAt: toMillis(data.lastMessageAt),
    createdAt: toMillis(data.createdAt),
    updatedAt: toMillis(data.updatedAt),
    tutorUnread: Number(data.tutorUnread) || 0,
    studentUnread: Number(data.studentUnread) || 0,
    parentUnread: Number(data.parentUnread) || 0,
    studentName: data.studentName || "",
    tutorName: data.tutorName || "",
  };
}

function mapMessage(snapshot) {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    senderId: data.senderId || "",
    senderRole: data.senderRole || "",
    recipientId: data.recipientId || "",
    text: data.text || "",
    createdAt: toMillis(data.createdAt),
    read: Boolean(data.read),
    messageType: data.messageType || "text",
  };
}

export function unreadForRole(conversation, role) {
  if (role === "tutor") return conversation.tutorUnread || 0;
  if (role === "parent") return conversation.parentUnread || 0;
  return conversation.studentUnread || 0;
}

export async function getOrCreateConversation({
  tutorId,
  studentId,
  channel = "student",
  parentId = null,
  studentName = "",
  tutorName = "",
}) {
  if (!tutorId || !studentId) {
    throw new Error("A tutor and student account are required to open a conversation.");
  }
  if (channel === "parent" && !parentId) {
    throw new Error("A parent account ID is required for this thread.");
  }

  const id = conversationDocId(tutorId, studentId, channel);
  const ref = doc(db, "conversations", id);
  const existing = await getDoc(ref);
  if (existing.exists()) return mapConversation(existing);

  const participants =
    channel === "parent" ? [tutorId, parentId] : [tutorId, studentId];

  await setDoc(ref, {
    tutorId,
    studentId,
    parentId: channel === "parent" ? parentId : null,
    channel,
    participants,
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    tutorUnread: 0,
    studentUnread: 0,
    parentUnread: 0,
    studentName: studentName || "",
    tutorName: tutorName || "",
  });

  const created = await getDoc(ref);
  return mapConversation(created);
}

export function subscribeToConversations(uid, onChange, onError) {
  if (!uid) {
    onChange([]);
    return () => {};
  }

  const conversationsQuery = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid),
  );

  return onSnapshot(
    conversationsQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map(mapConversation)
        .sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
      onChange(items);
    },
    (error) => onError?.(error),
  );
}

export function subscribeToMessages(conversationId, onChange, onError) {
  if (!conversationId) {
    onChange([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "conversations", conversationId, "messages"),
    (snapshot) => {
      const items = snapshot.docs
        .map(mapMessage)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      onChange(items);
    },
    (error) => onError?.(error),
  );
}

export async function sendMessage({
  conversation,
  senderId,
  senderRole,
  text,
}) {
  const trimmed = (text || "").trim();
  if (!conversation?.id || !senderId || !trimmed) return;
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Messages can be at most ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const recipientId =
    senderRole === "tutor"
      ? conversation.channel === "parent"
        ? conversation.parentId
        : conversation.studentId
      : conversation.tutorId;

  await addDoc(collection(db, "conversations", conversation.id, "messages"), {
    senderId,
    senderRole,
    recipientId: recipientId || "",
    text: trimmed,
    createdAt: serverTimestamp(),
    read: false,
    messageType: "text",
  });

  const unreadUpdate =
    senderRole === "tutor"
      ? conversation.channel === "parent"
        ? { parentUnread: (conversation.parentUnread || 0) + 1 }
        : { studentUnread: (conversation.studentUnread || 0) + 1 }
      : { tutorUnread: (conversation.tutorUnread || 0) + 1 };

  await updateDoc(doc(db, "conversations", conversation.id), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...unreadUpdate,
  });
}

export async function markConversationRead({ conversation, uid, role, messages }) {
  if (!conversation?.id || !uid) return;

  const unreadKey =
    role === "tutor" ? "tutorUnread" : role === "parent" ? "parentUnread" : "studentUnread";

  await updateDoc(doc(db, "conversations", conversation.id), {
    [unreadKey]: 0,
    updatedAt: serverTimestamp(),
  });

  const unreadMessages = (messages || []).filter(
    (message) => message.senderId !== uid && !message.read,
  );
  if (unreadMessages.length === 0) return;

  const batch = writeBatch(db);
  unreadMessages.forEach((message) => {
    batch.update(doc(db, "conversations", conversation.id, "messages", message.id), {
      read: true,
    });
  });
  await batch.commit();
}
