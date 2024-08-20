import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import MemoizedProblemComponent from "./Problems";
import CodeEditor from "./CodeEditor";
import Result from "./Result";

interface EditorWrapperProps {
  isSubmitted: boolean;
  handleReturn: () => void;
  handleSubmit: ({
    titleSlug,
    codeFileContent,
    language,
  }: {
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

    const handleSubmitCallback = useCallback(() => {
      handleSubmit({
        titleSlug,
        codeFileContent: "", // The content will be retrieved inside the CodeEditor component
        language: lang,
      });
    }, [handleSubmit, titleSlug, lang]);

    return (
      <div className="container">
        <div className="sidebar">
          {isSubmitted ? (
            <Result onReturn={handleReturn} />
          ) : (
            <MemoizedProblemComponent />
          )}
        </div>
        <CodeEditor
          titleSlug={titleSlug}
          lang={lang}
          onLanguageChange={handleLanguageChange}
          onSubmit={handleSubmitCallback}
        />
      </div>
    );
  }
);

export default EditorWrapper;
