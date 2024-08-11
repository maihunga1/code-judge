import React, { useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import styled from "styled-components";
import ProblemComponent from "./components/problems";

function App() {
  const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [language, setLanguage] = useState("javascript");

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    monacoRef.current = editor;
  }

  function showValue() {
    if (!monacoRef || !monacoRef.current) return;

    alert(monacoRef.current.getValue());
  }

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLanguage(event.target.value);
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        editor.setModelLanguage(model, event.target.value);
      }
    }
  }

  return (
    <Container>
      <Sidebar>
        <ProblemComponent title={"two-sum"} />
      </Sidebar>
      <EditorContainer>
        <LanguageSelector>
          <label htmlFor="language-select" style={{ marginRight: "10px" }}>
            Choose a language:
          </label>
          <select id="language-select" onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </LanguageSelector>
        <EditorWrapper>
          <Editor
            height="calc(100vh - 160px)"
            language={language}
            defaultValue="// some comment"
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
        </EditorWrapper>
        <SubmitButtonContainer>
          <SubmitButton onClick={showValue}>Submit</SubmitButton>
        </SubmitButtonContainer>
      </EditorContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  color: #333;
`;

const Sidebar = styled.div`
  width: 40%;
  padding: 20px;
  background-color: #ffffff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const LanguageSelector = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const EditorWrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #ddd;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

export default App;
