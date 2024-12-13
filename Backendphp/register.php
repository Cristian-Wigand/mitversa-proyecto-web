<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Habilitar temporalmente la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

ob_start(); // Inicia el buffer de salida

class Register
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
        if (!$this->conn) {
            $this->sendJsonResponse(["message" => "Error en la conexión a la base de datos"]);
            ob_end_clean();
            exit;
        }
    }

    private function sendJsonResponse($data)
    {
        echo json_encode($data);
        ob_end_flush(); // Enviar la respuesta y limpiar el buffer
    }

    public function create($nombre, $apellido, $email, $password, $tipo_usuario)
    {
        $fecha_actual = date("Y-m-d H:i:s");
        $stmt = $this->conn->prepare("INSERT INTO Usuario (nombre, apellido, email, password, tipo_usuario, usuario_creado_el) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            $this->sendJsonResponse(["message" => "Error en la preparación de la consulta.", "error" => $this->conn->error]);
            exit;
        }

        $stmt->bind_param("ssssss", $nombre, $apellido, $email, $password, $tipo_usuario, $fecha_actual);

        if (!$stmt->execute()) {
            $this->sendJsonResponse(["message" => "Error al registrar usuario.", "error" => $stmt->error]);
            exit;
        }

        $this->sendJsonResponse(["message" => "Usuario registrado con éxito."]);
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $data = json_decode(file_get_contents("php://input"));

        if ($method === 'POST') {
            if (isset($data->nombre) && isset($data->apellido) && isset($data->email) && isset($data->password) && isset($data->tipo_usuario)) {
                $this->create($data->nombre, $data->apellido, $data->email, $data->password, $data->tipo_usuario);
            } else {
                $this->sendJsonResponse(["message" => "Datos incompletos."]);
            }
        } else {
            $this->sendJsonResponse(["message" => "Método no permitido."]);
        }
    }
}

$register = new Register();
$register->handleRequest();
