import React, { useEffect, useState } from "react";
import { socket } from "../../../../utils/socket/socket";

const Initialmessages = {
  list: [
    {
      id: 1,
      sender: "system",
      message: "welcome to our platform",
    },
    {
      id: 2,
      sender: "system",
      message: "all the best for interviews",
    },
  ],
};

const useChatMesssageController = () => {
  const [messageList, setMessages] = useState(Initialmessages);

  const addMessage = (sender: string, message: string, id: number) => {
    setMessages((oldMessageList) => {
      let newMessageList = { list: [] };
      oldMessageList.list.map((messages) => {
        //@ts-ignore
        newMessageList.list.push(messages);
      });
      //@ts-ignore
      newMessageList.list.push({ sender: sender, message: message, id: id });
      return newMessageList;
    });
    console.log(messageList);
  };
  useEffect(() => {
    socket.on("add-message", (data) => {
      addMessage(data.sender, data.message, data.id);
    });
  }, []);
  return { messageList, addMessage };
};

export default useChatMesssageController;
