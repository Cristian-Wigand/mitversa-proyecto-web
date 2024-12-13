<?php
include 'db.php';

class Direccion
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear una dirección
    public function create($ciudad, $comuna, $calle, $numero)
    {
        $stmt = $this->conn->prepare("INSERT INTO direccion (ciudad, comuna, calle, numero) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $ciudad, $comuna, $calle, $numero);
        return $stmt->execute();
    }

    // Leer todas las direcciones
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM direccion");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar una dirección
    public function update($id, $ciudad, $comuna, $calle, $numero)
    {
        $stmt = $this->conn->prepare("UPDATE direccion SET ciudad = ?, comuna = ?, calle = ?, numero = ? WHERE id_direccion = ?");
        $stmt->bind_param("sssii", $ciudad, $comuna, $calle, $numero, $id);
        return $stmt->execute();
    }

    // Eliminar una dirección
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM direccion WHERE id_direccion = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>