<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Habilitar temporalmente la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

ob_start(); // Inicia el buffer de salida

class Usuario
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

    public function read()
    {
        $result = $this->conn->query("SELECT * FROM Usuario");
        if (!$result) {
            $this->sendJsonResponse(["message" => "Error al obtener los usuarios.", "error" => $this->conn->error]);
            exit;
        }

        $usuarios = $result->fetch_all(MYSQLI_ASSOC);
        $this->sendJsonResponse($usuarios);
    }

    public function update($id, $nombre, $apellido, $email, $tipo_usuario)
    {
        $fecha_actualizada = date("Y-m-d H:i:s");
        $stmt = $this->conn->prepare("UPDATE Usuario SET nombre = ?, apellido = ?, email = ?, tipo_usuario = ?, usuario_actualizado_el = ? WHERE id_usuario = ?");
        if (!$stmt) {
            $this->sendJsonResponse(["message" => "Error en la preparación de la consulta.", "error" => $this->conn->error]);
            exit;
        }

        $stmt->bind_param("sssssi", $nombre, $apellido, $email, $tipo_usuario, $fecha_actualizada, $id);

        if (!$stmt->execute()) {
            $this->sendJsonResponse(["message" => "Error al actualizar usuario.", "error" => $stmt->error]);
            exit;
        }

        $this->sendJsonResponse(["message" => "Usuario actualizado con éxito."]);
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM Usuario WHERE id_usuario = ?");
        if (!$stmt) {
            $this->sendJsonResponse(["message" => "Error en la preparación de la consulta.", "error" => $this->conn->error]);
            exit;
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            $this->sendJsonResponse(["message" => "Error al eliminar usuario.", "error" => $stmt->error]);
            exit;
        }

        $this->sendJsonResponse(["message" => "Usuario eliminado con éxito."]);
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $data = json_decode(file_get_contents("php://input"));

        switch ($method) {
            case 'POST':
                if (isset($data->nombre) && isset($data->apellido) && isset($data->email) && isset($data->password) && isset($data->tipo_usuario)) {
                    $this->create($data->nombre, $data->apellido, $data->email, $data->password, $data->tipo_usuario);
                } else {
                    $this->sendJsonResponse(["message" => "Datos incompletos."]);
                }
                break;

            case 'GET':
                $this->read();
                break;

            case 'PUT':
                if (isset($data->id) && isset($data->nombre) && isset($data->apellido) && isset($data->email) && isset($data->tipo_usuario)) {
                    $this->update($data->id, $data->nombre, $data->apellido, $data->email, $data->tipo_usuario);
                } else {
                    $this->sendJsonResponse(["message" => "Datos incompletos."]);
                }
                break;

            case 'DELETE':
                if (isset($data->id)) {
                    $this->delete($data->id);
                } else {
                    $this->sendJsonResponse(["message" => "ID de usuario no proporcionado."]);
                }
                break;

            default:
                $this->sendJsonResponse(["message" => "Método no permitido."]);
                break;
        }
    }
}

$usuario = new Usuario();
$usuario->handleRequest();
