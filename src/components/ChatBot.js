import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useChatContext } from '../context/ChatContext';

const ChatBot = () => {
  const { isOpen, setIsOpen, prefilledQuestion, setPrefilledQuestion } = useChatContext();
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Welcome to StarGazer! Ask me anything about stars and galaxies.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';

  // Handle prefilled questions
  useEffect(() => {
    if (prefilledQuestion && isOpen) {
      setInput(prefilledQuestion);
      setPrefilledQuestion('');
    }
  }, [prefilledQuestion, isOpen, setPrefilledQuestion]);

  // Define fetchConversation with useCallback
  const fetchConversation = useCallback(async (convId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/conversations/${convId}`);
      if (response.data && response.data.messages && response.data.messages.length) {
        setMessages([
          { role: 'system', content: 'Welcome to StarGazer! Ask me anything about stars and galaxies.' },
          ...response.data.messages
        ]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      // If there's an error (like conversation not found), we start fresh
      localStorage.removeItem('stargazer_conversation_id');
      setConversationId(null);
    }
  }, [apiUrl, setConversationId]);

  // Load previous conversation if any
  useEffect(() => {
    const savedConversationId = localStorage.getItem('stargazer_conversation_id');
    if (savedConversationId) {
      setConversationId(savedConversationId);
      fetchConversation(savedConversationId);
    }
  }, [fetchConversation]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the backend proxy instead of calling OpenAI directly
      const response = await axios.post(
        `${apiUrl}/api/chat`,
        {
          messages: [
            { role: 'system', content: 'You are a helpful assistant specializing in astronomy, stars, and galaxies. Provide concise and informative answers about celestial objects.' },
            ...messages.filter(msg => msg.role !== 'system'), 
            userMessage
          ],
          conversationId: conversationId
        }
      );

      // Save the conversationId for future messages
      if (response.data.conversationId && !conversationId) {
        setConversationId(response.data.conversationId);
        localStorage.setItem('stargazer_conversation_id', response.data.conversationId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: response.data.choices[0].message.content
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with ChatGPT API:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([
      { role: 'system', content: 'Welcome to StarGazer! Ask me anything about stars and galaxies.' }
    ]);
    setConversationId(null);
    localStorage.removeItem('stargazer_conversation_id');
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button 
          className="chat-button"
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          💬
        </button>
      ) : (
        <div 
          className="chat-window"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            borderRadius: '10px',
            backgroundColor: 'white',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000
          }}
        >
          <div 
            className="chat-header"
            style={{
              backgroundColor: '#0066ff',
              color: 'white',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0 }}>StarGazer Assistant</h3>
            <div>
              <button 
                onClick={startNewConversation}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
                title="Start a new conversation"
              >
                🔄
              </button>
              <button 
                onClick={toggleChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✖
              </button>
            </div>
          </div>
          
          <div 
            className="chat-messages"
            style={{
              flexGrow: 1,
              padding: '15px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {messages.filter(m => m.role !== 'system').map((message, index) => (
              <div 
                key={index}
                className={`message ${message.role}`}
                style={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f1f1f1',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  wordBreak: 'break-word'
                }}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div 
                className="message assistant"
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#f1f1f1',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  maxWidth: '70%'
                }}
              >
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              padding: '10px',
              borderTop: '1px solid #eee'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about stars and galaxies..."
              style={{
                flexGrow: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                marginRight: '10px'
              }}
            />
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: '#0066ff',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 15px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 