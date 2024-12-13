import React, { useEffect, useState } from 'react';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import '../Css/ReportsPage.css';
import Conexiones from './conexiones';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement, // Asegúrate de importar PointElement
} from 'chart.js';
const conexiones = Conexiones(); // Agrega las importaciones necesarias

// Registra los elementos
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement, // Registra PointElement
);

const ReportsPage = () => {
  const [envioDatos, setEnvioDatos] = useState([]);
  const [historialAsignacion, setHistorialAsignacion] = useState([]);
  const [vehiculosDatos, setVehiculosDatos] = useState([]);
  const [usuariosDatos, setUsuariosDatos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0);
  const [selectedTable, setSelectedTable] = useState('Envios'); // Estado para la tabla seleccionada
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Estado para el tipo de gráfico
  const [selectedSalesPeriod, setSelectedSalesPeriod] = useState('semanales'); // Estado para las ventas (semanales o mensuales)
  const [selectedSalesPeriod2, setSelectedSalesPeriod2] = useState('tipo'); // Estado para las ventas (semanales o mensuales)
  const [selectedSalesPeriod3, setSelectedSalesPeriod3] =
    useState('disponibilidad'); // Estado para las ventas (semanales o mensuales)

  const total = {
    Envios: envioDatos.length,
    Usuarios: usuariosDatos.length,
    Vehiculos: vehiculosDatos.length,
  };
  console.log('total', total);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch estados de envío y

        const enviosRespuesta = await conexiones.traer_todo('Envio');
        const usuarioRespuesta = await conexiones.traer_todo('Usuario');
        const vehiculoRespuesta = await conexiones.traer_todo('Vehiculo');
        const historialAsignacion = await conexiones.traer_todo('Asignacion');

        if (!enviosRespuesta[0]) {
          return alert('Error en enviosRespuesta');
        }
        if (!usuarioRespuesta[0]) {
          return alert('Error en usuarioRespuesta');
        }
        if (!vehiculoRespuesta[0]) {
          return alert('Error en vehiculoRespuesta');
        }
        if (!historialAsignacion[0]) {
          return alert('Error en historialAsignacion');
        }

        setEnvioDatos(enviosRespuesta[1]);
        setUsuariosDatos(usuarioRespuesta[1]);
        setVehiculosDatos(vehiculoRespuesta[1]);
        setHistorialAsignacion(historialAsignacion[1]);

        // Procesa estadísticas para envíos
        const estadoCounts = enviosRespuesta[1].reduce((acc, envio) => {
          acc[envio.id_estado_envio] = (acc[envio.id_estado_envio] || 0) + 1;
          return acc;
        }, {});
        setEstadisticas({
          pendientes: estadoCounts[1] || 0,
          en_transito: estadoCounts[2] || 0,
          entregados: estadoCounts[3] || 0,
          cancelados: estadoCounts[4] || 0,
        });

        // Contamos cuántos vehículos están disponibles
        const disponibles = vehiculoRespuesta[1].filter(
          (vehiculo) => vehiculo.estado === 'disponible',
        ).length;
        setVehiculosDisponibles(disponibles);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchData();
  }, []);

  const vehiculoEstados = vehiculosDatos.reduce((acc, vehiculo) => {
    const estado = vehiculo.estado;
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const grafica_barra = (keys, valores, nombre) => {
    const barData = {
      labels: keys,
      datasets: [
        {
          label: `${nombre}`,
          data: valores,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          borderColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    };
    return barData;
  };

  const grafica_circular = (keys, valores, nombre) => {
    const circularData = {
      labels: keys,
      datasets: [
        {
          label: `${nombre}`,
          data: valores,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        },
      ],
    };
    return circularData;
  };

  const grafica_puntos = (keys, valores, nombre) => {
    // Combinar las claves y valores en un array de objetos con coordenadas x, y
    const puntos = keys.map((key, index) => ({ x: key, y: valores[index] }));

    const scatterData = {
      datasets: [
        {
          label: `${nombre}`,
          data: puntos, // Array de objetos con coordenadas {x, y}
          backgroundColor: '#36A2EB', // Color de los puntos
          borderColor: '#36A2EB', // Color del borde de los puntos
          borderWidth: 1, // Ancho del borde
          pointRadius: 5, // Radio de los puntos
        },
      ],
    };

    return scatterData;
  };

  //Graficos de Estadistica envios por estado
  // Convierte el objeto en un array para los gráficos
  const estadosEnvios = Object.keys(estadisticas);
  const cantidadesEnvios = Object.values(estadisticas);

  const barDataEnvios = grafica_barra(
    estadosEnvios,
    cantidadesEnvios,
    'Cantidad de envíos por estado',
  );
  const pieDataEnvios = grafica_circular(
    estadosEnvios,
    cantidadesEnvios,
    'Porcentaje de entregas',
  );
  const estadosEnviosNum = estadosEnvios.map((_, index) => index + 1);
  const scatterDataEnvios = grafica_puntos(
    estadosEnviosNum,
    cantidadesEnvios,
    'Cantidad de envíos por estado',
  );

  //Graficos Ganancias semanales
  const unaSemanaAtras = new Date(); // Obtén la fecha actual
  unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7); // Resta 7 días

  const enviosUltimaSemana = envioDatos.filter((envio) => {
    const fechaPedido = new Date(envio.fecha_pedido_inicio); // Convierte a objeto Date
    return fechaPedido >= unaSemanaAtras; // Compara las fechas
  });

  const diasDeLaSemana = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  // Generar el orden de los días a partir de `unaSemanaAtras`
  const diasOrdenados = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(unaSemanaAtras);
    fecha.setDate(fecha.getDate() + i);
    return diasDeLaSemana[fecha.getDay()];
  });

  // Inicializar costos con 0 para cada día en el orden generado
  const costosPorDiaDeLaSemana = diasOrdenados.reduce((acc, dia) => {
    acc[dia] = 0;
    return acc;
  }, {});

  // Agrupar envíos y sumar costos
  enviosUltimaSemana.forEach((envio) => {
    const fecha = new Date(envio.fecha_pedido_inicio);
    const diaSemana = diasDeLaSemana[fecha.getDay()]; // Obtener el nombre del día
    costosPorDiaDeLaSemana[diaSemana] += envio.costo_total; // Sumar el costo al día correspondiente
  });

  // Convertir el objeto en un arreglo respetando el orden
  const agrupadosPorDiaDeLaSemana = diasOrdenados.map((dia) => ({
    [dia]: costosPorDiaDeLaSemana[dia],
  }));

  // Obtener solo los valores (costos totales) de cada objeto en el arreglo
  const costoSemanalValor = agrupadosPorDiaDeLaSemana.map(
    (item) => Object.values(item)[0],
  );

  // Obtener solo las claves (días) de cada objeto en el arreglo
  const costoSemanalKey = agrupadosPorDiaDeLaSemana.map(
    (item) => Object.keys(item)[0],
  );

  const barDataCostoSemanal = grafica_barra(
    costoSemanalKey,
    costoSemanalValor,
    'Ganancia semanal',
  );
  const pieDataCostoSemanal = grafica_circular(
    costoSemanalKey,
    costoSemanalValor,
    'Porcentaje de Ganancia semanal',
  );
  const DataCostoSemanalNum = costoSemanalKey.map((_, index) => index + 1);
  const scatterDataCostoSemanal = grafica_puntos(
    DataCostoSemanalNum,
    costoSemanalValor,
    'Ganancia semanal',
  );

  //Grafica de ganancia semanal
  const unMesAtras = new Date(); // Obtén la fecha actual
  unMesAtras.setMonth(unMesAtras.getMonth() - 1); // Resta un mes

  // Establece la fecha de inicio del mes
  const inicioMes = new Date(
    unMesAtras.getFullYear(),
    unMesAtras.getMonth(),
    1,
  );
  const finMes = new Date(
    unMesAtras.getFullYear(),
    unMesAtras.getMonth() + 1,
    0,
  ); // Último día del mes

  const enviosUltimoMes = envioDatos.filter((envio) => {
    const fechaPedido = new Date(envio.fecha_pedido_inicio); // Convierte a objeto Date
    return fechaPedido >= inicioMes && fechaPedido <= finMes; // Compara las fechas
  });

  // Inicializar costos con 0 para cada semana
  const costosPorSemana = [0, 0, 0, 0]; // Representa 4 semanas en el mes

  // Agrupar envíos y sumar costos en las semanas correspondientes
  enviosUltimoMes.forEach((envio) => {
    const fecha = new Date(envio.fecha_pedido_inicio);
    const diaDelMes = fecha.getDate(); // Obtén el día del mes

    // Determina en qué semana cae el día
    const semana = Math.floor((diaDelMes - 1) / 7); // Dividir el mes en 4 semanas
    costosPorSemana[semana] += envio.costo_total; // Sumar el costo a la semana correspondiente
  });

  // Crear un objeto para cada semana con el formato "Semana X: costo_total"
  const agrupadosPorSemana = costosPorSemana.map((costoTotal, index) => ({
    [`Semana ${index + 1}`]: costoTotal,
  }));

  // Obtener solo los valores (costos totales) de cada objeto en el arreglo
  const costoSemanalValor2 = agrupadosPorSemana.map(
    (item) => Object.values(item)[0],
  );

  // Obtener solo las claves (semanas) de cada objeto en el arreglo
  const costoSemanalKey2 = agrupadosPorSemana.map(
    (item) => Object.keys(item)[0],
  );

  const barDataCostoMensual = grafica_barra(
    costoSemanalKey2,
    costoSemanalValor2,
    'Ganancia Mensual',
  );
  const pieDataCostoMensual = grafica_circular(
    costoSemanalKey2,
    costoSemanalValor2,
    'Porcentaje de Ganancia Mensual',
  );
  const DataCostoMensualNum = costoSemanalKey2.map((_, index) => index + 1);
  const scatterDataCostoMensual = grafica_puntos(
    DataCostoMensualNum,
    costoSemanalValor2,
    'Ganancia Mensual',
  );

  const unAnoAtras = new Date(); // Obtén la fecha actual
  unAnoAtras.setFullYear(unAnoAtras.getFullYear() - 1); // Resta un año

  // Establecer el primer día del mes desde el cual quieres obtener los datos (un año atrás)
  const inicioAno = new Date(
    unAnoAtras.getFullYear(),
    unAnoAtras.getMonth(),
    1,
  ); // Primer día del mes de hace un año
  const finAno = new Date(unAnoAtras.getFullYear(), unAnoAtras.getMonth(), 0); // Último día del mes de hace un año

  // Filtrar los envíos del último año según las fechas
  const enviosUltimoAno = envioDatos.filter((envio) => {
    const fechaPedido = new Date(envio.fecha_pedido_inicio); // Convierte a objeto Date
    return fechaPedido >= inicioAno; // Compara las fechas
  });

  // Inicializar costos con 0 para cada mes (12 meses)
  const costosPorMes = Array(12).fill(0); // Representa 12 meses en el año

  // Agrupar envíos y sumar costos en los meses correspondientes
  enviosUltimoAno.forEach((envio) => {
    const fecha = new Date(envio.fecha_pedido_inicio);
    const mes = fecha.getMonth(); // Obtiene el mes (0-11)
    costosPorMes[mes] += envio.costo_total; // Sumar el costo al mes correspondiente
  });

  // Nombres de los meses
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  // Crear un objeto para cada mes con el formato "enero: costo_total"
  const agrupadosPorMes = costosPorMes.map((costoTotal, index) => ({
    [meses[index]]: costoTotal,
  }));

  // Ordenar los meses de acuerdo al mes desde el cual se está solicitando la información
  const mesesOrdenados = [];
  for (let i = 0; i < 12; i++) {
    const mesIndex = (unAnoAtras.getMonth() + 1 + i) % 12; // Esto asegura que empiece en el mes que corresponde
    mesesOrdenados.push({
      mes: meses[mesIndex],
      costo: costosPorMes[mesIndex],
    });
  }

  // Obtener los valores de los costos de cada mes
  const costoAnualValor = mesesOrdenados.map((item) => item.costo);

  // Obtener los nombres de los meses en orden
  const costoAnualKey = mesesOrdenados.map((item) => item.mes);

  const barDataCostoAnual = grafica_barra(
    costoAnualKey,
    costoAnualValor,
    'Ganancia Anual',
  );
  const pieDataCostoAnual = grafica_circular(
    costoAnualKey,
    costoAnualValor,
    'Porcentaje de Ganancia Anual',
  );
  const DataCostoAnualNum = costoAnualKey.map((_, index) => index + 1);
  const scatterDataCostoAnual = grafica_puntos(
    DataCostoAnualNum,
    costoAnualValor,
    'Ganancia Anual',
  );

  //Estadistica por tipo de usuario
  // Usamos reduce para agrupar por tipo de usuario y contar la cantidad
  const cantidadPorTipoUsuario = usuariosDatos.reduce((acc, usuario) => {
    const tipo = usuario.tipo_usuario; // Obtenemos el tipo de usuario
    if (acc[tipo]) {
      acc[tipo] += 1; // Si ya existe, sumamos 1
    } else {
      acc[tipo] = 1; // Si no existe, iniciamos el contador en 1
    }
    return acc;
  }, {});

  // Convierte el objeto en un array para los gráficos
  const tipoUsuarioKey = Object.keys(cantidadPorTipoUsuario);
  const tipoUsuarioValor = Object.values(cantidadPorTipoUsuario);

  const barDataTipoUsuario = grafica_barra(
    tipoUsuarioKey,
    tipoUsuarioValor,
    'Cantidad de envíos por estado',
  );
  const pieDataTipoUsuario = grafica_circular(
    tipoUsuarioKey,
    tipoUsuarioValor,
    'Porcentaje de entregas',
  );
  const TipoUsuarioNum = tipoUsuarioKey.map((_, index) => index + 1);
  const scatterDataTipoUsuario = grafica_puntos(
    TipoUsuarioNum,
    tipoUsuarioValor,
    'Cantidad de envíos por estado',
  );

  //Estadistica por disponibilidad de autos

  // Usamos reduce para agrupar por estado de vehículo y contar la cantidad
  const cantidadPorEstadoVehiculo = vehiculosDatos.reduce((acc, vehiculo) => {
    const estado = vehiculo.estado; // Obtenemos el estado del vehículo
    if (acc[estado]) {
      acc[estado] += 1; // Si ya existe, sumamos 1
    } else {
      acc[estado] = 1; // Si no existe, iniciamos el contador en 1
    }
    return acc;
  }, {});

  // Convierte el objeto en un array para los gráficos
  const estadoVehiculoKey = Object.keys(cantidadPorEstadoVehiculo);
  const estadoVehiculoValor = Object.values(cantidadPorEstadoVehiculo);

  const barDataEstadoVehiculo = grafica_barra(
    estadoVehiculoKey,
    estadoVehiculoValor,
    'Cantidad de envíos por estado',
  );
  const pieDataEstadoVehiculo = grafica_circular(
    estadoVehiculoKey,
    estadoVehiculoValor,
    'Porcentaje de entregas',
  );
  const estadoVehiculoNum = estadoVehiculoKey.map((_, index) => index + 1);
  const scatterDataEstadoVehiculo = grafica_puntos(
    estadoVehiculoNum,
    estadoVehiculoValor,
    'Cantidad de envíos por estado',
  );
  console.log(cantidadPorEstadoVehiculo);

  // Estadisticas de kilometraje
  // Paso 1: Filtrar los vehículos con id_vehiculo > 2
  const vehiculosFiltrados = historialAsignacion.filter(
    (entrada) => entrada.id_vehiculo > 2,
  );

  // Paso 2: Crear un nuevo arreglo con el id_vehiculo como clave y el kilometraje transcurrido como valor
  const kilometrajePorVehiculo = vehiculosFiltrados.reduce((acc, entrada) => {
    const kilometrajeTranscurrido =
      entrada.kilometraje_final - entrada.kilometraje_inicial;
    acc[entrada.id_vehiculo] = kilometrajeTranscurrido;
    return acc;
  }, {});

  const kilometrajeKey = Object.keys(kilometrajePorVehiculo);
  const kilometrajeValor = Object.values(kilometrajePorVehiculo);

  const barDataKilometraje = grafica_barra(
    kilometrajeKey,
    kilometrajeValor,
    'Cantidad de envíos por estado',
  );
  const pieDataKilometraje = grafica_circular(
    kilometrajeKey,
    kilometrajeValor,
    'Porcentaje de entregas',
  );
  const kilometrajeKeyNum = kilometrajeKey.map((_, index) => index + 1);
  const scatterDataKilometraje = grafica_puntos(
    kilometrajeKeyNum,
    kilometrajeValor,
    'Cantidad de envíos por estado',
  );

  console.log(kilometrajePorVehiculo);

  // El gráfico que se mostrará depende de la tabla y tipo de gráfico seleccionados
  const renderChart = () => {
    if (selectedTable === 'Envios') {
      if (selectedSalesPeriod === 'estado') {
        if (selectedChartType === 'bar') {
          return <Bar data={barDataEnvios} options={{ responsive: true }} />;
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataEnvios} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter data={scatterDataEnvios} options={{ responsive: true }} />
          );
        }
      } else if (selectedSalesPeriod === 'semanales') {
        if (selectedChartType === 'bar') {
          return (
            <Bar data={barDataCostoSemanal} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataCostoSemanal} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataCostoSemanal}
              options={{ responsive: true }}
            />
          );
        }
      } else if (selectedSalesPeriod === 'mensuales') {
        if (selectedChartType === 'bar') {
          return (
            <Bar data={barDataCostoMensual} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataCostoMensual} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataCostoMensual}
              options={{ responsive: true }}
            />
          );
        }
      } else if (selectedSalesPeriod === 'anuales') {
        if (selectedChartType === 'bar') {
          return (
            <Bar data={barDataCostoAnual} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataCostoAnual} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataCostoAnual}
              options={{ responsive: true }}
            />
          );
        }
      }
    } else if (selectedTable === 'Usuarios') {
      if (selectedSalesPeriod2 === 'tipo') {
        if (selectedChartType === 'bar') {
          console.log('barDataTipoUsuario', barDataTipoUsuario);
          return (
            <Bar data={barDataTipoUsuario} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataTipoUsuario} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataTipoUsuario}
              options={{ responsive: true }}
            />
          );
        }
      }
    } else {
      if (selectedSalesPeriod3 === 'disponibilidad') {
        if (selectedChartType === 'bar') {
          return (
            <Bar data={barDataEstadoVehiculo} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataEstadoVehiculo} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataEstadoVehiculo}
              options={{ responsive: true }}
            />
          );
        }
      } else if (selectedSalesPeriod3 === 'kilometraje') {
        if (selectedChartType === 'bar') {
          return (
            <Bar data={barDataKilometraje} options={{ responsive: true }} />
          );
        } else if (selectedChartType === 'pie') {
          return <Pie data={pieDataKilometraje} />;
        } else if (selectedChartType === 'scatter') {
          return (
            <Scatter
              data={scatterDataKilometraje}
              options={{ responsive: true }}
            />
          );
        }
      }
    }
  };

  return (
    <div className="reports-page">
      <h1>Panel de Informes</h1>

      {/* Select para elegir la tabla */}
      <div className="selectors">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="Envios">Envíos</option>
          <option value="Usuarios">Usuarios</option>
          <option value="Vehiculos">Vehículos</option>
        </select>

        {/* Select para elegir las ventas semanales o mensuales */}
        {selectedTable === 'Envios' ? (
          <>
            <select
              value={selectedSalesPeriod}
              onChange={(e) => setSelectedSalesPeriod(e.target.value)}
            >
              <option value="estado">Estadistica de envios por estado</option>
              <option value="semanales">Ganancias semanales</option>
              <option value="mensuales">Ganancias mensuales</option>
              <option value="anuales">Ganancias anuales</option>
            </select>
          </>
        ) : selectedTable === 'Usuarios' ? (
          <>
            <select
              value={selectedSalesPeriod2}
              onChange={(e) => setSelectedSalesPeriod2(e.target.value)}
            >
              <option value="tipo">Estadistica por tipo de usuario</option>
            </select>
          </>
        ) : (
          <>
            <select
              value={selectedSalesPeriod3}
              onChange={(e) => setSelectedSalesPeriod3(e.target.value)}
            >
              <option value="disponibilidad">
                Estadistica de disponibilidad de vehiculos
              </option>
              <option value="kilometraje">
                Kilometraje recorrido por auto
              </option>
            </select>
          </>
        )}

        {/* Select para elegir el tipo de gráfico */}
        <select
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value)}
        >
          <option value="bar">Gráfico de Barras</option>
          <option value="pie">Gráfico de Pastel</option>
          <option value="scatter">Gráfico de Dispersión</option>
        </select>
      </div>

      {/* Recuadro de estadísticas */}
      <div className="statistics-box">
        <h2>Datos</h2>
        <div className="statistics-content">
          <p>
            Total de {selectedTable}:{' '}
            {total[selectedTable] ? total[selectedTable] : ''}
          </p>
        </div>
      </div>

      {/* Aquí se renderiza el gráfico dinámicamente */}
      <div className="charts-box">
        <h2>Gráfico</h2>
        <div className="chart">{renderChart()}</div>
      </div>
    </div>
  );
};

export default ReportsPage;
