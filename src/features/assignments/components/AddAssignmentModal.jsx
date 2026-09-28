import { useMemo, useState } from "react";
import { Field, Modal, PrimaryButton, SelectField } from "@/components/common/Primitives";

export default function AddAssignmentModal({ onClose, students = [], onAdd, push }) {
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);

  const studentOptions = useMemo(
    () => ["Unassigned", ...students.map((s) => s.name)],
    [students],
  );

  const submit = async () => {
    if (!title.trim() || !due) return;
    const student = students.find((s) => s.name === studentId);
    setLoading(true);
    try {
      await onAdd({
        studentId: student?.id || null,
        studentName: studentId || "Unassigned",
        title: title.trim(),
        due,
      });
      push?.("Assignment added.");
      onClose();
    } catch (err) {
      push?.(err.message || "Failed to add assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add an assignment" onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          label="Student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          options={studentOptions}
        />
        <Field label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="WAEC Past Paper Practice" />
        <Field label="Due date" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </PrimaryButton>
    </Modal>
  );
}
