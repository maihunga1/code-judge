import axios from "axios";

const backendUrl = "http://ec2-3-106-143-64.ap-southeast-2.compute.amazonaws.com:3000";

async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${backendUrl}/login`, {
      username,
      password,
    });
    console.info("Login successful:", response.data);

    const { message, token } = response.data;

    if (!token) {
      throw new Error("Invalid response from server: No token provided");
    }

    // Extract username from JWT token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const returnedUsername = payload.username;

    if (!returnedUsername) {
      throw new Error("Invalid token: No username found");
    }

    return {
      token,
      user: { username: returnedUsername }
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Login failed:", error.response.data);
    } else {
      console.error("Login failed:", error);
    }
    throw new Error(
      "Failed to login. Please check your credentials and try again."
    );
  }
}

async function register(username: string, password: string) {
  try {
    const response = await axios.post(`${backendUrl}/register`, {
      username,
      password,
    });
    console.info("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Registration failed:", error.response.data);
    } else {
      console.error("Registration failed:", error);
    }
    throw new Error("Failed to register. Please try again later.");
  }
}

async function getProblemDescription(titleSlug: string) {
  try {
    const response = await axios.get(`${backendUrl}/problems/${titleSlug}`);
    console.info("Problem fetched successfully:", response.data);
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

async function getSample(titleSlug: string) {
  try {
    const response = await axios.get(`${backendUrl}/problems/${titleSlug}/sample`);
    console.info("Sample fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching sample:", error.response.data);
    } else {
      console.error("Error fetching sample:", error);
    }
    throw new Error("Failed to fetch sample. Please try again later.");
  }
}

async function getAllProblems() {
  try {
    const response = await axios.get(`${backendUrl}/problems`);
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
  language: string
) {
  try {
    const response = await axios.post(`${backendUrl}/submissions`, {
      titleSlug,
      codeFileContent,
      language,
    });
    console.info("Solution submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error submitting solution:", error.response.data);
    } else {
      console.error("Error submitting solution:", error);
    }
    throw new Error("Failed to submit solution. Please try again later.");
  }
}

export {
  getProblemDescription,
  login,
  register,
  getAllProblems,
  submitSolution,
  getSample,
};
