import React, { useState } from 'react';
import api from '../services/api';

const FormPage = () => {
  const [formData, setState] = useState({
    email: '',
    phone_number: '',
    preferred_dates: [],
    institution_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tour-applications', formData);
      // Handle successful submission
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setState({...formData, email: e.target.value})}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormPage;
