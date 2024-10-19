<?php
include 'db.php';

class Incidencia
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear una incidencia
    public function create($id_envio, $fecha, $tipo_incidencia, $descripcion)
    {
        $stmt = $this->conn->prepare("INSERT INTO incidencia (id_envio, fecha, tipo_incidencia, descripcion) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $id_envio, $fecha, $tipo_incidencia, $descripcion);
        return $stmt->execute();
    }

    // Leer todas las incidencias
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM incidencia");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar una incidencia
    public function update($id, $id_envio, $fecha, $tipo_incidencia, $descripcion)
    {
        $stmt = $this->conn->prepare("UPDATE incidencia SET id_envio = ?, fecha = ?, tipo_incidencia = ?, descripcion = ? WHERE id_incidencia = ?");
        $stmt->bind_param("isssi", $id_envio, $fecha, $tipo_incidencia, $descripcion, $id);
        return $stmt->execute();
    }

    // Eliminar una incidencia
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM incidencia WHERE id_incidencia = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>