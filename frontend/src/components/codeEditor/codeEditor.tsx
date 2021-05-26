import React, { useState, useEffect, ChangeEvent } from "react";
import { Editor } from "codemirror";
import { Flex, FormControl, Select } from "@chakra-ui/react";
import "codemirror/theme/monokai.css";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import { UnControlled as CodeMirrorEditor } from "react-codemirror2";
import { socket } from "../../socket/socket";
import { Document, Update } from "../../types";
import EditorClient from "../../ot/editor-client";
import CodeMirrorAdapter from "../../ot/codemirror-adapter";
import SocketIOAdapter from "../../ot/socketio-adapter";
import WindowAddon from "../../utils/WindowAddon";

const CodeEditor: React.FC = () => {
  const [language, setLanguage] = useState<number | string>(0);
  var editor1: Editor;

  //*******************************************************************

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    socket.emit("changeLanguage", {
      room: "room",
      language: e.target.value,
    });
  };
  const InitilizeEditor = (document: Document) => {
    if (editor1 != undefined) {
      editor1.setValue(document.str);
      WindowAddon.cmClient = new EditorClient(
        document.revision,
        document.clients,
        new SocketIOAdapter(socket),
        new CodeMirrorAdapter(editor1)
      );
    }
  };

  //###########################################################

  socket.on("update__", (document: Update) => {
    WindowAddon.update(document.document);
    setLanguage(document.language);
  });
  socket.on("doc", (document: Document) => {
    InitilizeEditor(document);
  });
  socket.on("updateLanguage", (language: number) => {
    setLanguage(language);
  });

  //###########################################################

  useEffect(() => {
    socket.emit("joinRoom", { room: "room", username: Date.now().toString() });
  }, []);

  //*******************************************************************

  return (
    <React.Fragment>
      <div style={{ width: "100%" }}>
        <Flex direction="row" justifyContent="flex-end" padding="1">
          <FormControl w="10vw" marginRight="3">
            <Select
              borderColor="cyan.300"
              borderWidth="medium"
              bg="cyan.100"
              value={language}
              onChange={(e) => handleChange(e)}
            >
              <option value={0}>C++</option>
              <option value={1}>Javascript</option>
              <option value={2}>Java</option>
              <option value={3}>Python</option>
            </Select>
          </FormControl>
        </Flex>
        <div style={{ fontSize: "20px" }}>
          <CodeMirrorEditor
            editorDidMount={(editor: Editor) => {
              editor.setSize("100%", "78vh");
              editor1 = editor;
            }}
            options={{
              theme: "monokai",
              lineNumbers: true,
              lineWrapping: true,
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default CodeEditor;
