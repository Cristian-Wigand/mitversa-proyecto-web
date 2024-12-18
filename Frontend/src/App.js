import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar'; // Importa el NavBar
import Home_principal from './components/Home_principal'; // Importa el Home
import SobreNosotros from './components/SobreNosotros'; // Importa el componente SobreNosotros
import FormularioEnvio from './components/FormularioEnvio'; // Importa el formulario de envíos
import Login from './components/Login'; // Importa el componente de Login
import Contactanos from './components/Contactanos'; // Importa el componente Contactanos
import ProfilePage from './components/ProfilePage';
import GestionEnv from './components/GestionEnv';
import UserManagementPage from './components/UserManagementPage';
import GestionVeh from './components/GestionVeh';
import ReportsPage from './components/ReportsPage';
import Register from './components/Register';
import MapWithRoute from './components/MapWithRoute';

import './App.css';
import VisualizarPaquete from './components/VisualizarPaquete';
import EstadoPaquete from './components/EstadoPaquete';
import VisualizarPaqueteCliente from './components/VisualizarPaqueteCliente';
import EstadoPaqueteCliente from './components/EstadoPaqueteCliente';
import MapPage from './components/MapPage'; // Asegúrate de importar MapPage
import TestEnvios from './components/TestEnvios';
import EstadoEnvio from './components/VisualizarEstado';
import VehiculosRepartidor from './components/vehiculosRepartidor';

const App = () => {
  return (
    <Router>
      {/* El NavBar siempre estará visible */}
      <NavBar />

      {/* Contenido principal de la aplicación */}
      <div className="App">
        <Routes>
          {/* Ruta para la página Home */}
          <Route path="/" element={<Home_principal />} />
          {/* Ruta para la página Sobre Nosotros */}
          <Route path="/about" element={<SobreNosotros />} />
          {/* Ruta para la página de Contacto */}
          <Route path="/contact" element={<Contactanos />} />
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/login" element={<Login />} />
          {/* Ruta para el formulario de envíos */}
          <Route path="/envio" element={<FormularioEnvio />} />
          {/* Ruta específica para login y registro */}
          <Route path="/profilepage" element={<ProfilePage />} />
          {/* Otras rutas pueden agregarse aquí si es necesario */}
          <Route path="/GestionEnv" element={<GestionEnv />} />
          <Route path="/GestionUser" element={<UserManagementPage />} />
          <Route path="/GestionVeh" element={<GestionVeh />} />
          <Route path="/ReportsPage" element={<ReportsPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/VisualizarPaquete" element={<VisualizarPaquete />} />
          <Route
            path="/VehiculosRepartidor"
            element={<VehiculosRepartidor />}
          />
          <Route
            path="/VisualizarPaqueteCliente"
            element={<VisualizarPaqueteCliente />}
          />
          <Route path="/EstadoPaquete" element={<EstadoPaquete />} />
          <Route
            path="/EstadoPaqueteCliente"
            element={<EstadoPaqueteCliente />}
          />
          <Route path="/map-route" element={<MapWithRoute />} />
          <Route path="/MostrarEnvios" element={<TestEnvios />} />
          <Route path="/estadoEnvio" element={<EstadoEnvio />} />
          {/* Ruta para ver los envíos */}
          <Route path="/envios" element={<TestEnvios />} />
          {/* Ruta para mostrar el mapa de la ruta de un envío */}
          <Route path="/mapa/:id_envio" element={<MapPage />} />
          <Route path="/ruta/:id_envio" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
