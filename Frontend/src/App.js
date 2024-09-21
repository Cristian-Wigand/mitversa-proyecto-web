import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'; // Importa el NavBar
import Home from './components/Home'; // Importa el Home
import SobreNosotros from './components/SobreNosotros'; // Importa el componente SobreNosotros
import FormularioEnvio from './components/FormularioEnvio'; // Importa el formulario de envíos
import Login from './components/Login'; // Importa el componente de Login
import Contactanos from './components/Contactanos'; // Importa el componente Contactanos

import './App.css'; // Importa los estilos

const App = () => {
  return (
    <Router>
      {/* El NavBar siempre estará visible */}
      <NavBar />

      {/* Contenido principal de la aplicación */}
      <div className="content">
        <Routes>
          {/* Ruta para la página Home */}
          <Route path="/" Component={Home} />

          {/* Ruta para la página Sobre Nosotros */}
          <Route path="/about" Component={SobreNosotros} />

          {/* Ruta para la página de Contacto */}
          <Route path="/contact" Component={Contactanos} />

          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" Component={Login} />

          {/* Ruta para el formulario de envíos */}
          <Route path="/envio" Component={FormularioEnvio} />

          {/* Otras rutas pueden agregarse aquí si es necesario */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
