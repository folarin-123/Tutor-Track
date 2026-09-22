export async function getPayments() {
  await wait(180);
  return [
    {
      id: "PY-4001",
      studentId: "ST-1001",
      amount: 120,
      status: "Paid",
      month: "Sep 2026",
    },
    {
      id: "PY-4002",
      studentId: "ST-1002",
      amount: 120,
      status: "Due",
      month: "Sep 2026",
    },
    {
      id: "PY-4003",
      studentId: "ST-1003",
      amount: 120,
      status: "Paid",
      month: "Sep 2026",
    },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
