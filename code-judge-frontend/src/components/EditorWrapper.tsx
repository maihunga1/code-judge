import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MemoizedProblemComponent from "./Problems";
import CodeEditor from "./CodeEditor";
import Result, { SubmissionResult } from "./Result";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { submitSolution } from "../api/api";

interface EditorWrapperProps {
  isSubmitted: boolean;
  handleReturn: () => void;
  handleSubmit: (data: {
    titleSlug: string;
    codeFileContent: string;
    language: string;
  }) => void;
  lang: string;
  handleLanguageChange: (language: string) => void;
}

const EditorWrapper: React.FC<EditorWrapperProps> = React.memo(
  ({ handleReturn, handleSubmit, lang, handleLanguageChange }) => {
    const { titleSlug = "" } = useParams<{ titleSlug?: string }>();
    const [codeFileContent, setCodeFileContent] = useState<string>("");
    const [submissionData, setSubmissionData] =
      useState<SubmissionResult | undefined>(undefined);

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleCodeChange = useCallback((content: string) => {
      console.log("handleCodeChange", content);
      setCodeFileContent(content);
    }, []);

    const token = useSelector((state: RootState) => state.user.idToken);

    return (
      <div className="container">
        <div className="sidebar">
          {isSubmitted ? (
            <Result
              submissionData={submissionData}
              onReturn={() => setIsSubmitted(false)}
              titleSlug={titleSlug}
              codeFileContent={codeFileContent}
              language={lang}
            />
          ) : (
            <MemoizedProblemComponent />
          )}
        </div>
        <CodeEditor
          titleSlug={titleSlug}
          language={lang}
          onLanguageChange={handleLanguageChange}
          onSubmit={async ({
            titleSlug,
            codeFileContent,
            language,
          }) => {
            if (!token) throw new Error("Authentication token is missing.");

            const data = await submitSolution(
              titleSlug,
              codeFileContent,
              language,
              token
            );

            setSubmissionData({
              result: data.result || "No result available.",
              message: data.message || "No message provided.",
            });

            setIsSubmitted(true);
          }}
          onCodeChange={handleCodeChange}
        />
      </div>
    );
  }
);

export default EditorWrapper;
