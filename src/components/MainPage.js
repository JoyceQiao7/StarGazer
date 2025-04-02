import React from 'react';

const MainPage = () => {
  return (
    <div className="main-page">
      <div className="hero-section">
        <h1 className="title">StarGazer Gallery!</h1>
        <p className="subtitle">Find any type of galaxy in this gallery</p>
      </div>
      <div className="gallery-preview">
        <h2>Gallery Preview</h2>
        <div className="preview-box">
          {/* Placeholder for gallery preview content */}
          <p>Preview of galaxies will be displayed here...</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;