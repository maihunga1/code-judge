import { useEffect, useState } from "react";
import { getProblemDescription } from "../api/api";
import DOMPurify from "dompurify";
import { IProblem } from "@codingsnack/leetcode-api/lib/models/IProblem";
import { useParams } from "react-router-dom";
import React from "react";

const Problems: React.FC = React.memo(() => {
  const { titleSlug } = useParams<{ titleSlug: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);

  useEffect(() => {
    console.log(titleSlug);
    if (titleSlug) {
      getProblemDescription(titleSlug)
        .then((problem) => setProblem(problem))
        .catch((error) => console.error(error));
    }
  }, [titleSlug]);

  console.log("Problems component re-rendered");

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(problem?.content || ""),
      }}
    />
  );
});

export default Problems;
