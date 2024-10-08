import React, { useState, useEffect } from 'react';
import { throttle } from 'lodash';
import '../Css/UserManagementPage.css';
import '../Css/App.css';

const GestionEnv = () => {
  const [createDireccion, setCreateDireccion] = useState({
    ciudad: '',
    comuna: '',
    calle: '',
    numero: '',
  });

  const [createEnvio, setCreateEnvio] = useState({
    idEnvio: '',
    estadoEnvio: '',
    idRepartidor: '',
    idCliente: '',
    fechaFin: '',
    fechaInicio: '',
    idDireccionOrigen: '',
    idDireccionDestino: '',
  });

  const [createPackage, setCreatePackage] = useState({
    idEnvio: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: '',
    descripcion: '',
  });

  // Estado para controlar la posición del menú
  const [menuTop, setMenuTop] = useState(150); // Posición inicial

  // Función que maneja el scroll para ajustar la posición del menú
  const handleScroll = throttle(() => {
    const scrollY = window.scrollY; // Obtenemos la cantidad de scroll en Y
    if (scrollY <= 150) {
      setMenuTop(150); // Si se scrollea más de 150px, fija el menú arriba
    } else {
      setMenuTop(scrollY); // Ajusta el menú en función del scroll
    }
  }, 100); // Ejecuta la función cada 100ms como máximo

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // Escuchamos el scroll
    return () => window.removeEventListener('scroll', handleScroll); // Limpiamos el listener
  }, []);

  const handleCreateDireccion = (e) => {
    setCreateDireccion({ ...createDireccion, [e.target.name]: e.target.value });
  };

  const handleCreateEnvio = (e) => {
    setCreateEnvio({ ...createEnvio, [e.target.name]: e.target.value });
  };

  const handleCreatePackage = (e) => {
    setCreatePackage({ ...createPackage, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateDireccion = (e) => {
    e.preventDefault();
    console.log('Create Direccion :', createDireccion);
  };

  const handleSubmitCreateEnvio = (e) => {
    e.preventDefault();
    console.log('Create Envio: ', createEnvio);
  };

  const handleSubmitCreatePackage = (e) => {
    e.preventDefault();
    console.log('Create Package:', createPackage);
  };

  return (
    <div>
      <div className="menu-nav" style={{ top: `${menuTop}px` }}>
        <ul>
          <li>
            <a href="#direccion">Dirección</a>
          </li>
          <li>
            <a href="#envio">Envío</a>
          </li>
          <li>
            <a href="#paquete">Paquete</a>
          </li>
        </ul>
      </div>

      <div className="user-management-page">
        <h1>Gestionar Envio</h1>

        <form
          className="form"
          onSubmit={handleSubmitCreateDireccion}
          id="direccion"
        >
          <h2>Crear Direccion</h2>
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={createDireccion.ciudad}
            onChange={handleCreateDireccion}
          />
          <input
            type="text"
            name="comuna"
            placeholder="Comuna"
            value={createDireccion.comuna}
            onChange={handleCreateDireccion}
          />
          <input
            type="text"
            name="calle"
            placeholder="Calle"
            value={createDireccion.calle}
            onChange={handleCreateDireccion}
          />
          <input
            type="number"
            name="numero"
            placeholder="numero"
            value={createDireccion.numero}
            onChange={handleCreateDireccion}
            min="1"
            step="1"
          />
          <button type="submit">Crear Direccion</button>
        </form>

        <form className="form" onSubmit={handleSubmitCreateEnvio} id="envio">
          <h2>Create Envio</h2>
          <input
            type="number"
            name="idEnvio"
            placeholder="id Envio"
            value={createEnvio.idEnvio}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
          />
          <input
            type="text"
            name="estadoEnvio"
            placeholder="Estado Envio"
            value={createEnvio.estadoEnvio}
            onChange={handleCreateEnvio}
          />
          <input
            type="number"
            name="idRepartidor"
            placeholder="Id Repartidor"
            value={createEnvio.idRepartidor}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="idCliente"
            placeholder="Id Cliente"
            value={createEnvio.idCliente}
            onChange={handleCreateEnvio}
            min="1"
            step="1"
          />
          <input
            type="datetime-local"
            name="fechaFin"
            placeholder="Fecha Fin"
            value={createEnvio.fechaFin}
            onChange={handleCreateEnvio}
          />
          <button type="submit">Crear Envio</button>
        </form>

        <form
          className="form"
          onSubmit={handleSubmitCreatePackage}
          id="paquete"
        >
          <h2>Crear Packete</h2>
          <input
            type="number"
            name="peso"
            placeholder="Peso"
            value={createPackage.peso}
            onChange={handleCreatePackage}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="largo"
            placeholder="Largo"
            value={createPackage.largo}
            onChange={handleCreatePackage}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="ancho"
            placeholder="Ancho"
            value={createPackage.ancho}
            onChange={handleCreatePackage}
            min="1"
            step="1"
          />
          <input
            type="number"
            name="alto"
            placeholder="Alto"
            value={createPackage.alto}
            onChange={handleCreatePackage}
            min="1"
            step="1"
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripcion"
            value={createPackage.descripcion}
            onChange={handleCreatePackage}
          />
          <button type="submit">Crear paquete</button>
        </form>
      </div>
    </div>
  );
};

export default GestionEnv;
