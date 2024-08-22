import React, { useState, useEffect } from "react";
import { submitSolution } from "../api/api";

// Adjust the ResultProps if necessary to accept parameters or pass required values
interface ResultProps {
  onReturn: () => void;
  titleSlug: string;
  codeFileContent: string;
  language: string;
}

const Result: React.FC<ResultProps> = ({
  onReturn,
  titleSlug,
  codeFileContent,
  language,
}) => {
  const [result, setResult] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await submitSolution(titleSlug, codeFileContent, language);
        console.log("Fetched data:", data);
        setResult(data.result);
        setMessage(data.message);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setError("Failed to fetch results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <button onClick={onReturn}>Return</button>
      <h1>Result</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {result && <p>{result}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Result;
