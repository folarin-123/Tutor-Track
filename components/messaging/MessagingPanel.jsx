"use client";

import { useEffect, useMemo, useState } from "react";
import ConversationList from "@/components/messaging/ConversationList";
import ChatWindow from "@/components/messaging/ChatWindow";
import { Field, Modal, PrimaryButton, SecondaryButton } from "@/components/common/Primitives";
import {
  getOrCreateConversation,
  markConversationRead,
  sendMessage,
  subscribeToConversations,
  subscribeToMessages,
  unreadForRole,
} from "@/lib/messages";

export default function MessagingPanel({
  role,
  user,
  roster = [],
  onUpdateStudent,
}) {
  const [conversations, setConversations] = useState([]);
  const [listError, setListError] = useState("");
  const [listLoading, setListLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState("");
  const [linkTarget, setLinkTarget] = useState(null);

  useEffect(() => {
    if (!user?.uid) return undefined;
    setListLoading(true);
    return subscribeToConversations(
      user.uid,
      (items) => {
        const visible =
          role === "tutor"
            ? items
            : role === "parent"
              ? items.filter((item) => item.channel === "parent" && item.parentId === user.uid)
              : items.filter((item) => item.channel === "student" && item.studentId === user.uid);
        setConversations(visible);
        setListError("");
        setListLoading(false);
      },
      (error) => {
        setListError(error.message || "Unable to load conversations.");
        setListLoading(false);
      },
    );
  }, [user?.uid, role]);

  const listItems = useMemo(() => {
    const rosterItems =
      role === "tutor"
        ? roster.flatMap((student) => {
            const studentThread = conversations.find(
              (item) => item.studentId === student.uid && item.channel === "student",
            );
            const parentThread = conversations.find(
              (item) => item.studentId === student.uid && item.channel === "parent",
            );
            return [
              {
                id: studentThread?.id || `pending-student-${student.id}`,
                title: student.name,
                subtitle: student.uid ? "Student thread" : "Link a student account to message",
                preview: studentThread?.lastMessage,
                timestamp: studentThread?.lastMessageAt,
                unread: studentThread ? unreadForRole(studentThread, "tutor") : 0,
                conversation: studentThread || null,
                rosterStudent: student,
                channel: "student",
              },
              {
                id: parentThread?.id || `pending-parent-${student.id}`,
                title: `${student.name}'s parent`,
                subtitle: student.parentUid ? "Parent thread" : "Link a parent account to message",
                preview: parentThread?.lastMessage,
                timestamp: parentThread?.lastMessageAt,
                unread: parentThread ? unreadForRole(parentThread, "tutor") : 0,
                conversation: parentThread || null,
                rosterStudent: student,
                channel: "parent",
              },
            ];
          })
        : conversations.map((item) => ({
            id: item.id,
            title:
              role === "parent"
                ? item.tutorName || "Tutor"
                : item.tutorName || "Your tutor",
            subtitle:
              role === "parent"
                ? item.studentName
                  ? `About ${item.studentName}`
                  : "Parent thread"
                : "Student thread",
            preview: item.lastMessage,
            timestamp: item.lastMessageAt,
            unread: unreadForRole(item, role),
            conversation: item,
            rosterStudent: null,
            channel: item.channel,
          }));

    const needle = search.trim().toLowerCase();
    return rosterItems.filter((item) => {
      if (!needle) return true;
      return `${item.title} ${item.subtitle} ${item.preview || ""}`.toLowerCase().includes(needle);
    });
  }, [role, roster, conversations, search]);

  const selectedItem = listItems.find((item) => item.id === selectedId) || null;
  const activeConversation = selectedItem?.conversation || null;

  useEffect(() => {
    if (!activeConversation?.id) {
      setMessages([]);
      setThreadLoading(false);
      setThreadError("");
      return undefined;
    }
    setThreadLoading(true);
    return subscribeToMessages(
      activeConversation.id,
      (items) => {
        setMessages(items);
        setThreadError("");
        setThreadLoading(false);
      },
      (error) => {
        setThreadError(error.message || "Unable to load this conversation.");
        setThreadLoading(false);
      },
    );
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!activeConversation || !user?.uid || messages.length === 0) return;
    markConversationRead({
      conversation: activeConversation,
      uid: user.uid,
      role,
      messages,
    }).catch(() => {});
  }, [activeConversation, messages, role, user?.uid]);

  const openItem = async (item) => {
    setSelectedId(item.id);
    setMobileChatOpen(true);
    if (item.conversation) return;

    const student = item.rosterStudent;
    if (!student) return;
    if (item.channel === "student" && !student.uid) {
      setLinkTarget({ student, field: "uid", channel: "student" });
      return;
    }
    if (item.channel === "parent" && !student.parentUid) {
      setLinkTarget({ student, field: "parentUid", channel: "parent" });
      return;
    }
    try {
      const conversation = await getOrCreateConversation({
        tutorId: user.uid,
        studentId: student.uid,
        channel: item.channel,
        parentId: item.channel === "parent" ? student.parentUid : null,
        studentName: student.name,
        tutorName: user.name,
      });
      setSelectedId(conversation.id);
    } catch (error) {
      setThreadError(error.message || "Could not open this conversation.");
    }
  };

  const handleSend = async (text) => {
    if (!activeConversation || !user?.uid) return;
    await sendMessage({
      conversation: activeConversation,
      senderId: user.uid,
      senderRole: role,
      text,
    });
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm">
      {listError && (
        <p className="border-b border-[var(--border-default)] px-4 py-2 text-sm font-semibold text-danger-500">
          {listError}
        </p>
      )}
      <div className="grid h-[min(72vh,680px)] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className={`${mobileChatOpen ? "hidden lg:block" : "block"} border-r border-[var(--border-default)]`}>
          <ConversationList
            query={search}
            onQueryChange={setSearch}
            items={listLoading ? [] : listItems}
            selectedId={selectedItem?.conversation?.id || selectedItem?.id}
            onSelect={openItem}
            emptyTitle={listLoading ? "Loading conversations" : "No conversations yet"}
            emptyBody={
              role === "tutor"
                ? "Add a student and link their TutorTrack account ID to start a real-time thread."
                : "Conversations appear here once your tutor links your account."
            }
          />
        </div>
        <div className={`${mobileChatOpen ? "block" : "hidden lg:block"} min-w-0`}>
          {selectedItem && (activeConversation || threadError) ? (
            <ChatWindow
              title={selectedItem.title}
              subtitle={selectedItem.subtitle}
              messages={messages}
              currentUid={user?.uid}
              loading={threadLoading}
              error={threadError}
              onSend={handleSend}
              onBack={() => setMobileChatOpen(false)}
              composerDisabled={!activeConversation}
              placeholder={`Message ${selectedItem.title}`}
              emptyText="Send a message to start this conversation."
            />
          ) : (
            <div className="hidden h-full items-center justify-center p-8 lg:flex">
              <p className="max-w-sm text-center text-sm text-[var(--text-secondary)]">
                Select a conversation to read and send messages in real time.
              </p>
            </div>
          )}
        </div>
      </div>
      {linkTarget && (
        <LinkAccountModal
          target={linkTarget}
          onClose={() => setLinkTarget(null)}
          onSave={async (value) => {
            const student = {
              ...linkTarget.student,
              [linkTarget.field]: value,
            };
            onUpdateStudent?.(student.id, { [linkTarget.field]: value });
            setLinkTarget(null);
            const conversation = await getOrCreateConversation({
              tutorId: user.uid,
              studentId: student.uid,
              channel: linkTarget.channel,
              parentId: linkTarget.channel === "parent" ? student.parentUid : null,
              studentName: student.name,
              tutorName: user.name,
            });
            setSelectedId(conversation.id);
          }}
        />
      )}
    </div>
  );
}

function LinkAccountModal({ target, onClose, onSave }) {
  const [value, setValue] = useState(
    target.field === "parentUid" ? target.student.parentUid || "" : target.student.uid || "",
  );
  const submit = () => {
    if (!value.trim()) return;
    onSave(value.trim());
  };
  return (
    <Modal
      title={target.field === "parentUid" ? "Link parent account" : "Link student account"}
      onClose={onClose}
    >
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Paste the Firebase account ID from that person&apos;s TutorTrack header. Messaging uses account IDs, not names.
      </p>
      <Field
        label="Account ID"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Firebase user ID"
      />
      <div className="mt-5 flex gap-3">
        <SecondaryButton className="flex-1" onClick={onClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton className="flex-1" onClick={submit}>
          Save and continue
        </PrimaryButton>
      </div>
    </Modal>
  );
}
