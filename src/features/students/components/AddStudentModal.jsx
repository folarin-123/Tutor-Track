import { useState } from "react";
import { Field, Modal, PrimaryButton } from "@/components/common/Primitives";

export default function AddStudentModal({ onClose, onAdd, push }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [uid, setUid] = useState("");
  const [parentUid, setParentUid] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        grade: grade.trim() || "SS1",
        uid: uid.trim(),
        parentUid: parentUid.trim(),
      });
      push?.(`${name.trim()} was added to your roster.`);
      onClose();
    } catch (err) {
      push?.(err.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add a student" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Student name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <Field label="Level / Class" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="SS1" />
        <Field
          label="Student account ID (optional)"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="From the student's TutorTrack header"
        />
        <Field
          label="Parent account ID (optional)"
          value={parentUid}
          onChange={(e) => setParentUid(e.target.value)}
          placeholder="From the parent's TutorTrack header"
        />
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </PrimaryButton>
    </Modal>
  );
}
