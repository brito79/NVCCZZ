'use client'

import { ChatbotProvider } from './ChatbotProvider';

interface ChatbotIntegrationProps {
  children: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showButton?: boolean;
}

const ChatbotIntegration = ({ 
  children, 
  position = 'bottom-right',
  showButton = true 
}: ChatbotIntegrationProps) => {
  return (
    <ChatbotProvider position={position} showButton={showButton}>
      {children}
    </ChatbotProvider>
  );
};

export default ChatbotIntegration; 