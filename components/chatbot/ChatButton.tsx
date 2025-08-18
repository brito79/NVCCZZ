'use client'

import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ChatButton = ({ isOpen, onToggle, position = 'bottom-right' }: ChatButtonProps) => {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <motion.button
      onClick={onToggle}
      className={`fixed ${positionClasses[position]} z-40 w-14 h-14 bg-blue-300 text-black-300 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </motion.button>
  );
};

export default ChatButton; 