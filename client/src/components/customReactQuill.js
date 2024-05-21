import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomReactQuill = ({ value, onChange, modules, formats }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      // Perform any operations on the quill instance via the ref if needed
      const editor = quillRef.current.getEditor();
      // Example: console.log(editor.getText());
    }
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
    />
  );
};

export default CustomReactQuill;
