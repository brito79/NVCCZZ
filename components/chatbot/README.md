# NVCCZ Chatbot Component

A flow-based conversational chatbot component for the NVCCZ application that guides users through predefined conversation paths with clickable options and intelligent responses.

## Features

- **Flow-based conversations**: Predefined conversation paths with clickable options
- **Button-driven navigation**: Users select from predefined options to navigate
- **Greeting recognition**: Automatically detects greetings and responds appropriately
- **Text input fallback**: To do text input for specific questions
- **Conversation-like interface**: Chat-style UI with message bubbles
- **Typing indicators**: Visual feedback when the bot is "thinking"
- **Responsive design**: Works on desktop and mobile devices
- **Customizable positioning**: Can be positioned in any corner of the screen
- **Global state management**: Context-based state management for easy integration

## Components

### 1. ChatbotProvider
The main provider component that manages chatbot state and renders the chat interface.

```tsx
import { ChatbotProvider } from '@/components/chatbot';

<ChatbotProvider position="bottom-right" showButton={true}>
  {/* The app content */}
</ChatbotProvider>
```

### 2. Chatbot
The main chatbot interface component.

```tsx
import { Chatbot } from '@/components/chatbot';

<Chatbot 
  isOpen={isOpen} 
  onClose={handleClose} 
  position="bottom-right" 
/>
```

### 3. ChatButton
A floating button to trigger the chatbot.

```tsx
import { ChatButton } from '@/components/chatbot';

<ChatButton 
  isOpen={isOpen} 
  onToggle={handleToggle} 
  position="bottom-right" 
/>
```

### 4. ChatbotIntegration
A simple wrapper component for easy integration.

```tsx
import { ChatbotIntegration } from '@/components/chatbot';

<ChatbotIntegration position="bottom-right">
  {/* Your app content */}
</ChatbotIntegration>
```

## Usage Examples

### Basic Integration
```tsx
import { ChatbotProvider } from '@/components/chatbot';

function App() {
  return (
    <ChatbotProvider position="bottom-right">
      <div>Your app content</div>
    </ChatbotProvider>
  );
}
```

### Custom Hook Usage
```tsx
import { useChatbot } from '@/components/chatbot';

function MyComponent() {
  const { isOpen, openChatbot, closeChatbot, toggleChatbot } = useChatbot();
  
  return (
    <div>
      <button onClick={openChatbot}>Open Chat</button>
      <button onClick={closeChatbot}>Close Chat</button>
      <button onClick={toggleChatbot}>Toggle Chat</button>
    </div>
  );
}
```

### Different Positions
```tsx
// Bottom right (default)
<ChatbotProvider position="bottom-right">

// Bottom left
<ChatbotProvider position="bottom-left">

// Top right
<ChatbotProvider position="top-right">

// Top left
<ChatbotProvider position="top-left">
```

## Conversation Flow

The chatbot uses predefined conversation flows with clickable options. Users can:

1. **Click buttons** to navigate through different topics
2. **Type greetings** (hi, hello, hey, etc.) to start the conversation
3. **Use text input** for specific questions (optional)

### Main Conversation Paths:
- **About NVCCZ**: Company information, mission, vision, values
- **Funding Options**: Venture capital, private equity, incubation programs
- **How to Apply**: Application process, requirements
- **Contact Information**: Office location, phone, email
- **Investment Sectors**: Technology, agriculture, manufacturing, etc.

### Navigation Features:
- **Back buttons** to return to previous topics
- **Main menu** option to return to the start
- **Contextual options** based on current conversation flow

## Styling

The chatbot uses Tailwind CSS classes and can be customized by modifying the component styles. The default theme uses:
- Blue gradient for headers
- White/gray for message bubbles
- Responsive design with mobile-first approach

## Dependencies

- React 18+
- Framer Motion (for animations)
- Lucide React (for icons)
- Tailwind CSS (for styling)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Lazy loading of knowledge base
- Efficient message rendering with React keys
- Optimized animations with Framer Motion
- Minimal re-renders with proper state management 