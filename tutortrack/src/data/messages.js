export async function getMessages() {
  await wait(180);
  return [
    {
      id: "M-5001",
      studentId: "ST-1001",
      body: "I finished the reading task.",
      channel: "student",
      unread: false,
    },
    {
      id: "M-5002",
      studentId: "ST-1002",
      body: "Can we review the algebra checklist?",
      channel: "student",
      unread: true,
    },
    {
      id: "M-5003",
      studentId: "ST-1003",
      body: "Thanks for the writing plan.",
      channel: "parent",
      unread: false,
    },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
