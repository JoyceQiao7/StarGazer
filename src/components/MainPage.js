import React, { useEffect, useState } from 'react';


const MainPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const NASA_SEARCH_URL = 'https://images-api.nasa.gov/search?q=galaxy&media_type=image';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(NASA_SEARCH_URL);
        const data = await response.json();
        const items = data.collection.items.slice(0, 6); // Limit to 6 images
        const imageLinks = items.map(item => item.links[0].href);
        setImages(imageLinks);
      } catch (error) {
        console.error('Error fetching NASA images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="main-page">
      <div className="hero-section">
        <h1 className="title">StarGazer Gallery!</h1><br />
        <p className="subtitle">Find any type of galaxy in here✨</p>
      </div>

      <div className="gallery-preview">
        <h2>Gallery Preview</h2>
        <div className="preview-box">
          {loading ? (
            <p>Loading galaxy images...</p>
          ) : (
            <div className="preview-grid">
              {images.map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  alt={`Galaxy ${index}`} 
                  className="gallery-img" 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;