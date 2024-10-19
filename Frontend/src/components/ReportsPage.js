import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'; // Agrega las importaciones necesarias
import '../Css/ReportsPage.css';
import '../App.css';

// Registra los elementos
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const ReportsPage = () => {
  // Datos de la tabla
  const envioEstados = [
    { estado: 'Entregado', cantidad: 100 },
    { estado: 'No entregado', cantidad: 20 },
    { estado: 'En tránsito', cantidad: 25 },
    { estado: 'Devuelto', cantidad: 5 },
  ];

  // Datos para el gráfico de barras
  const barData = {
    labels: envioEstados.map((envio) => envio.estado),
    datasets: [
      {
        label: 'Cantidad de envíos por estado',
        data: envioEstados.map((envio) => envio.cantidad),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        borderColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico circular
  const pieData = {
    labels: envioEstados.map((envio) => envio.estado),
    datasets: [
      {
        label: 'Porcentaje de entregas',
        data: envioEstados.map((envio) => envio.cantidad),
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

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

      {/* Gráfico de barras de estados de envío */}
      <div className="charts-box">
        <h2>Estados de Envío</h2>
        <div className="chart">
          <Bar data={barData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Gráfico de porcentaje de entregas */}
      <div className="charts-box">
        <h2>Porcentaje de Entregas por Estado</h2>
        <div className="chart">
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
