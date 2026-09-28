import { useState } from "react";
import { Field, Modal, PrimaryButton, SecondaryButton } from "@/components/common/Primitives";

export default function GradeAssignmentModal({ assignment, onClose, onSave }) {
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const value = Number(score);
    if (score === "" || !Number.isFinite(value) || value < 0 || value > 100) {
      setError("Enter a number between 0 and 100.");
      return;
    }
    setLoading(true);
    try {
      await onSave(value);
    } catch (err) {
      setError(err.message || "Failed to save grade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Record a score" onClose={onClose}>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Grade {assignment.title} for {assignment.studentName}.
      </p>
      <Field
        label="Score (0–100)"
        type="number"
        min="0"
        max="100"
        value={score}
        onChange={(event) => {
          setScore(event.target.value);
          setError("");
        }}
        placeholder="78"
      />
      {error && <p className="mt-3 text-sm font-semibold text-danger-500">{error}</p>}
      <div className="mt-5 flex gap-3">
        <SecondaryButton className="flex-1" onClick={onClose} disabled={loading}>
          Cancel
        </SecondaryButton>
        <PrimaryButton className="flex-1" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Save grade"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
