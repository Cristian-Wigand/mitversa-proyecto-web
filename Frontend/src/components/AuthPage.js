//components/AuthPage.js
import React from 'react';
import Login from './Login';
import Register from './Register';
import '../Css/auth.css';

const AuthPage = () => {
  return (
    <div>
      <div className="auth-container">
        <div className="auth-form login-form">
          <Login />
        </div>
        <div className="auth-form">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
