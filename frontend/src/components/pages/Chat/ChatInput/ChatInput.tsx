import { Button, Input } from "@chakra-ui/react";
import React from "react";
import useSendMessage from "../custom-hooks/useSendMessage";
import "../index.css";

const ChatInput: React.FC = () => {
  const { sendMessage } = useSendMessage();
  // const sendmsg = (e: any) => {
  //   e.preventDefault();
  //   let message: string = e.target.new_message.value;
  //   message.trim();
  //   if (message == "") return;
  //   addmsg("me", message, (Math.random() * 10000) % 1000);
  //   socket.emit("new-message", {
  //     id: (Math.random() * 10000) % 1000,
  //     sender: `${(Math.random() * 10000) % 1000}`,
  //     message: message,
  //   });
  //   e.target.new_message.value = "";
  // };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          borderRadius: "6px",
        }}
      >
        <form
          style={{ display: "flex", width: "100%" }}
          onSubmit={(e) => sendMessage(e)}
        >
          <Input
            name="new_message"
            type="text"
            backgroundColor="gray.50"
            placeholder="Type message here"
          ></Input>
          <Button type="submit" backgroundColor="messenger.400" color="white">
            Send
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ChatInput;
