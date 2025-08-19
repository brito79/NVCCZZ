'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Bot, User, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  options?: ChatOption[];
}

interface ChatOption {
  id: string;
  text: string;
  action: string;
}

interface ConversationFlow {
  [key: string]: {
    message: string;
    options?: ChatOption[];
  };
}

const Chatbot = ({ isOpen, onClose, position = 'bottom-right' }: {
  isOpen: boolean;
  onClose: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFlow, setCurrentFlow] = useState<string>('welcome');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define conversation flows
  const conversationFlows: ConversationFlow = {
    welcome: {
      message: "Hello! Welcome to Arcus. I'm here to help you understand our financial services and market insights. How can I assist you today?",
      options: [
        { id: 'about', text: "Tell me about Arcus", action: 'about' },
        { id: 'funding', text: "Funding options", action: 'funding' },
        { id: 'apply', text: "How to apply", action: 'apply' },
        { id: 'contact', text: "Contact information", action: 'contact' },
        { id: 'sectors', text: "Investment sectors", action: 'sectors' }
      ]
    },
    about: {
      message: "Arcus is a comprehensive financial intelligence platform providing real-time market data, financial news feeds, and analytical tools. We specialize in delivering curated financial information and market insights to help businesses and investors make informed decisions.",
      options: [
        { id: 'mission', text: "What's your mission?", action: 'mission' },
        { id: 'values', text: "Core values", action: 'values' },
        { id: 'vision', text: "Your vision", action: 'vision' },
        { id: 'back', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    funding: {
      message: "We provide comprehensive funding solutions: 1) Venture Capital Funding for startups/growth-stage businesses, 2) Private Equity Investments for established companies, 3) Incubation & Acceleration Programs with mentorship and training, and 4) Flexible instruments including equity, quasi-equity, debt financing, and mezzanine financing.",
      options: [
        { id: 'vc', text: "Venture Capital details", action: 'vc' },
        { id: 'pe', text: "Private Equity details", action: 'pe' },
        { id: 'incubation', text: "Incubation programs", action: 'incubation' },
        { id: 'back', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    apply: {
      message: "To apply for funding, submit your venture details through our online portal: https://nvccz.com/apply-online/. We review applications for startups, early-stage, and growing businesses across all supported sectors.",
      options: [
        { id: 'requirements', text: "Application requirements", action: 'requirements' },
        { id: 'process', text: "Application process", action: 'process' },
        { id: 'back', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    contact: {
      message: "You can reach us at: 4th Floor Blue Bridge North, Eastgate Mall, Harare. Tel: +263 242 709325. We're here to help with all your venture capital and investment inquiries.",
      options: [
        { id: 'location', text: "Visit our office", action: 'location' },
        { id: 'email', text: "Email us", action: 'email' },
        { id: 'back', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    sectors: {
      message: "Our key investment sectors include: Technology & ICT, Agriculture & Agro-processing, Manufacturing, Renewable Energy, Healthcare & Biotechnology, Financial Services & Fintech, Tourism & Hospitality, and Education & Training.",
      options: [
        { id: 'tech', text: "Technology & ICT", action: 'tech' },
        { id: 'agriculture', text: "Agriculture", action: 'agriculture' },
        { id: 'manufacturing', text: "Manufacturing", action: 'manufacturing' },
        { id: 'back', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    mission: {
      message: "Our mission is to provide innovative and sustainable financing solutions to Zimbabwean businesses, promoting economic growth and development by empowering entrepreneurs across all sectors.",
      options: [
        { id: 'back', text: "← Back to about", action: 'about' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    values: {
      message: "We operate on four pillars: Integrity (transparency & accountability), Innovation (creative solutions), Partnership (stakeholder collaboration), and Impact (sustainable development).",
      options: [
        { id: 'back', text: "← Back to about", action: 'about' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    vision: {
      message: "To be Zimbabwe's leading venture capital company that empowers entrepreneurs and fosters a vibrant, sustainable entrepreneurial ecosystem driving national prosperity.",
      options: [
        { id: 'back', text: "← Back to about", action: 'about' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    vc: {
      message: "Venture Capital Funding is designed for startups and growth-stage businesses. We provide equity investments, strategic guidance, and access to our network of mentors and industry experts.",
      options: [
        { id: 'back', text: "← Back to funding", action: 'funding' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    pe: {
      message: "Private Equity Investments are for established companies seeking capital for expansion, restructuring, or strategic acquisitions. We provide significant capital injections and strategic partnership.",
      options: [
        { id: 'back', text: "← Back to funding", action: 'funding' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    incubation: {
      message: "Our incubation programs support early-stage startups through mentorship, training, networking opportunities, and market access facilitation to transform ideas into viable businesses.",
      options: [
        { id: 'back', text: "← Back to funding", action: 'funding' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    requirements: {
      message: "Application requirements include: Business plan, Financial projections, Market analysis, Team background, and Proof of concept or existing traction. We evaluate based on growth potential, market opportunity, and team capability.",
      options: [
        { id: 'back', text: "← Back to apply", action: 'apply' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    process: {
      message: "Our application process: 1) Submit online application, 2) Initial screening and review, 3) Due diligence and meetings, 4) Investment committee review, 5) Final decision and offer, 6) Investment execution and ongoing support.",
      options: [
        { id: 'back', text: "← Back to apply", action: 'apply' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    location: {
      message: "Our office is located at: 4th Floor Blue Bridge North, Eastgate Mall, Harare. You can reach us at Tel: +263 242 709325. We welcome scheduled visits and consultations.",
      options: [
        { id: 'back', text: "← Back to contact", action: 'contact' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    email: {
      message: "You can email us at info@nvccz.com for general inquiries, applications@nvccz.com for funding applications, and partnerships@nvccz.com for partnership opportunities.",
      options: [
        { id: 'back', text: "← Back to contact", action: 'contact' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    tech: {
      message: "Technology & ICT: We invest in software development, fintech solutions, e-commerce platforms, digital transformation, and innovative tech startups that solve real problems in Zimbabwe and beyond.",
      options: [
        { id: 'back', text: "← Back to sectors", action: 'sectors' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    agriculture: {
      message: "Agriculture & Agro-processing: We support agribusiness, food processing, agricultural technology, sustainable farming practices, and value chain development in Zimbabwe's agricultural sector.",
      options: [
        { id: 'back', text: "← Back to sectors", action: 'sectors' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    },
    manufacturing: {
      message: "Manufacturing: We invest in local manufacturing, import substitution, value addition, industrial automation, and manufacturing innovation to strengthen Zimbabwe's industrial base.",
      options: [
        { id: 'back', text: "← Back to sectors", action: 'sectors' },
        { id: 'main', text: "← Back to main menu", action: 'welcome' }
      ]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      handleFlowChange('welcome');
    }
  }, [isOpen]);

  const handleFlowChange = (flowKey: string) => {
    const flow = conversationFlows[flowKey];
    if (!flow) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: flow.message,
        isUser: false,
        timestamp: new Date(),
        options: flow.options
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentFlow(flowKey);
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (option: ChatOption) => {
    // Add user's selection as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Navigate to the selected flow
    handleFlowChange(option.action);
  };

  const handleTextInput = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowTextInput(false);

    // Check for greeting keywords and respond accordingly
    const greetingKeywords = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'morning', 'afternoon', 'evening'];
    const isGreeting = greetingKeywords.some(keyword => 
      inputValue.toLowerCase().includes(keyword)
    );

    if (isGreeting) {
      handleFlowChange('welcome');
    } else {
      // For other text inputs, provide a helpful response
      setTimeout(() => {
        const helpMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand you're asking about something specific. Please use the options below to navigate through our services, or feel free to ask me about our funding options, services, or contact information.",
          isUser: false,
          timestamp: new Date(),
          options: [
            { id: 'about', text: "Tell me about Arcus", action: 'about' },
            { id: 'funding', text: "Funding options", action: 'funding' },
            { id: 'apply', text: "How to apply", action: 'apply' },
            { id: 'contact', text: "Contact information", action: 'contact' },
            { id: 'sectors', text: "Investment sectors", action: 'sectors' }
          ]
        };
        setMessages(prev => [...prev, helpMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextInput();
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-black-100 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">Arcus Assistant</h3>
                  <p className="text-xs">Online</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isUser 
                        ? 'bg-blue-100 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 ${
                      message.isUser
                        ? 'bg-blue-100 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Options or Text Input */}
            {messages.length > 0 && !isTyping && (
              <div className="p-3 bg-white border-t border-gray-200 max-h-48 overflow-y-auto">
                {messages[messages.length - 1].options ? (
                  <div className="space-y-1.5">
                    {messages[messages.length - 1].options!.map((option) => (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-colors group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-700 group-hover:text-blue-700">
                            {option.text}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </motion.button>
                    ))}
                    <button
                      onClick={() => setShowTextInput(true)}
                      className="w-full text-left p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors text-xs text-gray-600"
                    >
                      Or type your question...
                    </button>
                  </div>
                ) : showTextInput ? (
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleTextInput}
                      disabled={!inputValue.trim()}
                      className="px-3 py-2 bg-blue-100 text-black rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Send
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot; 