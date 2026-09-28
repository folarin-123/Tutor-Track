import { useMemo, useState } from "react";
import { Field, Modal, PrimaryButton, SelectField } from "@/components/common/Primitives";

export default function AddSessionModal({ onClose, students = [], onAdd, push }) {
  const [studentId, setStudentId] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const studentOptions = useMemo(
    () => ["Unassigned", ...students.map((s) => s.name)],
    [students],
  );

  const submit = async () => {
    if (!topic.trim() || !date || !start || !end) return;
    const student = students.find((s) => s.name === studentId);
    setLoading(true);
    try {
      await onAdd({
        studentId: student?.id || null,
        studentName: studentId || "Unassigned",
        topic: topic.trim(),
        date,
        start,
        end,
      });
      push?.("Session added to your schedule.");
      onClose();
    } catch (err) {
      push?.(err.message || "Failed to add session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add a session" onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          label="Student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          options={studentOptions}
        />
        <Field label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="WAEC Mathematics, quadratic equations" />
        <Field label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <Field label="End" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </PrimaryButton>
    </Modal>
  );
}
