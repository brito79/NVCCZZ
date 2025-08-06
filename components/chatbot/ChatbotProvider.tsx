'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import Chatbot from './Chatbot';
import ChatButton from './ChatButton';

interface ChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showButton?: boolean;
}

export const ChatbotProvider = ({ 
  children, 
  position = 'bottom-right',
  showButton = true 
}: ChatbotProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);
  const toggleChatbot = () => setIsOpen(!isOpen);

  const value = {
    isOpen,
    openChatbot,
    closeChatbot,
    toggleChatbot
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
      {showButton && (
        <ChatButton 
          isOpen={isOpen} 
          onToggle={toggleChatbot} 
          position={position}
        />
      )}
      <Chatbot 
        isOpen={isOpen} 
        onClose={closeChatbot} 
        position={position}
      />
    </ChatbotContext.Provider>
  );
}; 