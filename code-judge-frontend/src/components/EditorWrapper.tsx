import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import MemoizedProblemComponent from "./problems";
import CodeEditor from "./CodeEditor";
import Result, { SubmissionResult } from "./Result";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { backendUrl, submitSolution } from "../api/api";

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
    const [submissionData, setSubmissionData] = useState<
      SubmissionResult | undefined
    >(undefined);

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleCodeChange = useCallback((content: string) => {
      console.log("handleCodeChange", content);
      setCodeFileContent(content);
    }, []);

    const token = useSelector((state: RootState) => state.user.idToken);
    const id = useSelector((state: RootState) => state.user.userId);

    console.log({ id, token });

    const [listView, setListView] = useState<any>(null);

    useEffect(() => {
      fetch(`${backendUrl}/submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setListView(data);
        });
    }, [id, token]);

    console.log({ isSubmitted });

    return (
      <div>
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
            onSubmit={async ({ titleSlug, codeFileContent, language }) => {
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

        <div className={`w-full p-2 ${isSubmitted ? "block" : "hidden"}`}>
          {listView?.map((item: any) => (
            <div
              key={item["qut-username"]}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200 mb-4"
            >
              <p className="text-blue-500 mb-2">Problem: {item.titleSlug}</p>
              <p className="text-green-500 mb-2">Language: {item.language}</p>
              <p className="text-red-500 mb-2">Result: {item.result}</p>
              <p className="text-yellow-500 mb-2 w-full text-wrap overflow-hidden">
                {item.message}
              </p>
              <p className="text-gray-400">
                Submitted: {new Date(item.created).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default EditorWrapper;
