import '../Css/Home_principal.css';
import Home from './Home';
import About from './About';
import Footer from './Footer';

const Home_principal = () => {
  return (
    <div className="Home_principal">
      <Home />
      <About />
      <Footer />
    </div>
  );
};

export default Home_principal;
