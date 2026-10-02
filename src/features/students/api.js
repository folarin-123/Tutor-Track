import {
  addStudent as apiAddStudent,
  listStudents as apiListStudents,
  updateStudent as apiUpdateStudent,
} from "@/lib/api";

export async function listStudents() {
  return apiListStudents();
}

export async function addStudent(input) {
  return apiAddStudent(input);
}

export async function updateStudent(id, patch) {
  return apiUpdateStudent(id, patch);
}
