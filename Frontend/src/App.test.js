// Importa las utilidades para pruebas de React
import { render, screen } from '@testing-library/react';

// Importa el componente que vamos a probar
import App from './App';

// Define una prueba
test('renders learn react link', () => {
  // Renderiza el componente App
  render(<App />);

  // Busca el elemento que contiene el texto "learn react"
  const linkElement = screen.getByText(/learn react/i);

  // Verifica que el elemento está en el documento
  expect(linkElement).toBeInTheDocument();
});
