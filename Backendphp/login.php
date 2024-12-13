<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Iniciar la sesión
session_start();

class Login
{
    private $conn;

    public function __construct()
    {
        $db = new DB();
        $this->conn = $db->connect();
        if (!$this->conn) {
            $this->sendJsonResponse(["message" => "Error en la conexión a la base de datos"]);
            exit;
        }
    }

    private function sendJsonResponse($data)
    {
        echo json_encode($data);
        exit; // Terminar la ejecución después de enviar la respuesta
    }

    public function authenticate($email, $password)
    {
        // Preparar la consulta para verificar las credenciales del usuario
        $stmt = $this->conn->prepare("SELECT id_usuario, nombre, apellido, tipo_usuario FROM Usuario WHERE email = ? AND password = ?");
        if (!$stmt) {
            $this->sendJsonResponse(["message" => "Error en la preparación de la consulta.", "error" => $this->conn->error]);
            exit;
        }

        $stmt->bind_param("ss", $email, $password); // Usa un método de hash para mayor seguridad en producción
        $stmt->execute();
        $result = $stmt->get_result();

        // Verificar si se encontró un usuario
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Guardar información del usuario en la sesión
            $_SESSION['user_id'] = $user['id_usuario'];
            $_SESSION['nombre'] = $user['nombre'];
            $_SESSION['apellido'] = $user['apellido'];
            $_SESSION['tipo_usuario'] = $user['tipo_usuario'];

            $this->sendJsonResponse(["message" => "Inicio de sesión exitoso.", "user" => $user]);
        } else {
            $this->sendJsonResponse(["message" => "Credenciales inválidas."]);
        }
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $data = json_decode(file_get_contents("php://input"));

        if ($method === 'POST') {
            if (isset($data->email) && isset($data->password)) {
                $this->authenticate($data->email, $data->password);
            } else {
                $this->sendJsonResponse(["message" => "Datos incompletos."]);
            }
        } else {
            $this->sendJsonResponse(["message" => "Método no permitido."]);
        }
    }
}

$login = new Login();
$login->handleRequest();
