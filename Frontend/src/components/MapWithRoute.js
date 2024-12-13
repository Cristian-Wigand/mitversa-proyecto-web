import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Css/MapWithRoute.css'; // Asegúrate de tener el archivo de estilos
import L from 'leaflet'; // Para trabajar con iconos de marcadores
import markerImage from '../Assets/map-marker-svgrepo-com.svg';

const MapWithRoute = ({ address1, address2, address3 }) => {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address3Coords, setAddress3Coords] = useState(null);

  // Función para obtener las coordenadas a partir de la dirección
  const getCoordinatesFromAddress = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address,
      )}&format=json&addressdetails=1`
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

  // Función para obtener la ruta entre varios puntos (address1 -> address3 -> address2)
  const getRouteWithWaypoints = async (points) => {
    const waypoints = points.map(({ lon, lat }) => `${lon},${lat}`).join(';');
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`
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
        const address3Coords = await getCoordinatesFromAddress(address3);

        // Obtener la ruta completa con waypoints
        const fullRoute = await getRouteWithWaypoints([startCoords, address3Coords, endCoords]);

        setRoute(fullRoute.map(([lon, lat]) => [lat, lon])); // Convertir a formato Leaflet
        setAddress3Coords(address3Coords);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [address1, address2, address3]); // Dependencia añadida para que se ejecute cuando las direcciones cambien

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Estamos cargando...</p>
      </div>
    );
  }

  const polylineStyle = {
    color: 'blue',
    weight: 5,
    opacity: 0.7,
  };

  // Crear el icono del marcador con una imagen personalizada
  const customIcon = new L.Icon({
    iconUrl: markerImage, // Cambia por la ruta de tu imagen
    iconSize: [32, 32], // Tamaño del icono
    iconAnchor: [16, 32], // Donde el icono se 'ancla' (parte inferior)
    popupAnchor: [0, -32], // Ubicación del popup
  });

  return (
    <div className="map-container">
      <MapContainer
        center={[route[0]?.[0], route[0]?.[1]]} // Centrado en la primera coordenada
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={polylineStyle}
          />
        )}
        {address3Coords && (
          <Marker
            position={[address3Coords.lat, address3Coords.lon]}
            icon={customIcon} // Aquí asignas el icono personalizado
          >
            <Popup>
              Dirección 3: {address3}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Recuadro en la esquina superior derecha con punto rojo */}
      <div className="location-box">
        <div className="location-marker"></div>
        <p>Última Ubicación</p>
      </div>
    </div>
  );
};

export default MapWithRoute;
