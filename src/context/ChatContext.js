import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = useState('');

  const openChatWithQuestion = (question) => {
    setPrefilledQuestion(question);
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        isOpen, 
        setIsOpen, 
        prefilledQuestion, 
        setPrefilledQuestion,
        openChatWithQuestion,
        closeChatbot
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContext; 