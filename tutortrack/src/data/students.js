export async function getStudents() {
  await wait(180);
  return [
    {
      id: "ST-1001",
      name: "Luna Carter",
      grade: "Grade 6",
      status: "Active",
      tutor: "Avery Brooks",
      risk: "On track",
    },
    {
      id: "ST-1002",
      name: "Kai Johnson",
      grade: "Grade 7",
      status: "Active",
      tutor: "Avery Brooks",
      risk: "Growing",
    },
    {
      id: "ST-1003",
      name: "Mia Lewis",
      grade: "Grade 8",
      status: "Active",
      tutor: "Avery Brooks",
      risk: "Needs focus",
    },
  ];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
