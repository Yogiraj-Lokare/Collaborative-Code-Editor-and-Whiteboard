import React, { useEffect } from "react";
import useChatMesssageController from "../custom-hooks/useChatMessageController";
import "../index.css";

const MessageContainer: React.FC = () => {
  const { messageList } = useChatMesssageController();

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

const MessageBox: React.FC<MessageProps> = ({ sender, message }) => {
  return (
    <React.Fragment>
      <div className="message-box">
        <strong className="message-sender">{sender}</strong>
        <div className="message">{message}</div>
      </div>
    </React.Fragment>
  );
};

type MessageProps = {
  sender: string;
  message: string;
};

export default MessageContainer;
