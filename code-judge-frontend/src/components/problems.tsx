import { useEffect, useState } from "react";
import { getProblem } from "../api";
import DOMPurify from "dompurify";

interface Problem {
  title: string;
  content: string;
}

interface ProblemComponentProps {
  title: string;
}

function ProblemComponent({ title }: ProblemComponentProps) {
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    getProblem(title)
      .then((problem) => setProblem(problem))
      .catch((error) => console.error(error));
  }, [title]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(problem?.content || ""),
      }}
    />
  );
}

export default ProblemComponent;
