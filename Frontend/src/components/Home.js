import React from 'react';
import BannerBackground from '../Assets/blackgroundLogo.png';
import BannerImage from '../Assets/VanLogosinfondo.png';
import { FiArrowRight } from 'react-icons/fi';
import '../App.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            la empresa que cambiara el mercado
          </h1>
          <p className="primary-text">
            "Tu confianza es nuestra prioridad. Con cada envío, llevamos tu
            satisfacción más allá"
          </p>
          <button className="secondary-button">
            mira tu pedido <FiArrowRight />{' '}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
