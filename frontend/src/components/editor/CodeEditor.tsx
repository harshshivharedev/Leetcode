import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language.toLowerCase()}
      theme="vs-dark"
      value={code}
      onChange={(value) => onChange(value ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        padding: { top: 16, bottom: 16 },
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}

export default CodeEditor;
