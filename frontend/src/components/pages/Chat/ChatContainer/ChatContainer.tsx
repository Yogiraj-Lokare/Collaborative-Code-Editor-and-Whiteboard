import React, { useEffect } from "react";
import ChatInput from "../ChatInput/ChatInput";
import MessageContainer from "../MessageContainer/MessageContainer";
import "../index.css";
import useChatMesssageController from "../custom-hooks/useChatMessageController";

const ChatContainer: React.FC = () => {
  //const { messageList } = useChatMesssageController();
  //messageList={messageList}
  return (
    <React.Fragment>
      <MessageContainer />
      <div className="chat-input-container">
        <ChatInput />
      </div>
    </React.Fragment>
  );
};

export default ChatContainer;
