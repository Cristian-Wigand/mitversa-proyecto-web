import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import NavBar from './components/NavBar';


function App() {
  return (
    <Router>
      <div>
        <NavBar /> {/* Muestra el NavBar en todas las páginas */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} /> {/* Ruta específica para login y registro */}
          <Route path="/profilepage" element={<ProfilePage />} />
          {/* Ruta raíz temporalmente vacía */}
          <Route path="/" element={<div>Bienvenido a la página principal (aquí irá el Home)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
