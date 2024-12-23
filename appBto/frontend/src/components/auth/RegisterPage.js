import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/LoginPage.css'; // We can reuse the login styles

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('GUIDE'); // Default role
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        role
      });

      login(response.data.user, response.data.token);
      
      // Redirect based on role
      switch (response.data.user.role) {
        case 'DIRECTOR':
        case 'ADMINISTRATOR':
          navigate('/admin');
          break;
        case 'GUIDE':
          navigate('/guide');
          break;
        case 'COORDINATOR':
          navigate('/coordinator');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="GUIDE">Guide</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="DIRECTOR">Director</option>
              <option value="ADVISOR">Advisor</option>
            </select>
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 