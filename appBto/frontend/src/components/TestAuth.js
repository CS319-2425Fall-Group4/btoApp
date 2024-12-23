import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestAuth = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Authentication Test Page</h2>
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};

export default TestAuth; 