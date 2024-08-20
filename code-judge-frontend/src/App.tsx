import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import ProblemList from "./components/ProblemList";
import Register from "./components/Register";
import EditorWrapper from "./components/EditorWrapper";
import { AuthProvider } from "./context/AuthContext";
import { CodeEditorProps } from "./components/CodeEditor";

const App: React.FC = () => {
  const [lang, setLang] = useState<CodeEditorProps["lang"]>("javascript");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleLanguageChange = useCallback((lang: CodeEditorProps["lang"]) => {
    setLang(lang);
  }, []);

  const handleSubmit = useCallback(
    async ({
      titleSlug,
      codeFileContent,
      language,
    }: {
      titleSlug: string;
      codeFileContent: string;
      language: CodeEditorProps["lang"];
    }) => {
      try {
        await axios.post("/submission", {
          titleSlug,
          codeFileContent,
          language,
        });
        setIsSubmitted((prevState) => !prevState);
      } catch (error) {
        console.error("Error submitting code:", error);
        // Consider adding user feedback for errors here
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
