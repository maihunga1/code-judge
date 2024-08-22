import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ProblemList from "./components/ProblemList";
import Register from "./components/Register";
import EditorWrapper from "./components/EditorWrapper";
import { AuthProvider } from "./context/AuthContext";
import { CodeEditorProps } from "./components/CodeEditor";
import { submitSolution } from "./api/api";

const App: React.FC = () => {
  const [lang, setLang] = useState<CodeEditorProps["language"]>("javascript");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleLanguageChange = useCallback(
    (lang: CodeEditorProps["language"]) => {
      setLang(lang);
    },
    []
  );

  const handleSubmit = useCallback(
    async ({
      titleSlug = "1",
      codeFileContent,
      language,
    }: {
      titleSlug: string;
      codeFileContent: string;
      language: string;
    }) => {
      try {
        await submitSolution(titleSlug, codeFileContent, language);
        console.log(titleSlug, codeFileContent, language);
        setIsSubmitted((prevState) => !prevState);
      } catch (error) {
        console.error("Error submitting code:", error);
      }
    },
    []
  );

  const handleReturn = useCallback(() => {
    setIsSubmitted((prevState) => !prevState);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route
            path="/problems/:titleSlug"
            element={
              <EditorWrapper
                isSubmitted={isSubmitted}
                handleReturn={handleReturn}
                handleSubmit={handleSubmit}
                lang={lang}
                handleLanguageChange={handleLanguageChange}
              />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

//bugs in submitSolution

//next task is to write test cases for each problems
//then store in S3 bucket
//fetch from S3 and populate for the problem
//then deploy the frontend and backend in AWS
