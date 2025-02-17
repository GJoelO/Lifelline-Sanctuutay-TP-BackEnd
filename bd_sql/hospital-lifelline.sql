-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-02-2025 a las 23:03:43
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
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id_cita` int(10) NOT NULL,
  `fk_paciente` int(10) NOT NULL,
  `fk_medico` int(10) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo` varchar(100) NOT NULL,
  `estado` enum('Programada','Completada','Cancelada') NOT NULL DEFAULT 'Programada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id_cita`, `fk_paciente`, `fk_medico`, `fecha_hora`, `motivo`, `estado`) VALUES
(11, 1, 1, '2024-11-07 01:57:27', 'Consulta de rutina', 'Programada'),
(12, 2, 3, '2024-11-09 18:42:13', 'Revisión pediátrica', 'Completada'),
(14, 4, 6, '2024-11-07 01:57:27', 'Revisión de oídos', 'Programada'),
(15, 5, 8, '2024-11-07 01:57:27', 'Consulta urológica', 'Programada'),
(17, 2, 3, '2024-11-09 18:38:44', 'Consulta de rutina', 'Cancelada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `nombre`, `descripcion`) VALUES
(2, 'Ginecología y obstetricia', 'Atención médica para niños y adolescentes ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(10) NOT NULL,
  `especialidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `especialidad`) VALUES
(1, 'Dermatología'),
(2, 'Ginecología y obstetricia'),
(3, 'Pediatría'),
(4, 'Odontología'),
(5, 'Oftalmología'),
(6, 'Otorrinolaringología'),
(7, 'Traumatología y Ortopedia'),
(8, 'Urología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` int(10) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `tipo` enum('Individual','Doble','Suite') NOT NULL,
  `estado` enum('Disponible','Ocupada','En mantenimiento') NOT NULL DEFAULT 'Disponible',
  `precio_por_dia` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id_habitacion`, `numero`, `tipo`, `estado`, `precio_por_dia`) VALUES
(1, '101', 'Individual', 'Ocupada', 100.00),
(2, '102', 'Doble', 'Ocupada', 150.00),
(3, '103', 'Suite', 'Disponible', 250.00),
(4, '201', 'Individual', 'En mantenimiento', 100.00),
(5, '202', 'Doble', 'Disponible', 150.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialesmedicos`
--

CREATE TABLE `historialesmedicos` (
  `id_historial` int(10) NOT NULL,
  `fk_paciente` int(10) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `notas_adicionales` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `historialesmedicos`
--

INSERT INTO `historialesmedicos` (`id_historial`, `fk_paciente`, `fecha_creacion`, `diagnostico`, `tratamiento`, `notas_adicionales`) VALUES
(1, 1, '2024-11-06 22:58:05', 'Dermatitis atópica', 'Crema hidratante y corticosteroides tópicos', 'Seguimiento en 1 semanas'),
(2, 2, '2024-11-06 22:58:05', 'Otitis media', 'Antibióticos orales', 'Revisión en 7 días'),
(3, 3, '2024-11-06 22:58:05', 'Caries dental', 'Empaste dental', 'Programar limpieza en 6 meses'),
(4, 4, '2024-11-06 22:58:05', 'Sinusitis crónica', 'Spray nasal con corticosteroides', 'Considerar cirugía si no mejora'),
(5, 5, '2024-11-06 22:58:05', 'Infección del tracto urinario', 'Antibióticos', 'Aumentar ingesta de líquidos'),
(6, 1, '2024-11-09 16:49:41', 'Ginecología y obstetricia', 'Control de Ovarios', 'Seguimiento en 1 mes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id_medicamento` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `dosis_recomendada` varchar(50) NOT NULL,
  `efectos_secundarios` text DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`id_medicamento`, `nombre`, `descripcion`, `dosis_recomendada`, `efectos_secundarios`, `stock`) VALUES
(1, 'Paracetamol', 'Analgésico y antipirético', '500mg cada 6 horas', 'Raros en dosis recomendadas', 1000),
(2, 'Amoxicilina', 'Antibiótico de amplio espectro', '500mg cada 8 horas', 'Náuseas, diarrea', 500),
(3, 'Ibuprofeno', 'Antiinflamatorio no esteroideo', '400mg cada 6-8 horas', 'Molestias gastrointestinales', 550),
(4, 'Omeprazol', 'Inhibidor de la bomba de protones', '20mg una vez al día', 'Dolor de cabeza, náuseas', 300),
(5, 'Loratadina', 'Antihistamínico', '10mg una vez al día', 'Somnolencia leve', 400);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(10) NOT NULL,
  `fk_especialidad` int(10) NOT NULL,
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

INSERT INTO `medicos` (`id_medico`, `fk_especialidad`, `apellido`, `nombre`, `edad`, `email`, `telefono`, `años_ejerciendo`) VALUES
(1, 1, 'Pérez', 'Juan', 40, 'juan.perez@email.com', '5555-1234', 10),
(3, 3, 'López', 'Carlos', 35, 'carlos.lopez@email.com', '5555-8765', 7),
(4, 4, 'Martínez', 'Ana', 38, 'ana.martinez@email.com', '5555-4321', 12),
(5, 5, 'Sánchez', 'Luis', 28, 'luis.sanchez@email.com', '5555-1111', 4),
(6, 6, 'Ramírez', 'Laura', 33, 'laura.ramirez@email.com', '5555-2222', 8),
(7, 7, 'Fernández', 'Javier', 42, 'javier.fernandez@email.com', '5555-3333', 6),
(8, 8, 'Hernández', 'Patricia', 31, 'patricia.hernandez@email.com', '5555-4444', 3),
(9, 1, 'Morales', 'Diego', 39, 'diego.morales@email.com', '5555-5555', 9),
(10, 2, 'Torres', 'Carmen', 40, 'carmen.torres@email.com', '5555-6666', 11),
(11, 2, 'Perez', 'Gonzalo', 55, 'Perez-Gonzalo@email.com', '5555-8547', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(10) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('Masculino','Femenino','Otro') NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `grupo_sanguineo` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `apellido`, `nombre`, `fecha_nacimiento`, `genero`, `direccion`, `telefono`, `email`, `grupo_sanguineo`) VALUES
(1, 'García', 'María', '1990-05-15', 'Femenino', 'Calle Principal 123', '5555-9876', 'maria.garcia@email.com', 'O+'),
(2, 'Rodríguez', 'Carlos', '2015-08-20', 'Masculino', 'Avenida Central 456', '5555-5678', 'carlos.rodriguez@email.com', 'A-'),
(3, 'Martínez', 'Ana', '1985-12-10', 'Femenino', 'Plaza Mayor 789', '5555-4321', 'ana.martinez@email.com', 'B+'),
(4, 'López', 'Juan', '1978-03-25', 'Masculino', 'Calle Secundaria 321', '5555-8765', 'juan.lopez@email.com', 'O+'),
(5, 'Fernández', 'Laura', '2000-07-30', 'Femenino', 'Avenida del Parque 654', '5555-2345', 'laura.fernandez@email.com', 'O-');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `apellido_usuario` varchar(50) NOT NULL,
  `nick` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefono_usuario` varchar(15) NOT NULL,
  `contrasenia_usuario` varchar(70) NOT NULL,
  `foto_perfil` varchar(255) NOT NULL,
  `fecha_usuario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `dni`, `nombre_usuario`, `apellido_usuario`, `nick`, `email`, `telefono_usuario`, `contrasenia_usuario`, `foto_perfil`, `fecha_usuario`) VALUES
(7, '', 'Jorge Daniel 3 ', '', '', 'JD3@gmail.com', '1548-5633', '$2a$10$LsKP3XrZqUa.D2nqi1/3QuLEjjIuCGbf2AVrg3gu5bkZ6fv4BYCoS', '1731274425812.png', '2024-11-10 21:33:01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `fk_paciente` (`fk_paciente`),
  ADD KEY `fk_medico` (`fk_medico`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`);

--
-- Indices de la tabla `historialesmedicos`
--
ALTER TABLE `historialesmedicos`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `fk_paciente` (`fk_paciente`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id_medicamento`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD KEY `fk_medico_profesion` (`fk_especialidad`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `historialesmedicos`
--
ALTER TABLE `historialesmedicos`
  MODIFY `id_historial` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id_medicamento` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`fk_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`fk_medico`) REFERENCES `medicos` (`id_medico`);

--
-- Filtros para la tabla `historialesmedicos`
--
ALTER TABLE `historialesmedicos`
  ADD CONSTRAINT `historialesmedicos_ibfk_1` FOREIGN KEY (`fk_paciente`) REFERENCES `pacientes` (`id_paciente`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medico_profesion` FOREIGN KEY (`fk_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
