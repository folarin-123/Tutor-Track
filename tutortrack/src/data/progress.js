export async function getProgress() {
  await wait(180);
  return [
    { studentId: "ST-1001", metric: "Reading", score: 88, trend: "+7%" },
    { studentId: "ST-1002", metric: "Math", score: 76, trend: "+4%" },
    { studentId: "ST-1003", metric: "Writing", score: 74, trend: "-2%" },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
