<?php
// Incluye el archivo db.php para conectar a la base de datos.
include 'db.php';

// Define la clase Notificacion que contiene los métodos para realizar operaciones CRUD.
class Notificacion
{
    // Variable para almacenar la conexión a la base de datos.
    private $conn;

    // Constructor de la clase que se ejecuta automáticamente al crear una instancia de Notificacion.
    // Establece la conexión a la base de datos utilizando la clase DB.
    public function __construct()
    {
        $db = new DB();            // Crea una instancia de la clase DB.
        $this->conn = $db->connect(); // Guarda la conexión en la variable $conn.
    }

    // Método para crear una nueva notificación en la tabla notificacion.
    public function create($mensaje, $id_cliente)
    {
        // Prepara una sentencia SQL para insertar un registro en la tabla notificacion.
        $stmt = $this->conn->prepare("INSERT INTO notificacion (mensaje, id_cliente) VALUES (?, ?)");

        // Asocia los valores a insertar con los parámetros de la consulta.
        $stmt->bind_param("si", $mensaje, $id_cliente);

        // Ejecuta la sentencia SQL y retorna true si la operación fue exitosa.
        return $stmt->execute();
    }

    // Método para leer todas las notificaciones de la tabla notificacion.
    public function read()
    {
        // Ejecuta una consulta para obtener todos los registros de la tabla.
        $result = $this->conn->query("SELECT * FROM notificacion");

        // Devuelve el resultado como un arreglo asociativo.
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Método para actualizar una notificación existente en la tabla notificacion.
    public function update($id, $mensaje, $id_cliente)
    {
        // Prepara una sentencia SQL para actualizar un registro en la tabla notificacion.
        $stmt = $this->conn->prepare("UPDATE notificacion SET mensaje = ?, id_cliente = ? WHERE id_notificacion = ?");

        // Asocia los valores y el id de la notificación a los parámetros de la consulta.
        $stmt->bind_param("sii", $mensaje, $id_cliente, $id);

        // Ejecuta la sentencia SQL y retorna true si la operación fue exitosa.
        return $stmt->execute();
    }

    // Método para eliminar una notificación de la tabla notificacion.
    public function delete($id)
    {
        // Prepara una sentencia SQL para eliminar un registro de la tabla notificacion.
        $stmt = $this->conn->prepare("DELETE FROM notificacion WHERE id_notificacion = ?");

        // Asocia el id de la notificación a eliminar con el parámetro de la consulta.
        $stmt->bind_param("i", $id);

        // Ejecuta la sentencia SQL y retorna true si la operación fue exitosa.
        return $stmt->execute();
    }
}
?>