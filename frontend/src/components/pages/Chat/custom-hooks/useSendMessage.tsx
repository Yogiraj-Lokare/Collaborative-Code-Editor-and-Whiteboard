import React from "react";
import { socket } from "../../../../utils/socket/socket";
import useChatMesssageController from "./useChatMessageController";

const useSendMessage = () => {
  const { addMessage } = useChatMesssageController();
  const sendMessage = (e: any) => {
    e.preventDefault();
    let message: string = e.target.new_message.value;
    message.trim();
    if (message == "") return;
    addMessage("me", message, (Math.random() * 10000) % 1000);
    socket.emit("new-message", {
      id: (Math.random() * 10000) % 1000,
      sender: `${(Math.random() * 10000) % 1000}`,
      message: message,
    });
    console.log(e.target.new_message.value);
    e.target.new_message.value = "";
  };
  return { sendMessage };
};

export default useSendMessage;
