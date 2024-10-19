<?php

$conn = new mysqli('localhost', 'root', '', 'mitversa', 3306); // Cambiar 'mitversa' por '' en el tercer argumento

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
echo "Conexión exitosa a la base de datos.";
$conn->close();
?>