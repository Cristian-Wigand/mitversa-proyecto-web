// Importamos las utilidades 'render' y 'screen' de '@testing-library/react'
// 'render' permite renderizar componentes en un entorno de pruebas.
// 'screen' proporciona métodos para consultar el DOM simulado, como buscar elementos por su texto.
import { render, screen } from '@testing-library/react';

// Importamos el componente 'App' desde el archivo 'App.js', para probarlo.
import App from './App';

// Definimos una prueba utilizando el método 'test'.
// El primer argumento es una descripción de la prueba ("renders learn react link").
// El segundo argumento es una función que contiene la lógica de la prueba.
test('renders learn react link', () => {
  
  // Renderizamos el componente 'App' en el entorno de pruebas.
  // Esto simula cómo se vería el componente cuando se renderiza en el navegador.
  render(<App />);
  
  // Utilizamos 'screen.getByText' para buscar un elemento que contenga el texto "learn react".
  // La expresión regular '/learn react/i' hace que la búsqueda no distinga entre mayúsculas y minúsculas.
  // Si el texto es encontrado, se almacena en la constante 'linkElement'.
  const linkElement = screen.getByText(/learn react/i);
  
  // Usamos 'expect' para verificar que el elemento 'linkElement' esté presente en el DOM.
  // 'toBeInTheDocument()' es una afirmación que pasa si el elemento está en el DOM.
  expect(linkElement).toBeInTheDocument();
});
