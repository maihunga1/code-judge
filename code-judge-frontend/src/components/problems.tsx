import { useEffect, useState } from "react";
import { getProblem } from "../api/api";
import DOMPurify from "dompurify";
import { IProblem } from "@codingsnack/leetcode-api/lib/models/IProblem";
import { useParams } from "react-router-dom";

function Problems() {
  const { titleSlug } = useParams<{ titleSlug: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);

  useEffect(() => {
    if (titleSlug) {
      getProblem(titleSlug)
        .then((problem) => setProblem(problem))
        .catch((error) => console.error(error));
    }
  }, [titleSlug]);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(problem?.content || ""),
      }}
    />
  );
}

export default Problems;
