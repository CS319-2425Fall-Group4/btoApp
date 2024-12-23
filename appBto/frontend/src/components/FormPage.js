import React, { useState } from 'react';
import api from '../services/api';
import '../styles/FormPage.css'; // Import the CSS file for sliding placeholders
import Calendar from "./Calendar";

const FormPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    preferred_dates: [],
    institution_id: ''
  });

  const [message, setMessage] = useState(''); // To handle success or error messages
  const [errors, setErrors] = useState({}); // To store validation errors

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address (e.g., user@example.com).';
    }

    if (!formData.phone_number) {
      newErrors.phone_number = 'Please enter your phone number.';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be in international format (e.g., +123456789).';
    }

    if (!formData.preferred_dates) {
      newErrors.preferred_dates = 'Please specify your preferred dates for the tour.';
    } else if (!/^(\d{4}-\d{2}-\d{2},?\s*)+$/.test(formData.preferred_dates)) {
      newErrors.preferred_dates = 'Dates must be in the format YYYY-MM-DD, separated by commas.';
    }

    if (!formData.institution_id) {
      newErrors.institution_id = 'Please provide the institution ID associated with the tour.';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // Clear errors if validation passes

    try {
      await api.post('/tour-applications', {
        ...formData,
        preferred_dates: formData.preferred_dates.split(',').map((date) => date.trim()),
      });
      setMessage('Your tour application has been submitted successfully!');
      setFormData({
        email: '',
        phone_number: '',
        preferred_dates: '',
        institution_id: '',
      }); // Reset form
    } catch (error) {
      setMessage('An error occurred while submitting the application. Please try again later.');
    }
  };


  return (
    <div className="form-container">
      <h2>Tour Application Form</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com' },
          { name: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+123456789' },
          { name: 'preferred_dates', label: 'Preferred Dates', type: 'text', placeholder: '2024-02-01, 2024-02-02' },
          { name: 'institution_id', label: 'Institution ID', type: 'text', placeholder: '123' },
        ].map(({ name, label, type, placeholder }) => (
          <div className="form-group" key={name}>
            <input
              id={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`form-input ${errors[name] ? 'error-input' : ''}`}
            />
            <label
              htmlFor={name}
              className={`form-label ${formData[name] ? 'focused' : ''}`}
            >
              {label}
            </label>
            {errors[name] && <p className="error-message">{errors[name]}</p>}
          </div>
        ))}
        <button type="submit" className="form-submit-button">Submit</button>
      </form>
    </div>
  );
};

export default FormPage;
