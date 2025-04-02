import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="contact-us-page">
      <h1>Contact Us!</h1>
      <div className="contact-info">
        <p>email:</p>
        <input type="text" placeholder="Enter your email..." />
        <p>address:</p>
        <input type="text" placeholder="Enter your address..." />
      </div>
    </div>
  );
};

export default ContactUsPage;