import React, { useEffect, useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import axios from 'axios';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { openChatWithQuestion } = useChatContext();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const NASA_SEARCH_URL = 'https://images-api.nasa.gov/search?q=galaxy&media_type=image';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(NASA_SEARCH_URL);
        const data = await response.json();
        const items = data.collection.items;
        const imageData = items.map(item => ({
          imageUrl: item.links?.[0]?.href,
          title: item.data?.[0]?.title || 'No Title',
          description: item.data?.[0]?.description || 'No Description',
        }));
        setImages(imageData);
        
        // Also fetch any stars we have in our database and combine them
        try {
          const dbResponse = await axios.get(`${apiUrl}/api/stars`);
          if (dbResponse.data && dbResponse.data.length) {
            const dbStars = dbResponse.data.map(star => ({
              imageUrl: star.imageUrl,
              title: star.name,
              description: star.description,
              fromDatabase: true,
              distanceInfo: star.basicFacts?.distance,
              constellation: star.basicFacts?.constellation,
              type: star.type
            }));
            setImages(prev => [...prev, ...dbStars]);
          }
        } catch (error) {
          console.error('Error fetching stars from database:', error);
        }
      } catch (error) {
        console.error('Error fetching NASA images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [apiUrl]);

  // Filter based on search input
  const filteredImages = images.filter(img =>
    img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLearnMore = (title, type) => {
    let question;
    
    if (type) {
      // For items from our database, we have more info
      question = `Tell me more about the ${type} called ${title}`;
    } else {
      // For NASA API items
      question = `Tell me more about ${title}`;
    }
    
    openChatWithQuestion(question);
  };

  return (
    <div className="gallery-page">
      <h1 style={{ color: '#333' }}>Gallery</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search galaxy keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginBottom: '1rem' }}
        />
      </div>

      {loading ? (
        <p style={{ color: '#333' }}>Loading galaxy images...</p>
      ) : (
        <div 
          className="gallery-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px', 
            padding: '20px' 
          }}
        >
          {filteredImages.map((img, index) => (
            <div 
              key={index} 
              className="image-card"
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '10px', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="gallery-img"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <h3 className="image-title" style={{ color: '#333' }}>{img.title}</h3>
                {img.fromDatabase && (
                  <div className="additional-info" style={{ marginBottom: '10px' }}>
                    <p style={{ margin: '5px 0', color: '#333' }}><strong>Type:</strong> {img.type}</p>
                    {img.distanceInfo && (
                      <p style={{ margin: '5px 0', color: '#333' }}><strong>Distance:</strong> {img.distanceInfo}</p>
                    )}
                    {img.constellation && (
                      <p style={{ margin: '5px 0', color: '#333' }}><strong>Constellation:</strong> {img.constellation}</p>
                    )}
                  </div>
                )}
                <p className="image-desc" style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#444' }}>
                  {img.description.length > 150 
                    ? `${img.description.substring(0, 150)}...` 
                    : img.description}
                </p>
                <button
                  onClick={() => handleLearnMore(img.title, img.type)}
                  style={{
                    marginTop: '15px',
                    padding: '8px 15px',
                    backgroundColor: '#0066ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.9rem'
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
  );
};

export default GalleryPage;