const Conexiones = () => {
  const diccionario = (tipo, nombre) => {
    const diccionario_completo = {
      fechas: {
        Ciudad: [''],
        Comuna: [''],
        Direccion: [''],
        Envio: ['fecha_pedido_inicio', 'fecha_pedido_fin'],
        Estado_envio: [''],
        Asignacion: ['fecha_asignacion', 'fecha_devolucion'],
        Historial_envio: ['fecha'],
        Incidencia: ['fecha'],
        Notificacion: ['fecha'],
        Paquete: [''],
        Tipo_incidencia: [''],
        Usuario: ['usuario_creado_el', 'usuario_actualizado_el'],
        Vehiculo: ['vehiculo_creado_el', 'vehiculo_actualizado_el'],
      },
      numeros: {
        Ciudad: ['id_ciudad'],
        Comuna: ['id_comuna', 'id_ciudad'],
        Direccion: ['id_direccion', 'id_comuna', 'numero'],
        Envio: ['id_envio', 'id_estado_envio', 'id_repartidor', 'id_cliente'],
        Estado_envio: ['id_estado_envio'],
        Asignacion: [
          'id_historial',
          'id_repartidor',
          'id_vehiculo',
          'kilometraje_inicial',
          'kilometraje_final',
        ],
        Historial_envio: ['id_historial', 'id_envio'],
        Incidencia: ['id_incidencia', 'id_envio', 'id_tipo_incidencia'],
        Notificacion: ['id_notificacion', 'id_cliente', 'id_envio'],
        Paquete: ['id_paquete', 'id_envio', 'peso', 'largo', 'ancho', 'alto'],
        Tipo_incidencia: ['id_tipo_incidencia'],
        Usuario: ['id_usuario'],
        Vehiculo: ['id_vehiculo'],
      },
      api: {
        Ciudad: 'https://mitversa.christianferrer.me/api/ciudades/',
        Comuna: 'https://mitversa.christianferrer.me/api/comunas/',
        Direccion: 'https://mitversa.christianferrer.me/api/direcciones/',
        Envio: 'https://mitversa.christianferrer.me/api/envios/',
        Estado_envio: 'https://mitversa.christianferrer.me/api/estados-envio/',
        Asignacion:
          'https://mitversa.christianferrer.me/api/historiales-asignacion/',
        Historial_envio:
          'https://mitversa.christianferrer.me/api/historiales-envio/',
        Incidencia: 'https://mitversa.christianferrer.me/api/incidencias/',
        Notificacion: 'https://mitversa.christianferrer.me/api/notificaciones/',
        Paquete: 'https://mitversa.christianferrer.me/api/paquetes/',
        Tipo_incidencia:
          'https://mitversa.christianferrer.me/api/tipos-incidencia/',
        Usuario: 'https://mitversa.christianferrer.me/api/usuarios/',
        Vehiculo: 'https://mitversa.christianferrer.me/api/vehiculos/',
      },
      password_api: 'TI2:R1yJJtW9X31rxY',
    };
    if (tipo === 0) {
      return diccionario_completo['fechas'][`${nombre}`];
    } else if (tipo === 1) {
      return diccionario_completo['numeros'][`${nombre}`];
    } else if (tipo == 2) {
      return diccionario_completo['api'][`${nombre}`];
    } else if (tipo == 3) {
      return diccionario_completo['password_api'];
    } else {
      return console.log('Error en diccionario');
    }
  };
  const Response = async (response, nombre, successMessage) => {
    if (!response.ok) {
      return Promise.reject(`Error en la solicitud: ${response.status}`);
    }
    const data = await response.json();
    //console.log(successMessage, data);
    if (nombre !== 'Direccion') {
      alert(`${nombre} ${successMessage}`);
    }
    return { success: true, data };
  };
  const fetchSearch = async (nombre, filters) => {
    const api = diccionario(2, nombre);
    const fechas = diccionario(0, nombre);
    const numeros = diccionario(1, nombre);
    console.log('filters', filters);

    try {
      const response = await fetch(`${api}`);

      // Verifica si la respuesta es exitosa antes de intentar obtener los datos
      if (!response.ok) {
        alert(`Error al cargar el ${nombre}`);
        return [false];
      }

      const data = await response.json();
      //console.log(data);

      // Filtrar los objetos según los filtros proporcionados
      const filtrados = data.filter((objeto) => {
        return Object.keys(filters).every((key) => {
          if (objeto[key] === null) {
            return objeto[key];
          }
          if (fechas.length > 0) {
            // Obtener parámetros que sean fechas
            for (const elemento of fechas) {
              if (key === `${elemento}`) {
                //console.log('key', key);
                //console.log('BD:', objeto[key]);
                const [datePart, timePart] = objeto[key].split('T');
                const [yearO, monthO, dayO] = datePart.split('-').map(Number);
                const [year, month, day] = filters[key].split('-').map(Number);
                //console.log('Filtro:', filtroFecha);
                //console.log('BD:', objetoFecha);

                return yearO === year && monthO === month && dayO === day;
              }
            }
          }
          if (numeros.length > 0) {
            for (const elemento of numeros) {
              if (key === `${elemento}`) {
                // Comparación estándar para números
                //console.log(
                //  'Number',
                //  objeto[key],
                //  Number(objeto[key]),
                //  filters[key],
                //  Number(filters[key]),
                //);
                return Number(objeto[key]) === Number(filters[key]);
              }
            }
          }
          // Comparación estándar para otros valores
          return objeto[key].toString().startsWith(filters[key].toString());
        });
      });
      if (filtrados.length == 0) {
        return [false];
      }
      //console.log('filtrados', filtrados); // Verifica qué datos han sido filtrados
      return [true, filtrados];
    } catch (error) {
      alert(`Error de conexión con el servidor.(${nombre})`);
      return [false];
    }
  };
  const fetchSearch2 = async (nombre, filters) => {
    const api = diccionario(2, nombre);
    const fechas = diccionario(0, nombre); // Lista de claves que son fechas
    const numeros = diccionario(1, nombre); // Lista de claves que son números

    console.log('filters2', filters);

    try {
      const response = await fetch(`${api}`);

      // Verifica si la respuesta es exitosa antes de intentar obtener los datos
      if (!response.ok) {
        console.error(`Error al cargar el recurso: ${nombre}`);
        return [false];
      }

      const data = await response.json();

      // Filtrar los objetos según los filtros proporcionados
      const filtrados = data.filter((objeto) => {
        return Object.keys(filters).every((key) => {
          console.log('objeto[key], filters[key]', objeto[key], filters[key]);

          // Si el objeto tiene valores nulos, los ignoramos
          if (objeto[key] === null) return false;

          // Manejo de filtros por fechas
          if (fechas.includes(key)) {
            return filters[key].some((element) => {
              const [yearO, monthO, dayO] = objeto[key]
                .split('T')[0] // Separar la fecha (ISO 8601)
                .split('-')
                .map(Number);
              const [year, month, day] = element.split('-').map(Number);
              return yearO === year && monthO === month && dayO === day;
            });
          }

          // Manejo de filtros por números
          if (numeros.includes(key)) {
            return filters[key].some(
              (element) => Number(objeto[key]) === Number(element),
            );
          }

          // Comparación estándar para otros tipos de valores
          return filters[key].some((element) =>
            objeto[key].toString().startsWith(element.toString()),
          );
        });
      });
      console.log('filtrados', filtrados);
      // Si no se encontraron coincidencias
      if (filtrados.length === 0) {
        return [false];
      }

      return [true, filtrados];
    } catch (error) {
      console.error(`Error de conexión con el servidor: ${nombre}`, error);
      return [false];
    }
  };

  const SubmitCreate = async (nombre, create) => {
    let fechas;
    console.log('Create', create);
    if (nombre == 'Envio') {
      fechas = [];
      //console.log('Fechas: envio', fechas);
    } else {
      fechas = diccionario(0, nombre);
    }
    const api = diccionario(2, nombre);
    const password = diccionario(3);

    if (fechas.length > 0) {
      // Obtén la fecha de creación
      const fechaCreacion = new Date().toLocaleString('sv-SE').slice(0, 16);
      for (const elemento of fechas) {
        if (elemento in create) {
          if (create[elemento] !== null) {
            create[elemento] = fechaCreacion;
          }
        }
      }
    }
    //console.log('Create', create);
    //console.log('api', api);

    // Realiza la solicitud con el objeto actualizado
    try {
      const response = await fetch(`${api}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${password}`),
        },
        body: JSON.stringify(create), // Usa el objeto actualizado aquí
      });

      const result = await Response(response, nombre, `creado exitosamente`);
      return [result.success, result.data]; // Devuelve el éxito de la operación
    } catch (error) {
      console.error('Error:', error);
      if (nombre !== 'Direccion') {
        alert(`Hubo un error al crear ${nombre}: ` + error);
      }
      return [false]; // Indica que hubo un error
    }
  };

  const updateObject = async (nombre, idObject, cambio) => {
    const fechas = diccionario(0, nombre);
    const api = diccionario(2, nombre);
    const password = diccionario(3);

    try {
      if (fechas.length > 0) {
        // Obtén la fecha de actualización
        const fechaUpdate = new Date().toLocaleString('sv-SE').slice(0, 16);
        for (const elemento of fechas) {
          if (elemento in cambio) {
            cambio[elemento] = fechaUpdate;
          }
        }
      }
      console.log('cambio', cambio);

      //console.log('id', idObject);
      const response = await fetch(`${api}${idObject}/`, {
        method: 'PATCH', // Usualmente PATCH o PUT para actualizaciones
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${password}`),
        },
        body: JSON.stringify(cambio), // Actualiza
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el ${nombre}`);
      }

      const data = await response.json();
      //console.log(`Estado del ${nombre} actualizado:`, data);
      alert(`El ${nombre} se ah actualizado`);
      return true; // Indica que la actualización fue exitosa
    } catch (error) {
      alert(`Error al actualizar el ${nombre}:`, error);
      console.error(`Error al actualizar el ${nombre}:`, error);
      return false; // Indica que hubo un error
    }
  };

  const Delete = async (nombre, userId) => {
    const api = diccionario(2, nombre);
    const password = diccionario(3);

    if (
      window.confirm(`¿Estás seguro de que deseas eliminar este ${nombre}?`)
    ) {
      try {
        const response = await fetch(`${api}${userId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${password}`),
          },
        });

        if (response.ok) {
          alert(`${nombre} eliminado exitosamente.`);
          return true; // Indica que la eliminación fue exitosa
        } else {
          const errorData = await response.json();
          alert(
            `Error: ${errorData.detail || `No se pudo eliminar el ${nombre}`}`,
          );
          return false; // Indica que hubo un error en la eliminación
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        return false; // Indica que ocurrió un error
      }
    }

    return false; // Si el usuario cancela la confirmación
  };
  const traer_todo = async (nombre) => {
    const api = diccionario(2, nombre);
    const password = diccionario(3);
    try {
      const response = await fetch(`${api}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${password}`),
        },
      });
      const data = await response.json();
      return [true, data];
    } catch (error) {
      console.error(`Error al obtener estados de :${nombre}`, error);
      return [false];
    }
  };

  return {
    diccionario,
    fetchSearch,
    fetchSearch2,
    SubmitCreate,
    updateObject,
    Delete,
    traer_todo,
  };
};

export default Conexiones;
