<?php
include 'db.php';

class Vehiculo
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear un vehiculo
    public function create($matricula, $marca, $modelo)
    {
        $stmt = $this->conn->prepare("INSERT INTO vehiculo (matricula, marca, modelo) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $matricula, $marca, $modelo);
        return $stmt->execute();
    }

    // Leer todos los vehiculos
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM vehiculo");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar un vehiculo
    public function update($id, $matricula, $marca, $modelo)
    {
        $stmt = $this->conn->prepare("UPDATE vehiculo SET matricula = ?, marca = ?, modelo = ? WHERE id_vehiculo = ?");
        $stmt->bind_param("sssi", $matricula, $marca, $modelo, $id);
        return $stmt->execute();
    }

    // Eliminar un vehiculo
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM vehiculo WHERE id_vehiculo = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>