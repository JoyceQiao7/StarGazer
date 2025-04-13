const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import models if available
let Conversation, StarInfo, ContactSubmission, mongoose;
try {
  mongoose = require('mongoose');
  Conversation = require('./models/Conversation');
  StarInfo = require('./models/StarInfo');
  ContactSubmission = require('./models/ContactSubmission');
} catch (err) {
  console.warn('MongoDB models not available, using in-memory storage');
}

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stargazer_db';

// In-memory fallback storage
const inMemoryConversations = [];
const inMemoryStars = [
  {
    id: '1',
    name: 'Andromeda Galaxy',
    type: 'galaxy',
    description: 'The Andromeda Galaxy is a spiral galaxy approximately 2.5 million light-years from Earth. It is the nearest major galaxy to the Milky Way.',
    basicFacts: {
      distance: '2.5 million light-years',
      size: '220,000 light-years across',
      constellation: 'Andromeda'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1200px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
    searchCount: 0
  },
  {
    id: '2',
    name: 'Sirius',
    type: 'star',
    description: 'Sirius is the brightest star in the night sky. Its name is derived from the Greek word for "glowing" or "scorching".',
    basicFacts: {
      distance: '8.6 light-years',
      size: '1.7 times the radius of the Sun',
      constellation: 'Canis Major'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Sirius_A_and_B_Hubble_photo.jpg',
    searchCount: 0
  },
  {
    id: '3',
    name: 'Orion Nebula',
    type: 'nebula',
    description: 'The Orion Nebula is a diffuse nebula situated in the Milky Way, being south of Orion\'s Belt in the constellation of Orion.',
    basicFacts: {
      distance: '1,344 light-years',
      size: '24 light-years across',
      constellation: 'Orion'
    },
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1200px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
    searchCount: 0
  }
];
const inMemoryContactSubmissions = [];

// Connect to MongoDB if possible
let isMongoConnected = false;
if (mongoose) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      isMongoConnected = true;
    })
    .catch(err => {
      console.warn('MongoDB connection failed, using in-memory storage:', err.message);
    });
}

// Middleware
app.use(cors());
app.use(express.json());

// Star info endpoints
app.get('/api/stars', async (req, res) => {
  try {
    const { name, type, limit = 10 } = req.query;
    
    if (isMongoConnected) {
      let query = {};
      
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
      
      if (type) {
        query.type = type;
      }
      
      const stars = await StarInfo.find(query)
        .sort({ searchCount: -1 })
        .limit(parseInt(limit));
        
      res.json(stars);
    } else {
      // Use in-memory stars
      let filteredStars = [...inMemoryStars];
      
      if (name) {
        filteredStars = filteredStars.filter(star => 
          star.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      if (type) {
        filteredStars = filteredStars.filter(star => star.type === type);
      }
      
      filteredStars = filteredStars
        .sort((a, b) => b.searchCount - a.searchCount)
        .slice(0, parseInt(limit));
      
      res.json(filteredStars);
    }
  } catch (error) {
    console.error('Error fetching stars:', error);
    res.status(500).json({ error: 'Failed to fetch star information' });
  }
});

app.get('/api/stars/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const star = await StarInfo.findById(req.params.id);
      if (!star) {
        return res.status(404).json({ error: 'Star not found' });
      }
      
      // Update search count
      star.searchCount += 1;
      star.lastSearched = new Date();
      await star.save();
      
      res.json(star);
    } else {
      // Use in-memory stars
      const star = inMemoryStars.find(s => s.id === req.params.id);
      if (!star) {
        return res.status(404).json({ error: 'Star not found' });
      }
      
      star.searchCount += 1;
      star.lastSearched = new Date();
      
      res.json(star);
    }
  } catch (error) {
    console.error('Error fetching star:', error);
    res.status(500).json({ error: 'Failed to fetch star information' });
  }
});

