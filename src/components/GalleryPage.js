import React from 'react';

const GalleryPage = () => {
  return (
    <div className="gallery-page">
      <h1>Gallery</h1>
      <div className="search-bar">
        <input type="text" placeholder="galaxy name..." />
        <input type="text" placeholder="galaxy type..." />
        <input type="text" placeholder="year published..." />
        <input type="text" placeholder="distance from Earth..." />
      </div>
      <div className="gallery-grid">
        {/* Placeholder for gallery items */}
        {[...Array(9)].map((_, index) => (
          <div key={index} className="gallery-item">
            Galaxy {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;