import React, { useEffect, useState } from 'react';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const NASA_SEARCH_URL = 'https://images-api.nasa.gov/search?q=galaxy&media_type=image';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(NASA_SEARCH_URL);
        const data = await response.json();
        const items = data.collection.items; 
        const imageData = items.map(item => ({
            imageUrl: item.links[0].href,
            title: item.data[0].title || 'No Title',
            description: item.data[0].description || 'No Description'
          })
        );
        setImages(imageData);
      } catch (error) {
        console.error('Error fetching NASA images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="gallery-page">
      <h1>Gallery</h1>
      <div className="search-bar">
        <input type="text" placeholder="galaxy name..." />
        <input type="text" placeholder="galaxy type..." />
        <input type="text" placeholder="distance from Earth..." />
      </div>
      {loading ? (
        <p>Loading galaxy images...</p>
        ) : (
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div key={index} className="image-card">
              <img 
                src={img.imageUrl} 
                alt={img.title} 
                className="gallery-img" 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <h3 className="image-title">{img.title}</h3>
              <p className="image-desc">{img.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;