app.post('/api/stars', async (req, res) => {
  try {
    const { name, type, description, basicFacts, imageUrl } = req.body;
    
    if (isMongoConnected) {
      // Check if star already exists
      const existingStar = await StarInfo.findOne({ name });
      if (existingStar) {
        return res.status(400).json({ error: 'Star with this name already exists' });
      }
      
      const newStar = new StarInfo({
        name,
        type,
        description,
        basicFacts,
        imageUrl
      });
      
      await newStar.save();
      res.status(201).json(newStar);
    } else {
      // Use in-memory stars
      const existingStar = inMemoryStars.find(star => star.name === name);
      if (existingStar) {
        return res.status(400).json({ error: 'Star with this name already exists' });
      }
      
      const newStar = {
        id: uuidv4(),
        name,
        type,
        description,
        basicFacts,
        imageUrl,
        searchCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      inMemoryStars.push(newStar);
      res.status(201).json(newStar);
    }
  } catch (error) {
    console.error('Error creating star:', error);
    res.status(500).json({ error: 'Failed to create star information' });
  }
});

// Conversation endpoints
app.get('/api/conversations', async (req, res) => {
  try {
    if (isMongoConnected) {
      const conversations = await Conversation.find()
        .sort({ updatedAt: -1 })
        .limit(20);
      res.json(conversations);
    } else {
      // Use in-memory conversations
      const conversations = inMemoryConversations
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 20);
      res.json(conversations);
    }
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/conversations/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const conversation = await Conversation.findOne({ conversationId: req.params.id });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } else {
      // Use in-memory conversations
      const conversation = inMemoryConversations.find(
        conv => conv.conversationId === req.params.id
      );
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    }
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Enhanced chat endpoint that stores conversations
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, conversationId } = req.body;
    let conversation;
    const currentTime = new Date();
    
    // Find existing conversation or create a new one
    if (isMongoConnected) {
      if (conversationId) {
        conversation = await Conversation.findOne({ conversationId });
      }
      
      if (!conversation) {
        conversation = new Conversation({
          conversationId: conversationId || uuidv4(),
          messages: messages.filter(msg => msg.role !== 'system')
        });
      } else {
        // Update existing conversation with new messages
        const userMessage = messages.find(msg => msg.role === 'user');
        if (userMessage) {
          conversation.messages.push({
            role: userMessage.role,
            content: userMessage.content,
            timestamp: currentTime
          });
        }
      }
    } else {
      // Use in-memory conversations
      if (conversationId) {
        conversation = inMemoryConversations.find(
          conv => conv.conversationId === conversationId
        );
      }
      
      if (!conversation) {
        conversation = {
          conversationId: conversationId || uuidv4(),
          messages: messages.filter(msg => msg.role !== 'system'),
          starName: null,
          createdAt: currentTime,
          updatedAt: currentTime
        };
        inMemoryConversations.push(conversation);
      } else {
        // Update existing conversation with new messages
        const userMessage = messages.find(msg => msg.role === 'user');
        if (userMessage) {
          conversation.messages.push({
            role: userMessage.role,
            content: userMessage.content,
            timestamp: currentTime
          });
        }
        conversation.updatedAt = currentTime;
      }
    }
    
    // Call OpenAI API
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    // Extract star/galaxy name if possible
    const userMessage = messages.find(msg => msg.role === 'user');
    if (userMessage) {
      const content = userMessage.content.toLowerCase();
      // Check if this is about a specific celestial object
      const keywords = ['star', 'galaxy', 'nebula', 'planet'];
      if (keywords.some(keyword => content.includes(keyword))) {
        // Simple approach to extract potential star name - could be enhanced with NLP
        const words = content.split(' ');
        const starCandidates = words.filter(word => 
          word.length > 3 && !['what', 'about', 'tell', 'know', 'where'].includes(word)
        );
        if (starCandidates.length) {
          if (isMongoConnected) {
            conversation.starName = starCandidates[0];
          } else {
            conversation.starName = starCandidates[0];
          }
        }
      }
    }
    
    // Add AI response to conversation
    const assistantMessage = {
      role: 'assistant',
      content: openAiResponse.data.choices[0].message.content,
      timestamp: currentTime
    };
    
    if (isMongoConnected) {
      conversation.messages.push(assistantMessage);
      // Save conversation to database
      await conversation.save();
    } else {
      conversation.messages.push(assistantMessage);
      conversation.updatedAt = currentTime;
    }
    
    // Return OpenAI response along with conversationId
    res.json({
      ...openAiResponse.data,
      conversationId: conversation.conversationId
    });
  } catch (error) {
    console.error('Error with ChatGPT API:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'An error occurred while communicating with the OpenAI API',
      details: error.response?.data || error.message
    });
  }
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { email, address, name, message } = req.body;
    
    // Validate required fields
    if (!email || !address) {
      return res.status(400).json({ error: 'Email and address are required' });
    }
    
    if (isMongoConnected) {
      // Store in MongoDB
      const contactSubmission = new ContactSubmission({
        email,
        address,
        name,
        message,
        submittedAt: new Date()
      });
      
      await contactSubmission.save();
      res.status(201).json({ success: true, message: 'Contact submission saved successfully' });
    } else {
      // Store in memory
      const contactSubmission = {
        id: uuidv4(),
        email,
        address,
        name,
        message,
        submittedAt: new Date(),
        resolved: false
      };
      
      inMemoryContactSubmissions.push(contactSubmission);
      res.status(201).json({ success: true, message: 'Contact submission saved successfully' });
    }
  } catch (error) {
    console.error('Error saving contact submission:', error);
    res.status(500).json({ error: 'Failed to save contact submission' });
  }
});

// Get all contact submissions (for admin purposes)
app.get('/api/contact', async (req, res) => {
  try {
    if (isMongoConnected) {
      const submissions = await ContactSubmission.find().sort({ submittedAt: -1 });
      res.json(submissions);
    } else {
      const submissions = inMemoryContactSubmissions.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
      );
      res.json(submissions);
    }
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 