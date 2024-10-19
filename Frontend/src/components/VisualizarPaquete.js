// src/components/PackageCard.js
import React from 'react';
import '../App.css';

const PackageCard = () => {
  return (
    <div className="package-card">
      <div className="package-header">Última fecha de actualización</div>
      <div className="package-content">
        <div className="package-id">Paquete id</div>
        <div className="package-description">
          Descripción productos, Descripción productos, Descripción productos,
          Descripción productos, Descripción productos, Descripción productos
        </div>
        <button className="status-button">Visualizar estado</button>
      </div>
    </div>
  );
};

export default PackageCard;
