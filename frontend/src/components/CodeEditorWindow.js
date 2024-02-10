import React, { useState, useEffect } from "react";
import ACTIONS from "../Actions";

import Editor from "@monaco-editor/react";
import { useSocket } from "../context/SocketContext";

const CodeEditorWindow = ({
  onChange,
  language,

  theme,
  socketRef,
  roomId,
}) => {
  const [code, setCode] = useSocket();
  const [value, setValue] = useState(code || "");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setValue(code);
          setCode(code);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
