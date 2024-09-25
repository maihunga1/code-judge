import { useEffect, useState } from "react";
import { getProblemDescription } from "../api/api";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Problems: React.FC = React.memo(() => {
  const { titleSlug } = useParams<{ titleSlug: string }>();
  const [problem, setProblem] = useState<any>(null);

  const token = useSelector((state: RootState) => state.user.idToken);

  useEffect(() => {
    if (titleSlug) {
      if (!token) return;

      getProblemDescription(titleSlug, token)
        .then((problem) => setProblem(problem))
        .catch((error) => console.error(error));
    }
  }, [titleSlug, token]);

  console.log("Problems component re-rendered");

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(problem),
      }}
    />
  );
});

export default Problems;
