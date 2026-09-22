export async function getAssignments() {
  await wait(180);
  return [
    {
      id: "A-3001",
      studentId: "ST-1001",
      title: "Reading Reflection",
      due: "2026-09-12",
      status: "Draft",
      priority: "High",
    },
    {
      id: "A-3002",
      studentId: "ST-1002",
      title: "Number Patterns",
      due: "2026-09-14",
      status: "In Review",
      priority: "Medium",
    },
    {
      id: "A-3003",
      studentId: "ST-1003",
      title: "Argument Builder",
      due: "2026-09-16",
      status: "Scheduled",
      priority: "High",
    },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
