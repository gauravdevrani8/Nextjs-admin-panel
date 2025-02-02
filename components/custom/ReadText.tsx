"use client";

import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor
//import { useMemo } from "react";

interface ReadTextProps {
  value: string;
}

const ReadText = ({ value }: ReadTextProps) => {
  const handleEditorChange = (content: string) => {
    // Handle content change if needed
    console.log(content);
  };

  return (
    <div>
      <Editor
        value={value} // Set initial content
        init={{
          menubar: false, // Disable menu bar
          toolbar: false, // Disable toolbar as it's unnecessary for readonly mode
          readonly: true, // Make editor read-only
          plugins: [], // Disable plugins
        }}
        onEditorChange={handleEditorChange} // Optional, in case you want to handle content change
      />
    </div>
  );
};

export default ReadText;
