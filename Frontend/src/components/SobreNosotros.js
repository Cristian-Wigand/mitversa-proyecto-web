import React from 'react';
import '../Css/SobreNosotros.css';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      <div className="sobre-nosotros-section">
        <h2 className="title">Misión</h2>
        <p className="description">
          Mitversa tiene como objetivo proporcionar una plataforma web integral
          que facilite la gestión de envíos para empresas que requieran el
          servicio de mensajería, optimizando sus operaciones logísticas. A
          través de un sistema eficiente, seguro y fácil de usar, Mitversa busca
          garantizar que tanto los operadores logísticos como los clientes
          finales disfruten de una experiencia fluida y transparente, desde el
          registro hasta la entrega de los productos.
        </p>
      </div>
      <div className="sobre-nosotros-section">
        <h2 className="title">Visión</h2>
        <p className="description">
          Mitversa aspira a convertirse en una solución para empresas que no
          poseen un servicio de mensajería propio, brindándoles las herramientas
          necesarias para gestionar y optimizar sus operaciones logísticas de
          manera eficiente. A medida que crece la demanda por soluciones rápidas
          y seguras en el ámbito del comercio electrónico, se espera que
          Mitversa se posicione como la opción preferida para pequeñas y
          medianas empresas que desean integrar un servicio logístico sin tener
          que invertir en infraestructura propia.
        </p>
      </div>
      <div className="sobre-nosotros-section">
        <h2 className="title">Equipo de trabajo</h2>
        <ul className="team-list">
          <li>Cristian Wigand</li>
          <li>Sebastian Salamanca</li>
          <li>Javier Sanhueza</li>
        </ul>
      </div>
    </div>
  );
};

export default SobreNosotros;
