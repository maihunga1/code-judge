import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MemoizedProblemComponent from "./Problems";
import CodeEditor from "./CodeEditor";
import Result from "./Result";

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
  ({ isSubmitted, handleReturn, handleSubmit, lang, handleLanguageChange }) => {
    const { titleSlug = "" } = useParams<{ titleSlug?: string }>();
    const [codeFileContent, setCodeFileContent] = useState<string>("");

    const handleSubmitCallback = useCallback(
      (data: {
        titleSlug: string;
        codeFileContent: string;
        language: string;
      }) => {
        console.log(data);
        handleSubmit(data);
      },
      [handleSubmit]
    );

    const handleCodeChange = useCallback((content: string) => {
      console.log("handleCodeChange", content);
      setCodeFileContent(content);
    }, []);

    return (
      <div className="container">
        <div className="sidebar">
          {isSubmitted ? (
            <Result
              onReturn={handleReturn}
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
          onSubmit={(data) => handleSubmitCallback({ ...data })}
          onCodeChange={handleCodeChange}
        />
      </div>
    );
  }
);

export default EditorWrapper;
