import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import "../styles/CodeEditor.css";

export interface CodeEditorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onLanguageChange,
  onSubmit,
}) => {
  const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    monacoRef.current = editor;
  }

  // function showValue() {
  //   if (!monacoRef || !monacoRef.current) return;

  //   alert(monacoRef.current.getValue());
  // }

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onLanguageChange(event.target.value);
    if (monacoRef.current) {
      const model = monacoRef.current.getModel();
      if (model) {
        editor.setModelLanguage(model, event.target.value);
      }
    }
  }

  return (
    <div className="editor-container">
      <div className="language-selector">
        <label htmlFor="language-select" style={{ marginRight: "10px" }}>
          Choose a language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="calc(100vh - 160px)"
          language={language}
          defaultValue="// some comment"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="submit-button-container">
        <button className="submit-button" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
