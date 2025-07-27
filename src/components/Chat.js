import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatAPI, createSession } from '../services/api';

// Utility function to detect and convert plain URLs to clickable links
const detectAndFormatLinks = (text) => {
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // If text contains URLs, convert them to markdown links
  if (urlRegex.test(text)) {
    return text.replace(urlRegex, (url) => `[${url}](${url})`);
  }
  
  return text;
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [templateQueries, setTemplateQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const botMessageIndexRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [chatHistory]);

  const initializeChat = async () => {
    try {
      // Create a new session
      const newSessionId = await createSession();
      setSessionId(newSessionId);
      
      // Fetch template queries
      await fetchTemplateQueries();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError('Failed to initialize chat. Please try refreshing the page.');
    } finally {
      setIsInitializing(false);
    }
  };

  const fetchTemplateQueries = async () => {
    try {
      const templates = await chatAPI.getTemplateQueries();
      setTemplateQueries(templates);
    } catch (error) {
      console.error('Failed to fetch template queries:', error);
      // Fallback to mock templates
      const mockTemplates = [
        "How much did I spend on snacks last month?",
        "Do I have ingredients for Butter Paneer?",
        "How much did I spend on clothes last month?"
      ];
      setTemplateQueries(mockTemplates);
    }
  };

  const sendMessage = async (text) => {
    if (!text?.trim() && !message.trim()) return;
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }
    
    const messageText = text || message;
    setMessage('');
    setIsLoading(true);

    // Add user message to chat history
    setChatHistory(prev => {
      const newHistory = [...prev, { 
        type: 'user', 
        text: messageText, 
        timestamp: new Date() 
      }];
      
      // Add initial bot message for streaming
      newHistory.push({ 
        type: 'bot', 
        text: '', 
        timestamp: new Date(),
        isStreaming: true
      });
      
      // Store the bot message index
      botMessageIndexRef.current = newHistory.length - 1;
      
      return newHistory;
    });

    try {
      // Call the backend API with SSE streaming
      await chatAPI.sendMessage(sessionId, messageText, (chunk) => {
        // Update the bot message with streaming chunks
        setChatHistory(prev => {
          const newHistory = [...prev];
          const botIndex = botMessageIndexRef.current;
          if (newHistory[botIndex]) {
            newHistory[botIndex] = {
              ...newHistory[botIndex],
              text: newHistory[botIndex].text + chunk,
              isStreaming: true
            };
          }
          return newHistory;
        });
      });

      // Mark streaming as complete
      setChatHistory(prev => {
        const newHistory = [...prev];
        const botIndex = botMessageIndexRef.current;
        if (newHistory[botIndex]) {
          newHistory[botIndex] = {
            ...newHistory[botIndex],
            isStreaming: false
          };
        }
        return newHistory;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Update the bot message with error
      setChatHistory(prev => {
        const newHistory = [...prev];
        const botIndex = botMessageIndexRef.current;
        if (newHistory[botIndex]) {
          newHistory[botIndex] = {
            ...newHistory[botIndex],
            text: 'Sorry, I encountered an error. Please try again.',
            isStreaming: false
          };
        }
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateQuery = (query) => {
    sendMessage(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isInitializing) {
    return (
      <div className="chat">
        <div className="chat-header">
          <h1>Your personal financial assistant</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat">
        <div className="chat-header">
          <h1>Your personal financial assistant</h1>
        </div>
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <h1>Your personal financial assistant</h1>
      </div>

      {chatHistory.length === 0 && (
        <div className="template-queries">
          {templateQueries.map((query, index) => (
            <button
              key={index}
              className="template-query"
              onClick={() => handleTemplateQuery(query)}
            >
              {query}
            </button>
          ))}
        </div>
      )}

      <div className="chat-messages">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className={`message-content ${msg.isStreaming ? 'streaming' : ''}`}>
              {msg.type === 'bot' ? (
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="markdown-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          // You can add analytics or logging here if needed
                          console.log('Link clicked:', props.href);
                        }}
                      >
                        {props.children}
                        <ExternalLink size={12} className="link-icon" />
                      </a>
                    ),
                  }}
                >
                  {detectAndFormatLinks(msg.text)}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
              {msg.isStreaming && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            placeholder="Write your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button className="mic-button">
            <Mic size={20} />
          </button>
          <button 
            className="send-button"
            onClick={() => sendMessage()}
            disabled={isLoading || !message.trim() || !sessionId}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat; 