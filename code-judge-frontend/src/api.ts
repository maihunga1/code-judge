const backendUrl = "http://localhost:3000";

async function getProblem(title: string) {
  // eslint-disable-next-line @typescript-eslint/no-redeclare
  try {
    const response = await fetch(`${backendUrl}/problem/${title}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const problem = await response.json();
    return problem;
  } catch (error) {
    console.error("Error fetching problem:", error);
  }
}

export { getProblem };
