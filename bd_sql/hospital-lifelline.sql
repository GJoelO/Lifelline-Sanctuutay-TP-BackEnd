-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-10-2024 a las 04:57:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospital-lifelline`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(10) NOT NULL,
  `fk_profesion` int(10) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `edad` tinyint(3) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `años_ejerciendo` tinyint(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `fk_profesion`, `apellido`, `nombre`, `edad`, `email`, `telefono`, `años_ejerciendo`) VALUES
(1, 1, 'Pérez', 'Juan', 40, 'juan.perez@email.com', '5555-1234', 10),
(3, 3, 'López', 'Carlos', 35, 'carlos.lopez@email.com', '5555-8765', 7),
(4, 4, 'Martínez', 'Ana', 38, 'ana.martinez@email.com', '5555-4321', 12),
(5, 5, 'Sánchez', 'Luis', 28, 'luis.sanchez@email.com', '5555-1111', 4),
(6, 6, 'Ramírez', 'Laura', 33, 'laura.ramirez@email.com', '5555-2222', 8),
(7, 7, 'Fernández', 'Javier', 42, 'javier.fernandez@email.com', '5555-3333', 6),
(8, 8, 'Hernández', 'Patricia', 31, 'patricia.hernandez@email.com', '5555-4444', 3),
(9, 1, 'Morales', 'Diego', 39, 'diego.morales@email.com', '5555-5555', 9),
(10, 2, 'Torres', 'Carmen', 40, 'carmen.torres@email.com', '5555-6666', 11),
(11, 2, 'Perez', 'Gonzalo', 50, 'Perez-Gonzalo@email.com', '5555-8547', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesiones`
--

CREATE TABLE `profesiones` (
  `id_profesion` int(10) NOT NULL,
  `profesion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `profesiones`
--

INSERT INTO `profesiones` (`id_profesion`, `profesion`) VALUES
(1, 'Dermatología'),
(2, 'Ginecología y obstetricia'),
(3, 'Pediatría'),
(4, 'Odontología'),
(5, 'Oftalmología'),
(6, 'Otorrinolaringología'),
(7, 'Traumatología y Ortopedia'),
(8, 'Urología');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`);

--
-- Indices de la tabla `profesiones`
--
ALTER TABLE `profesiones`
  ADD PRIMARY KEY (`id_profesion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `profesiones`
--
ALTER TABLE `profesiones`
  MODIFY `id_profesion` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
