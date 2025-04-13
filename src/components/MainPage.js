import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import axios from 'axios';

const MainPage = () => {
  const [featuredStars, setFeaturedStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openChatWithQuestion } = useChatContext();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stars from our database first
        const response = await axios.get(`${apiUrl}/api/stars?limit=3`);
        if (response.data && response.data.length) {
          setFeaturedStars(response.data);
        } else {
          // Fallback to NASA API if our DB is empty
          const nasaResponse = await fetch('https://images-api.nasa.gov/search?q=galaxy&media_type=image');
          const data = await nasaResponse.json();
          const items = data.collection.items.slice(0, 3);
          const starData = items.map(item => ({
            name: item.data?.[0]?.title || 'Unnamed Galaxy',
            type: 'galaxy',
            description: item.data?.[0]?.description || 'No description available',
            imageUrl: item.links?.[0]?.href,
          }));
          setFeaturedStars(starData);
        }
      } catch (error) {
        console.error('Error fetching featured stars:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleLearnMore = (name, type) => {
    const question = `Tell me more about the ${type} called ${name}`;
    openChatWithQuestion(question);
  };

  return (
    <div className="main-page">
      <div 
        className="hero-section"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#1a1a2e',
          color: 'white',
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 
          className="title"
          style={{
            fontSize: '3.5rem',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}
        >
          StarGazer Gallery!
        </h1>
        <p 
          className="subtitle"
          style={{
            fontSize: '1.5rem',
            marginBottom: '30px',
            opacity: '0.9'
          }}
        >
          Explore the mysteries of the cosmos ✨
        </p>
        <button
          onClick={() => openChatWithQuestion("Tell me about the most interesting celestial objects in our universe")}
          style={{
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔭</span> Ask Our AI Guide
        </button>
      </div>

      <div 
        className="featured-stars"
        style={{
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <h2 
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '2rem',
            color: '#333'
          }}
        >
          Featured Celestial Objects
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#333' }}>Loading featured celestial objects...</p>
        ) : (
          <div 
            className="featured-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}
          >
            {featuredStars.map((star, index) => (
              <div 
                key={index}
                className="star-card"
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white'
                }}
              >
                <img 
                  src={star.imageUrl} 
                  alt={star.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div 
                  style={{
                    padding: '20px'
                  }}
                >
                  <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#333' }}>{star.name}</h3>
                  <p 
                    style={{
                      color: '#0066ff',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      marginBottom: '10px'
                    }}
                  >
                    {star.type}
                  </p>
                  {star.basicFacts && (
                    <div 
                      className="basic-facts"
                      style={{
                        marginBottom: '15px',
                        fontSize: '0.9rem'
                      }}
                    >
                      {star.basicFacts.distance && (
                        <p style={{ margin: '5px 0', color: '#333' }}>
                          <strong>Distance:</strong> {star.basicFacts.distance}
                        </p>
                      )}
                      {star.basicFacts.constellation && (
                        <p style={{ margin: '5px 0', color: '#333' }}>
                          <strong>Constellation:</strong> {star.basicFacts.constellation}
                        </p>
                      )}
                    </div>
                  )}
                  <p 
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '20px',
                      color: '#444'
                    }}
                  >
                    {star.description.length > 120 
                      ? `${star.description.substring(0, 120)}...` 
                      : star.description}
                  </p>
                  <button
                    onClick={() => handleLearnMore(star.name, star.type)}
                    style={{
                      backgroundColor: '#0066ff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <span>✨</span> Learn More with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;