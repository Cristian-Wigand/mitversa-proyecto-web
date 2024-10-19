<?php
class DB
{
    private $host = 'localhost';    // Dirección del servidor MySQL en XAMPP
    private $user = 'root';         // Usuario predeterminado de MySQL en XAMPP (generalmente "root")
    private $password = '';         // Contraseña predeterminada para "root" en XAMPP es vacía (si no la has cambiado)
    private $dbname = 'mitversa';   // Nombre de tu base de datos
    private $port = '3306';         // Puerto predeterminado de MySQL en XAMPP
    private $conn;

    // Método para establecer la conexión a la base de datos
    public function connect()
    {
        $this->conn = new mysqli($this->host, $this->user, $this->password, $this->dbname, $this->port);

        // Verificar si la conexión fue exitosa
        if ($this->conn->connect_error) {
            error_log("Error de conexión: " . $this->conn->connect_error); // Registra el error en el log de errores del servidor
            die(json_encode(["error" => "Error de conexión: " . $this->conn->connect_error])); // Retorna un JSON con el error
        }

        // Registra en el log del servidor si la conexión fue exitosa
        error_log("Conexión exitosa a la base de datos.");
        return $this->conn;
    }
}
