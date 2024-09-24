import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProblemList from "./components/ProblemList";
import EditorWrapper from "./components/EditorWrapper";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CodeEditorProps } from "./components/CodeEditor";
import { submitSolution } from "./api/api";
import AuthCallback from "./components/AuthCallback";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { setUser } from "./store/slices/userSlice";
import ProblemRoute, { PrivateRoute } from "./routes/ProblemRoute";

const App = memo(function App (): React.ReactElement {
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

  const element = useMemo(() => {
    return <PrivateRoute />;
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/problems" element={element} />
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
            <Route
              path="/auth-callback"
              element={
                // <PrivateRoute>
                <AuthCallback />
                // </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
});


export default App;
