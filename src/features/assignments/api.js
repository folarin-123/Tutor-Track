import {
  addAssignment as apiAddAssignment,
  gradeAssignment as apiGradeAssignment,
  listAssignments as apiListAssignments,
} from "@/lib/api";

export async function listAssignments() {
  return apiListAssignments();
}

export async function addAssignment(input) {
  return apiAddAssignment(input);
}

export async function gradeAssignment(id, score) {
  return apiGradeAssignment(id, score);
}
