import React from 'react';
import '../Css/ReportsPage.css';

const ReportsPage = () => {
  return (
    <div className="reports-page">
      <h1>Panel de Informes</h1>

      {/* Recuadro de estadísticas */}
      <div className="statistics-box">
        <h2>Estadísticas</h2>
        <div className="statistics-content">
          <p>Total de Usuarios: 200</p>
          <p>Envíos Completados: 150</p>
          <p>Vehículos Disponibles: 10</p>
        </div>
      </div>

      {/* Recuadro de gráficos */}
      <div className="charts-box">
        <h2>Gráficos</h2>
        <div className="charts-content">
          {/* Aquí puedes insertar tus gráficos */}
          <p>Gráfico 1: ...</p>
          <p>Gráfico 2: ...</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
