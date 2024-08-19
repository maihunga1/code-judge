import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import ProblemComponent from "./components/Problems";
import CodeEditor, { CodeEditorProps } from "./components/CodeEditor";
import { AuthProvider } from "./context/AuthContext";
import Register from "./components/Register";
import Result from "./components/Result";
import ProblemList from "./components/ProblemList";

const App: React.FC = () => {
  const [lang, setLang] = useState<CodeEditorProps["lang"]>("javascript");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [codeFileContent, setCodeFileContent] = useState<string>("");

  const handleLanguageChange: CodeEditorProps["onLanguageChange"] = (lang) => {
    setLang(lang);
  };

  const handleSubmit = useCallback(
    async ({
      titleSlug,
      codeFileContent,
      language,
    }: {
      titleSlug: string;
      codeFileContent: string;
      language: string;
    }) => {
      try {
        await axios.post("/submission", {
          titleSlug,
          codeFileContent,
          language,
        });
        setIsSubmitted((prevState: boolean) => !prevState);
      } catch (error) {
        console.error("Error submitting code:", error);
      }
    },
    []
  );

  const handleReturn = useCallback(() => {
    setIsSubmitted((prevState: boolean) => !prevState);
  }, []);

  const handleCodeChange = (content: string) => {
    setCodeFileContent(content);
  };

  const EditorWrapper: React.FC = () => {
    const { titleSlug } = useParams<{ titleSlug: string }>();

    return (
      <div className="container">
        <div className="sidebar">
          {isSubmitted ? (
            <Result onReturn={handleReturn} />
          ) : (
            <ProblemComponent />
          )}
        </div>
        <CodeEditor
          titleSlug={titleSlug || ""}
          codeFileContent={codeFileContent}
          lang={lang}
          onLanguageChange={handleLanguageChange}
          onSubmit={() =>
            handleSubmit({
              titleSlug: titleSlug || "",
              codeFileContent,
              language: lang,
            })
          }
          onCodeChange={handleCodeChange}
        />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/editor/:titleSlug" element={<EditorWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
