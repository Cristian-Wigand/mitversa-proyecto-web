import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../App.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'; // Agrega las importaciones necesarias
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
  const [envioDatos, setEnvioDatos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch estados de envío y estadísticas en una sola llamada
        const [enviosResponse, vehiculosResponse] = await Promise.all([
          fetch('https://mitversa.christianferrer.me/api/estados-envio/'),
          fetch('https://mitversa.christianferrer.me/api/vehiculos/'),
        ]);

        if (!enviosResponse.ok || !vehiculosResponse.ok) {
          throw new Error('Error al obtener los datos');
        }

        const enviosData = await enviosResponse.json();
        const vehiculosData = await vehiculosResponse.json();

        setEnvioDatos(enviosData);

        // Procesa estadísticas
        const estadoCounts = enviosData.reduce((acc, envio) => {
          acc[envio.nombre] = (acc[envio.nombre] || 0) + 1;
          return acc;
        }, {});

        setEstadisticas({
          entregados: estadoCounts['entregado'] || 0,
          pendientes: estadoCounts['pendiente'] || 0,
          en_transito: estadoCounts['en_transito'] || 0,
          cancelados: estadoCounts['cancelado'] || 0,
        });

        // Contamos cuántos vehículos están disponibles
        const disponibles = vehiculosData.filter(
          (vehiculo) => vehiculo.estado === 'disponible',
        ).length;
        setVehiculosDisponibles(disponibles);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, []);

  // Procesa los datos para los gráficos
  const envioEstados = envioDatos.reduce((acc, envio) => {
    const estado = envio.nombre;
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  // Convierte el objeto en un array para los gráficos
  const estados = Object.keys(envioEstados);
  const cantidades = Object.values(envioEstados);

  // Datos para el gráfico de barras
  const barData = {
    labels: estados,
    datasets: [
      {
        label: 'Cantidad de envíos por estado',
        data: cantidades,
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        borderColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico circular
  const pieData = {
    labels: estados,
    datasets: [
      {
        label: 'Porcentaje de entregas',
        data: cantidades,
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
          <p>Envíos Completados: {estadisticas.entregados || 0}</p>
          <p>Vehículos Disponibles: {vehiculosDisponibles}</p>
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
