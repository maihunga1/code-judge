import axios from "axios";

export const problemUrl = "http://localhost:3000";

export const submissionUrl = "http://localhost:3001";

async function getProblemDescription(titleSlug: string, token: string) {
  try {
    const response = await axios.get(`${problemUrl}/problems/${titleSlug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.info("Problem fetched successfully:", response.data);

    return response.data.problemDescription;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching problem:", error.response.data);
    } else {
      console.error("Error fetching problem:", error);
    }
    throw new Error("Failed to fetch problem. Please try again later.");
  }
}

async function getSample(titleSlug: string, token: string) {
  try {
    const response = await axios.get(`${problemUrl}/problems/${titleSlug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.info("Sample fetched successfully:", response.data);
    return response.data.sampleCode.javascript;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching sample:", error.response.data);
    } else {
      console.error("Error fetching sample:", error);
    }
    throw new Error("Failed to fetch sample. Please try again later.");
  }
}

async function getAllProblems(token: string) {
  try {
    const response = await axios.get(`${problemUrl}/problems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.console.info("Problems fetched successfully:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching problem:", error.response.data);
    } else {
      console.error("Error fetching problem:", error);
    }
    throw new Error("Failed to fetch problem. Please try again later.");
  }
}

async function submitSolution(
  titleSlug: string,
  codeFileContent: string,
  language: string,
  token: string
): Promise<any> {
  if (!titleSlug || !codeFileContent || !language || !token) {
    throw new Error("All parameters (titleSlug, codeFileContent, language, token) are required.");
  }

  try {
    const response = await axios.post(
      `${submissionUrl}/submissions`,
      {
        titleSlug,
        codeFileContent,
        language,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.info("Solution submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error submitting solution:", error.response.data);
      throw new Error(`Failed to submit solution: ${error.response.data.message || error.response.data}`);
    } else {
      console.error("Error submitting solution:", error);
      throw new Error("Failed to submit solution. Please try again later.");
    }
  }
}

export {
  getProblemDescription,
  getAllProblems,
  submitSolution,
  getSample,
};
