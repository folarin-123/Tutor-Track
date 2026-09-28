import { Plus, RefreshCw } from "lucide-react";
import { EmptyState, PrimaryButton, SecondaryButton } from "@/components/common/Primitives";
import { SkeletonList } from "@/components/ui/Skeleton";
import StudentCard from "./StudentCard";

export default function StudentsView({
  students = [],
  loading = false,
  error = null,
  onAdd = () => {},
  onRetry = () => {},
}) {
  return (
    <div className="mt-7">
      <div className="rounded-3xl border border-dashed border-primary-300 bg-primary-50 p-5 text-primary-900 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">Add a student</p>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
              Build your roster so sessions, assignments, and payments can link to them.
            </p>
          </div>
          <PrimaryButton onClick={onAdd}>
            <Plus size={16} />
            Add student
          </PrimaryButton>
        </div>
      </div>
      <div className="mt-5">
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-center text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/30 dark:text-danger-300">
            <p className="text-sm font-semibold">{error}</p>
            <SecondaryButton className="mt-3" onClick={onRetry}>
              <RefreshCw size={14} className="mr-1 inline" /> Retry
            </SecondaryButton>
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No students yet"
            body="Your roster is empty. Add your first student to start building your roster."
            action="Add student"
            onAction={onAdd}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} full />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
