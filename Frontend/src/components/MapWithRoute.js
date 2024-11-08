import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Css/MapWithRoute.css'; // Asegúrate de tener el archivo de estilos

const MapWithRoute = () => {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);

  const address1 = 'Victor Ruiz Torres 1995, Victoria, Chile';
  const address2 = 'Temuco, Chile';

  // Función para obtener las coordenadas a partir de la dirección
  const getCoordinatesFromAddress = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address,
      )}&format=json&addressdetails=1`,
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } else {
      throw new Error('No se pudieron obtener las coordenadas.');
    }
  };

  // Función para obtener la ruta entre dos puntos
  const getRoute = async (start, end) => {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`,
    );
    const data = await response.json();
    return data.routes[0].geometry.coordinates;
  };

  // Usar useEffect para obtener las coordenadas y la ruta cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const startCoords = await getCoordinatesFromAddress(address1);
        const endCoords = await getCoordinatesFromAddress(address2);
        const routeCoordinates = await getRoute(startCoords, endCoords);

        setRoute(routeCoordinates);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <MapContainer
        center={[route[0]?.[1], route[0]?.[0]]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route.length > 0 && (
          <Polyline
            positions={route.map((coords) => [coords[1], coords[0]])}
            pathOptions={polylineStyle}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithRoute;
