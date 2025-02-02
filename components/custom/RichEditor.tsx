"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}

const RichEditor = ({ placeholder, onChange, value }: RichEditorProps) => {
  const [editorValue, setEditorValue] = useState(value || "");

  const handleEditorChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <div>
      <Editor
        apiKey="0kkrz457960276rufopozros1xs30pfr4iyfbjn7jjb46fia" // Optional, but recommended for production
        value={editorValue}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
          placeholder,
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default RichEditor;
