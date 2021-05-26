import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import React, { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import useChatMesssageController from "../react-hooks/useChatMessageController";
import "../index.css";

const ChatContainer: React.FC = () => {
  const { messageList, addMessage } = useChatMesssageController();

  return (
    <React.Fragment>
      <MessageContainer messageList={messageList} />
      <div className="chat-input-container">
        <ChatInput addmsg={addMessage} />
      </div>
    </React.Fragment>
  );
};

export default ChatContainer;

const MessageContainer: React.FC<any> = ({ messageList }) => {
  useEffect(() => {
    const msgcon = document.getElementById("msgcon");
    msgcon?.scrollTo({ top: msgcon?.scrollHeight });
  }, [messageList]);

  return (
    <React.Fragment>
      <div className="message-container" id="msgcon">
        {messageList.list.map((message: any) => {
          return (
            <MessageBox
              key={message.id}
              message={message.message}
              sender={message.sender}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
};

const ChatInput: React.FC<any> = ({ addmsg }) => {
  const sendmsg = (e: any) => {
    e.preventDefault();
    if (e.target.new_message.value == "") return;
    addmsg("me", e.target.new_message.value, (Math.random() * 10000) % 1000);
    socket.emit("new-message", {
      id: (Math.random() * 10000) % 1000,
      sender: `${(Math.random() * 10000) % 1000}`,
      message: e.target.new_message.value,
    });
    e.target.new_message.value = "";
  };

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
          onSubmit={(e) => sendmsg(e)}
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

type MessageProps = {
  sender: string;
  message: string;
};

const MessageBox: React.FC<MessageProps> = (message) => {
  return (
    <React.Fragment>
      <div className="message-box">
        <strong className="message-sender">{message.sender}</strong>
        <div className="message">{message.message}</div>
      </div>
    </React.Fragment>
  );
};
