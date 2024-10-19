<?php
include 'db.php';

class HistorialEnvio
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear un historial de envío
    public function create($id_envio, $fecha, $detalles)
    {
        $stmt = $this->conn->prepare("INSERT INTO historial_envio (id_envio, fecha, detalles) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $id_envio, $fecha, $detalles);
        return $stmt->execute();
    }

    // Leer todos los historiales de envío
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM historial_envio");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar un historial de envío
    public function update($id, $id_envio, $fecha, $detalles)
    {
        $stmt = $this->conn->prepare("UPDATE historial_envio SET id_envio = ?, fecha = ?, detalles = ? WHERE id_historial = ?");
        $stmt->bind_param("issi", $id_envio, $fecha, $detalles, $id);
        return $stmt->execute();
    }

    // Eliminar un historial de envío
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM historial_envio WHERE id_historial = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>