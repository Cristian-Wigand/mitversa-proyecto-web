-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: mitversa
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `id_direccion` int unsigned NOT NULL AUTO_INCREMENT,
  `ciudad` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comuna` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calle` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id_direccion`),
  UNIQUE KEY `unique_direccion` (`ciudad`,`comuna`,`calle`,`numero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envio`
--

DROP TABLE IF EXISTS `envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envio` (
  `id_envio` int unsigned NOT NULL AUTO_INCREMENT,
  `estado_envio` enum('pendiente','en_transito','entregado','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_repartidor` int unsigned NOT NULL,
  `id_cliente` int unsigned NOT NULL,
  `fecha_pedido_inicio` datetime NOT NULL,
  `fecha_pedido_fin` datetime NOT NULL,
  `direccion_origen` int unsigned NOT NULL,
  `direccion_destino` int unsigned NOT NULL,
  `costo_total` int unsigned NOT NULL,
  PRIMARY KEY (`id_envio`),
  KEY `id_repartidor` (`id_repartidor`),
  KEY `id_cliente` (`id_cliente`),
  KEY `direccion_origen` (`direccion_origen`),
  KEY `direccion_destino` (`direccion_destino`),
  CONSTRAINT `envio_ibfk_1` FOREIGN KEY (`id_repartidor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `envio_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `envio_ibfk_3` FOREIGN KEY (`direccion_origen`) REFERENCES `direccion` (`id_direccion`),
  CONSTRAINT `envio_ibfk_4` FOREIGN KEY (`direccion_destino`) REFERENCES `direccion` (`id_direccion`),
  CONSTRAINT `envio_chk_1` CHECK ((`fecha_pedido_fin` > `fecha_pedido_inicio`)),
  CONSTRAINT `envio_chk_2` CHECK ((`direccion_origen` <> `direccion_destino`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envio`
--

LOCK TABLES `envio` WRITE;
/*!40000 ALTER TABLE `envio` DISABLE KEYS */;
/*!40000 ALTER TABLE `envio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_asignacion`
--

DROP TABLE IF EXISTS `historial_asignacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_asignacion` (
  `id_historial` int unsigned NOT NULL AUTO_INCREMENT,
  `id_repartidor` int unsigned NOT NULL,
  `id_vehiculo` int unsigned NOT NULL,
  `fecha_asignacion` datetime NOT NULL,
  `fecha_devolucion` datetime DEFAULT NULL,
  `kilometraje_inicial` decimal(10,2) NOT NULL,
  `kilometraje_final` decimal(10,2) DEFAULT NULL,
  `motivo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_repartidor` (`id_repartidor`),
  KEY `id_vehiculo` (`id_vehiculo`),
  CONSTRAINT `historial_asignacion_ibfk_1` FOREIGN KEY (`id_repartidor`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `historial_asignacion_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`),
  CONSTRAINT `historial_asignacion_chk_1` CHECK (((`fecha_devolucion` is null) or (`fecha_devolucion` > `fecha_asignacion`))),
  CONSTRAINT `historial_asignacion_chk_2` CHECK (((`kilometraje_final` is null) or (`kilometraje_final` >= `kilometraje_inicial`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_asignacion`
--

LOCK TABLES `historial_asignacion` WRITE;
/*!40000 ALTER TABLE `historial_asignacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_asignacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_envio`
--

DROP TABLE IF EXISTS `historial_envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_envio` (
  `id_historial` int unsigned NOT NULL AUTO_INCREMENT,
  `id_envio` int unsigned NOT NULL,
  `fecha` datetime NOT NULL,
  `detalles` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` int unsigned NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_envio` (`id_envio`),
  KEY `direccion` (`direccion`),
  CONSTRAINT `historial_envio_ibfk_1` FOREIGN KEY (`id_envio`) REFERENCES `envio` (`id_envio`),
  CONSTRAINT `historial_envio_ibfk_2` FOREIGN KEY (`direccion`) REFERENCES `direccion` (`id_direccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_envio`
--

LOCK TABLES `historial_envio` WRITE;
/*!40000 ALTER TABLE `historial_envio` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_envio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidencia`
--

DROP TABLE IF EXISTS `incidencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencia` (
  `id_incidencia` int unsigned NOT NULL AUTO_INCREMENT,
  `id_envio` int unsigned NOT NULL,
  `fecha` datetime NOT NULL,
  `tipo_incidencia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_incidencia`),
  KEY `id_envio` (`id_envio`),
  CONSTRAINT `incidencia_ibfk_1` FOREIGN KEY (`id_envio`) REFERENCES `envio` (`id_envio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencia`
--

LOCK TABLES `incidencia` WRITE;
/*!40000 ALTER TABLE `incidencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `incidencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `mensaje` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_cliente` int unsigned NOT NULL,
  `id_envio` int unsigned NOT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_envio` (`id_envio`),
  CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`id_envio`) REFERENCES `envio` (`id_envio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquete`
--

DROP TABLE IF EXISTS `paquete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquete` (
  `id_paquete` int unsigned NOT NULL AUTO_INCREMENT,
  `id_envio` int unsigned NOT NULL,
  `peso` int unsigned NOT NULL,
  `largo` int unsigned NOT NULL,
  `ancho` int unsigned NOT NULL,
  `alto` int unsigned NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_paquete`),
  KEY `id_envio` (`id_envio`),
  CONSTRAINT `paquete_ibfk_1` FOREIGN KEY (`id_envio`) REFERENCES `envio` (`id_envio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquete`
--

LOCK TABLES `paquete` WRITE;
/*!40000 ALTER TABLE `paquete` DISABLE KEYS */;
/*!40000 ALTER TABLE `paquete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_usuario` enum('cliente','gerente','repartidor') COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_creado_el` datetime NOT NULL,
  `usuario_actualizado_el` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `usuario_chk_1` CHECK (((`usuario_actualizado_el` is null) or (`usuario_actualizado_el` > `usuario_creado_el`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculo`
--

DROP TABLE IF EXISTS `vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculo` (
  `id_vehiculo` int unsigned NOT NULL AUTO_INCREMENT,
  `matricula` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modelo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('disponible','no_disponible') COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehiculo_creado_el` datetime NOT NULL,
  `vehiculo_actualizado_el` datetime DEFAULT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE KEY `matricula` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculo`
--

LOCK TABLES `vehiculo` WRITE;
/*!40000 ALTER TABLE `vehiculo` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehiculo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-21  2:17:00
