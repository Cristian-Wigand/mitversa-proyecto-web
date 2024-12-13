<?php
include 'db.php';

class Paquete
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
    }

    // Crear un paquete
    public function create($id_envio, $peso, $largo, $ancho, $alto)
    {
        $stmt = $this->conn->prepare("INSERT INTO paquete (id_envio, peso, largo, ancho, alto) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiii", $id_envio, $peso, $largo, $ancho, $alto);
        return $stmt->execute();
    }

    // Leer todos los paquetes
    public function read()
    {
        $result = $this->conn->query("SELECT * FROM paquete");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Actualizar un paquete
    public function update($id, $id_envio, $peso, $largo, $ancho, $alto)
    {
        $stmt = $this->conn->prepare("UPDATE paquete SET id_envio = ?, peso = ?, largo = ?, ancho = ?, alto = ? WHERE id_paquete = ?");
        $stmt->bind_param("iiiiii", $id_envio, $peso, $largo, $ancho, $alto, $id);
        return $stmt->execute();
    }

    // Eliminar un paquete
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM paquete WHERE id_paquete = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>