import React, { useState } from 'react';
import axios from 'axios';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    name: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3002';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await axios.post(`${apiUrl}/api/contact`, formData);
      setSubmitResult({
        success: true,
        message: 'Thank you for your submission! We will contact you soon.'
      });
      // Clear form after successful submission
      setFormData({
        email: '',
        address: '',
        name: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitResult({
        success: false,
        message: error.response?.data?.error || 'Failed to submit form. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page">
      <h1>Contact Us!</h1>
      <div className="contact-info">
        <form onSubmit={handleSubmit}>
          <p>Name:</p>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name..." 
          />
          
          <p>Email:</p>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email..." 
            required 
          />
          
          <p>Address:</p>
          <input 
            type="text" 
            name="address" 
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address..." 
            required 
          />
          
          <p>Message:</p>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message..."
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              border: 'none'
            }}
          />
          
          <button 
            type="submit" 
            disabled={submitting}
            style={{
              backgroundColor: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              width: '100%',
              marginTop: '10px'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          
          {submitResult && (
            <div 
              style={{
                marginTop: '20px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: submitResult.success ? '#d4edda' : '#f8d7da',
                color: submitResult.success ? '#155724' : '#721c24',
                textAlign: 'center'
              }}
            >
              {submitResult.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;