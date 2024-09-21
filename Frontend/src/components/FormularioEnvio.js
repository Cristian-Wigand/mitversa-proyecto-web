import React, { useState } from 'react';
import './FormularioEnvio.css'; // Añadir estilos específicos

// Componente principal del formulario de creación de envíos
const FormularioEnvio = () => {
  // Definimos un estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    ciudad: '', // Ciudad del envío
    comuna: '', // Comuna del envío
    calle: '', // Calle del envío
    numeroCalle: '', // Número de la calle
    repartidorId: '', // ID del repartidor asignado
    clienteId: '', // ID del cliente
    fechaEstimada: '', // Fecha estimada de llegada del envío
  });

  // Función para actualizar el estado cuando el usuario escribe en un input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Actualiza el estado del formulario dinámicamente usando el nombre del campo
  };

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    console.log(formData); // Aquí puedes enviar los datos a una API para guardarlos en la base de datos
  };

  return (
    <div className="form-container">
      <h2>Crear Envío</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo para ingresar la ciudad */}
        <div className="form-group">
          <label>Ingresar ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange} // Cada vez que el usuario escribe, actualiza el estado
          />
        </div>

        {/* Campo para ingresar la comuna */}
        <div className="form-group">
          <label>Ingresar comuna:</label>
          <input
            type="text"
            name="comuna"
            value={formData.comuna}
            onChange={handleChange} // Actualiza el estado cuando cambia el valor
          />
        </div>

        {/* Campo para ingresar la calle */}
        <div className="form-group">
          <label>Ingresar calle:</label>
          <input
            type="text"
            name="calle"
            value={formData.calle}
            onChange={handleChange}
          />
        </div>

        {/* Campo para ingresar el número de calle */}
        <div className="form-group">
          <label>Ingresar número de calle:</label>
          <input
            type="text"
            name="numeroCalle"
            value={formData.numeroCalle}
            onChange={handleChange}
          />
        </div>

        {/* Campo para ingresar el ID del repartidor */}
        <div className="form-group">
          <label>Ingresar id del repartidor:</label>
          <input
            type="text"
            name="repartidorId"
            value={formData.repartidorId}
            onChange={handleChange}
          />
        </div>

        {/* Campo para ingresar el ID del cliente */}
        <div className="form-group">
          <label>Ingresar id del cliente:</label>
          <input
            type="text"
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
          />
        </div>

        {/* Campo para ingresar la fecha estimada de llegada */}
        <div className="form-group">
          <label>Ingresar fecha estimada de llegada:</label>
          <input
            type="date"
            name="fechaEstimada"
            value={formData.fechaEstimada}
            onChange={handleChange}
          />
        </div>

        {/* Botón para enviar el formulario */}
        <button type="submit">Crear Envío</button>
      </form>
    </div>
  );
};

export default FormularioEnvio;
