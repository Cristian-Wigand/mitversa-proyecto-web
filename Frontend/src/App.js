import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'; // Importa el NavBar
import Home_principal from './components/Home_principal'; // Importa el Home
import SobreNosotros from './components/SobreNosotros'; // Importa el componente SobreNosotros
import FormularioEnvio from './components/FormularioEnvio'; // Importa el formulario de envíos
import Login from './components/Login'; // Importa el componente de Login
import Contactanos from './components/Contactanos'; // Importa el componente Contactanos
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import GestionEnv from './components/GestionEnv';
import UserManagementPage from './components/UserManagementPage';
import GestionVeh from './components/GestionVeh';
import ReportsPage from './components/ReportsPage';
import Register from './components/Register';

import './Css/App.css'; // Importa los estilos

const App = () => {
  return (
    <Router>
      {/* El NavBar siempre estará visible */}
      <NavBar />

      {/* Contenido principal de la aplicación */}
      <div className="App">
        <Routes>
          {/* Ruta para la página Home */}
          <Route path="/" Component={Home_principal} />
          {/* Ruta para la página Sobre Nosotros */}
          <Route path="/about" Component={SobreNosotros} />
          {/* Ruta para la página de Contacto */}
          <Route path="/contact" Component={Contactanos} />
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" Component={Login} />
          {/* Ruta para el formulario de envíos */}
          <Route path="/envio" Component={FormularioEnvio} />
          <Route path="/auth" element={<AuthPage />} />{' '}
          {/* Ruta específica para login y registro */}
          <Route path="/profilepage" element={<ProfilePage />} />
          {/* Otras rutas pueden agregarse aquí si es necesario */}
          <Route path="/GestionEnv" element={<GestionEnv />} />
          <Route path="/GestionUser" element={<UserManagementPage />} />
          <Route path="/GestionVeh" element={<GestionVeh />} />
          <Route path="/ReportsPage" element={<ReportsPage />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
