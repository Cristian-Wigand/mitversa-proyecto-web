//components/AuthPage.js
import React from 'react';
import Login from './Login';
import Register from './Register';
import NavBar from './NavBar'; // Importa el NavBar
import './auth.css';



const AuthPage = () => {
    return (
      <div>
        <NavBar /> {/* Agrega el NavBar aquí */}
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
