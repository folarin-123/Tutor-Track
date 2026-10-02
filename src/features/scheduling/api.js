import {
  addSession as apiAddSession,
  listSessions as apiListSessions,
} from "@/lib/api";

export async function listSessions() {
  return apiListSessions();
}

export async function addSession(input) {
  return apiAddSession(input);
}
