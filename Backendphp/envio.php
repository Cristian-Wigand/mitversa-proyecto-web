<?php
include 'db.php';

class Envio
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear un envío
    public function create($estado_envio, $fecha_estimada)
    {
        $stmt = $this->conn->prepare("INSERT INTO envio (estado_envio, fecha_estimada) VALUES (?, ?)");
        $stmt->bind_param("ss", $estado_envio, $fecha_estimada);
        return $stmt->execute();
    }

    // Leer todos los envíos
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM envio");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar un envío
    public function update($id, $estado_envio, $fecha_estimada)
    {
        $stmt = $this->conn->prepare("UPDATE envio SET estado_envio = ?, fecha_estimada = ? WHERE id_envio = ?");
        $stmt->bind_param("ssi", $estado_envio, $fecha_estimada, $id);
        return $stmt->execute();
    }

    // Eliminar un envío
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM envio WHERE id_envio = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>