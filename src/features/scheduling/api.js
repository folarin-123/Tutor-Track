import {
  addSession as apiAddSession,
  listSessions as apiListSessions,
} from "@/src/lib/api";

export async function listSessions() {
  return apiListSessions();
}

export async function addSession(input) {
  return apiAddSession(input);
}
