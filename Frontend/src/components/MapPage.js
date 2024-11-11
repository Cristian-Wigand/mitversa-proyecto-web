import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapPage = () => {
  const [route, setRoute] = useState([]);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  // Leer los parámetros de la URL para obtener las ciudades de origen y destino
  const params = new URLSearchParams(window.location.search);
  const address1 = decodeURIComponent(params.get('origen')) || 'Victoria, Chile'; // Origen (si no se pasa, se usa un valor por defecto)
  const address2 = decodeURIComponent(params.get('destino')) || 'Temuco, Chile'; // Destino (valor por defecto)

  // Función para obtener las coordenadas de una dirección
  const getCoordinatesFromAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      } else {
        console.error('No se encontraron coordenadas para la dirección:', address);
        throw new Error('No se encontraron coordenadas para la ciudad');
      }
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
      throw error;  // Propagar el error para manejarlo más arriba
    }
  };

  // Función para obtener la ruta entre dos coordenadas
  const getRoute = async (start, end) => {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    return data.routes[0].geometry.coordinates;
  };

  // Usar useEffect para obtener las coordenadas y la ruta cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener coordenadas de origen y destino
        const startCoords = await getCoordinatesFromAddress(address1);
        const endCoords = await getCoordinatesFromAddress(address2);

        // Obtener la ruta entre las coordenadas
        const routeCoordinates = await getRoute(startCoords, endCoords);

        // Guardar los datos obtenidos en el estado
        setStartCoords(startCoords);
        setEndCoords(endCoords);
        setRoute(routeCoordinates);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la ruta:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [address1, address2]); // Se ejecuta cada vez que los parámetros cambian

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Estamos cargando...</p>
      </div>
    );
  }

  const polylineStyle = {
    color: 'red',
    weight: 5,
    opacity: 0.7,
  };

  return (
    <div className="map-container">
      <h2>Ruta entre {address1} y {address2}</h2>
      <MapContainer
        center={[startCoords?.lat || 0, startCoords?.lon || 0]}
        zoom={6}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Dibuja la ruta si existe */}
        {route.length > 0 && (
          <Polyline
            positions={route.map((coords) => [coords[1], coords[0]])}
            pathOptions={polylineStyle}
          />
        )}

        {/* Marcadores de Origen y Destino */}
        {startCoords && (
          <Marker position={[startCoords.lat, startCoords.lon]} />
        )}
        {endCoords && (
          <Marker position={[endCoords.lat, endCoords.lon]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapPage;
