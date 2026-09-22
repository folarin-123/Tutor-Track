export async function getSessions() {
  await wait(180);
  return [
    {
      id: "S-1001",
      studentId: "ST-1001",
      tutorId: "TU-2001",
      date: "2026-09-09",
      start: "10:00",
      end: "11:30",
      status: "Scheduled",
      topic: "Reading Fluency",
    },
    {
      id: "S-1002",
      studentId: "ST-1002",
      tutorId: "TU-2001",
      date: "2026-09-10",
      start: "14:00",
      end: "15:00",
      status: "Booked",
      topic: "Math Problem Solving",
    },
    {
      id: "S-1003",
      studentId: "ST-1003",
      tutorId: "TU-2001",
      date: "2026-09-11",
      start: "16:30",
      end: "17:30",
      status: "Scheduled",
      topic: "Essay Planning",
    },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
