import { Avatar } from "@/components/common/Primitives";

export default function StudentCard({ student, full }) {
  return (
    <div className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <div className="flex gap-3">
        <Avatar value={student.name} />
        <div>
          <p className="font-bold">{student.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{student.grade}</p>
        </div>
      </div>
      {full && student.note && (
        <p className="mt-4 text-xs leading-5 text-[var(--text-secondary)]">{student.note}</p>
      )}
    </div>
  );
}
