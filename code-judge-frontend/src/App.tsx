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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CodeEditorProps } from "./components/CodeEditor";
import { submitSolution } from "./api/api";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

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
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:titleSlug"
            element={
              <PrivateRoute>
                <EditorWrapper
                  isSubmitted={isSubmitted}
                  handleReturn={handleReturn}
                  handleSubmit={handleSubmit}
                  lang={lang}
                  handleLanguageChange={handleLanguageChange}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
