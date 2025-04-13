import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';
import GalleryPage from './components/GalleryPage';
import ContactUsPage from './components/ContactUsPage';
import ChatBot from './components/ChatBot';
import { ChatProvider } from './context/ChatContext';
import './App.css';

// ChatBot wrapper component that conditionally renders based on route
const ChatBotWrapper = () => {
  const location = useLocation();
  
  // Don't show the chatbot on the contact-us page
  if (location.pathname === '/contact-us') {
    return null;
  }
  
  return <ChatBot />;
};

// Main app layout with routing
const AppLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
      </Routes>
      <ChatBotWrapper />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ChatProvider>
        <AppLayout />
      </ChatProvider>
    </Router>
  );
}

export default App;