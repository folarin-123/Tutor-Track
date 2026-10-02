import {
  getOrCreateConversation as apiGetOrCreateConversation,
  listThreads as apiListThreads,
  markConversationRead as apiMarkConversationRead,
  sendMessage as apiSendMessage,
  subscribeToConversations as apiSubscribeToConversations,
  subscribeToMessages as apiSubscribeToMessages,
} from "@/lib/api";

export async function listThreads() {
  return apiListThreads();
}

export async function sendMessage(input) {
  return apiSendMessage(input);
}

export async function getOrCreateConversation(params) {
  return apiGetOrCreateConversation(params);
}

export function subscribeToConversations(uid, onChange, onError) {
  return apiSubscribeToConversations(uid, onChange, onError);
}

export function subscribeToMessages(conversationId, onChange, onError) {
  return apiSubscribeToMessages(conversationId, onChange, onError);
}

export async function markConversationRead(params) {
  return apiMarkConversationRead(params);
}

export function unreadForRole(conversation, role) {
  if (!conversation) return 0;
  if (role === "tutor") return conversation.tutorUnread || 0;
  if (role === "parent") return conversation.parentUnread || 0;
  return conversation.studentUnread || 0;
}
