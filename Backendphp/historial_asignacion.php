<?php
include 'db.php';

class HistorialAsignacion
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear un historial de asignación
    public function create($id_repartidor, $id_vehiculo, $fecha_asignacion)
    {
        $stmt = $this->conn->prepare("INSERT INTO historial_asignacion (id_repartidor, id_vehiculo, fecha_asignacion) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $id_repartidor, $id_vehiculo, $fecha_asignacion);
        return $stmt->execute();
    }

    // Leer todos los historiales de asignación
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM historial_asignacion");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar un historial de asignación
    public function update($id, $id_repartidor, $id_vehiculo, $fecha_asignacion)
    {
        $stmt = $this->conn->prepare("UPDATE historial_asignacion SET id_repartidor = ?, id_vehiculo = ?, fecha_asignacion = ? WHERE id_historial = ?");
        $stmt->bind_param("iisi", $id_repartidor, $id_vehiculo, $fecha_asignacion, $id);
        return $stmt->execute();
    }

    // Eliminar un historial de asignación
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM historial_asignacion WHERE id_historial = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>