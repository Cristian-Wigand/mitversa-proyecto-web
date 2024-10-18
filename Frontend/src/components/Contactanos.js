import React, { useState, useRef } from 'react'; // Importa useState y useRef
import '../App.css';
import { init, sendForm } from 'emailjs-com'; // Importa EmailJS

const Contactanos = () => {
  const [email, setEmail] = useState(''); // Estado para el correo
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje
  const [enviando, setEnviando] = useState(false); // Estado para manejar el estado de envío
  const formRef = useRef(); // Referencia al formulario

  // Inicializa EmailJS
  init('_5rPKlg4XObD0M8Kq');

  // Función para validar el correo
  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Expresión regular para Gmail
    return regex.test(email);
  };

  // Función para manejar el envío
  const manejarEnvio = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    if (validarEmail(email)) {
      setEnviando(true); // Cambia el estado a "enviando"

      const serviceID = 'default_service';
      const templateID = 'template_1qb09sx';

      sendForm(serviceID, templateID, formRef.current) // Pasa la referencia del formulario
        .then(() => {
          alert('Correo enviado exitosamente'); // Mensaje de éxito
          setEnviando(false); // Restablece el estado de envío
          setEmail(''); // Limpia el campo de email
          setMensaje(''); // Limpia el campo de mensaje
        })
        .catch((err) => {
          alert(JSON.stringify(err)); // Mensaje de error
          setEnviando(false); // Restablece el estado de envío
        });
    } else {
      alert('Por favor, ingresa un correo válido de Gmail'); // Mensaje de error
    }
  };

  return (
    <div className="register-container">
      <h1 className="h1_black">
        Contáctanos Te ofreceremos la ayuda necesaria
      </h1>
      <div className="register-form">
        <h1>Formulario de Contacto</h1>
        <form onSubmit={manejarEnvio} ref={formRef}>
          <input
            type="text"
            name="from_name"
            placeholder="ingresatu@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows="4"
          />
          <button className="auth-button" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contactanos;
