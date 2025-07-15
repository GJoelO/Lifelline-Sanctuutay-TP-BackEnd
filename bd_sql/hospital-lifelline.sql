-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-07-2025 a las 17:24:04
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
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `imagen_especialidad` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `imagen_especialidad`, `descripcion`) VALUES
(1, 'Oftalmologia', '1749697521538.jpg', 'La oftalmología es la rama de la medicina que se dedica al estudio, diagnóstico y tratamiento de las enfermedades y trastornos relacionados con los ojos y la visión. Los oftalmólogos son especialistas médicos que pueden realizar exámenes oculares, diagnosticar problemas visuales, recetar medicamentos y realizar procedimientos quirúrgicos para tratar afecciones oculares.'),
(3, 'Dermatología', '1749697542287.jpg', 'La dermatología es una rama de la medicina que se enfoca en el estudio, diagnóstico, tratamiento y prevención de enfermedades y afecciones de la piel, el cabello y las uñas. Los dermatólogos son los especialistas que se encargan de este cuidado.'),
(4, 'Ginecología y obstetricia', '1749697679476.webp', 'La Ginecología y Obstetricia es una especialidad médica que se enfoca en la salud reproductiva femenina y la atención del embarazo y el parto. Abarca tanto la prevención, diagnóstico y tratamiento de enfermedades del aparato reproductor femenino, como el cuidado integral durante el embarazo, el parto y el puerperio.'),
(5, 'Pediatría', '1749697709602.jpg', 'La pediatría es la rama de la medicina que se dedica a la salud y el cuidado de los niños y adolescentes, desde su nacimiento hasta el final de la adolescencia. Su objetivo principal es prevenir, diagnosticar y tratar enfermedades y trastornos que pueden afectar el desarrollo y bienestar de los niños.'),
(6, 'Odontología', '1749697733301.jpg', 'La odontología es la especialidad médica que se dedica al estudio, diagnóstico, prevención y tratamiento de enfermedades y trastornos que afectan los dientes, encías, boca y mandíbula. Se enfoca en la salud bucal, incluyendo la estética, la función y el bienestar general relacionado con la boca.'),
(7, 'Cardiologia', '1750285128556.jpg', 'La cardiología es la rama de la medicina que se ocupa del estudio, diagnóstico, tratamiento y prevención de las enfermedades del corazón y del sistema circulatorio. Los cardiólogos son los médicos especialistas en esta área y se encargan de atender problemas como enfermedades coronarias, arritmias, insuficiencia cardíaca.'),
(8, 'Otorrinolaringología', '1749697797475.jpg', 'La otorrinolaringología es la especialidad médica y quirúrgica que se enfoca en las afecciones del oído, la nariz y la garganta, así como en las funciones que se derivan de estas. Incluye la prevención, diagnóstico, tratamiento y rehabilitación de enfermedades que afectan la audición, la respiración, el olfato, el equilibrio y la deglución.'),
(9, 'Traumatología y Ortopedia', '1749697823100.jpg', 'La traumatología y ortopedia es la especialidad médica que se dedica al estudio, diagnóstico y tratamiento de afecciones del sistema musculoesquelético, que incluye huesos, articulaciones, músculos, tendones y ligamentos. Se enfoca en lesiones traumáticas (fracturas, luxaciones), enfermedades congénitas y degenerativas (como artrosis), infecciones, y lesiones tumorales.'),
(10, 'Urología', '1749697844772.jpg', 'La urología es la especialidad médica que se enfoca en el diagnóstico y tratamiento de enfermedades y problemas relacionados con el sistema urinario y el aparato reproductor masculino, tanto en hombres como en mujeres. Incluye la prevención, diagnóstico y tratamiento de enfermedades renales, del tracto urinario, y del aparato genital masculino.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id_genero` bigint(20) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id_genero`, `descripcion`) VALUES
(1, 'Masculino'),
(2, 'Femenino'),
(3, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` bigint(20) NOT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `piso` varchar(10) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `imagen_habitacion` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id_habitacion`, `numero`, `tipo`, `piso`, `estado`, `imagen_habitacion`, `descripcion`) VALUES
(1, '404', 'Grande', '1', 'disponible', '1749698420652.jpg', 'Una habitación grande de hospital está diseñada para alojar a múltiples pacientes, generalmente cuatro o más, en un mismo espacio. Cuenta con varias camillas separadas por cortinas o biombos para brindar privacidad, además de equipamiento médico básico junto a cada unidad, como soportes para suero, monitores de signos vitales y mesitas móviles. La iluminación es abundante y el ambiente está climatizado, garantizando condiciones óptimas de higiene, comodidad y atención médica.'),
(2, '101', 'Chica', '1', 'mantenimiento', '1749698509898.jpeg', 'Una habitación chica de hospital es un espacio individual destinado a un solo paciente. Cuenta con una única camilla y está equipada con los elementos esenciales para su atención, como una mesa de luz, soporte para suero, monitor de signos vitales y baño privado en muchos casos. Ofrece mayor privacidad, tranquilidad y comodidad, siendo ideal para pacientes que requieren observación más personalizada o condiciones especiales de aislamiento.'),
(3, '202', 'Mediana', '1', 'ocupada', '1749698599711.jpg', 'Una habitación mediana de hospital está diseñada para alojar entre dos y tres pacientes. Dispone de camillas distribuidas con suficiente espacio entre ellas, separadas por cortinas o biombos para mantener cierta privacidad. Cada puesto cuenta con equipamiento básico como soporte para suero, toma de oxígeno y mesita auxiliar. Este tipo de habitación ofrece un equilibrio entre atención personalizada y uso eficiente del espacio hospitalario.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historiales_medicos`
--

CREATE TABLE `historiales_medicos` (
  `id_HistMedic` bigint(20) NOT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `especialidad_id` bigint(20) DEFAULT NULL,
  `medico_id` bigint(20) DEFAULT NULL,
  `habitacion_id` bigint(20) DEFAULT NULL,
  `comprobante` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hospital`
--

CREATE TABLE `hospital` (
  `id_hospital` bigint(20) NOT NULL,
  `imagen_hospital` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hospital`
--

INSERT INTO `hospital` (`id_hospital`, `imagen_hospital`, `descripcion`) VALUES
(2, 'hospital-1750133026763-761032181.jpg', 'Acerca de Nuestro Hospital\r\nComprometidos con tu salud, presentes en todo el país.\r\n\r\nNos enorgullece anunciar la apertura de nuestro nuevo Hospital Central en Buenos Aires, un paso fundamental para llevar atención médica de calidad a cada provincia de Argentina.\r\n\r\nDesde nuestra sede original en Wapusk, Canadá, trabajamos con dedicación para brindar una atención humana, profesional y accesible, y hoy, con clínicas distribuidas por todo el país, reafirmamos nuestro compromiso con el bienestar de cada paciente.\r\n\r\nUna identidad con historia\r\nNuestro logo, un oso, representa fuerza, protección y vigilancia constante. En Wapusk cuyo nombre significa “oso polar” hemos convivido durante años con estos majestuosos animales. Esa experiencia nos enseñó el valor del respeto, la atención y el cuidado, valores que hoy trasladamos al ámbito de la salud. El oso es, para nosotros, un recordatorio de nuestro compromiso de proteger y acompañar siempre a quienes confían en nuestro hospital.\r\n\r\nNuestra misión\r\nEn cada clínica, en cada consulta, y en cada gesto, reafirmamos nuestro propósito:\r\nCuidar tu salud, acompañarte en cada etapa de la vida, y estar cuando más nos necesitás.\r\n\r\n¡Gracias por confiar en nosotros!');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` bigint(20) NOT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  `estado` enum('libre','ocupado') DEFAULT 'libre',
  `especialidad_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `usuario_id`, `estado`, `especialidad_id`) VALUES
(2, 3, 'libre', 1),
(3, 5, 'libre', 3),
(4, 6, 'libre', 6),
(5, 10, 'libre', 4),
(6, 7, 'libre', 9),
(7, 8, 'libre', 7),
(8, 9, 'libre', 5),
(9, 11, 'libre', 8),
(10, 12, 'libre', 10),
(11, 13, 'ocupado', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id_OS` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id_OS`, `nombre`, `codigo`) VALUES
(1, 'OSDE', NULL),
(2, 'IOMA', NULL),
(3, 'IOSFA', NULL),
(4, 'OSECAC', NULL),
(5, 'OSPAT', NULL),
(6, 'Sancor Salud', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_usuario`
--

CREATE TABLE `perfil_usuario` (
  `id_perfil` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `genero_id` bigint(20) DEFAULT NULL,
  `cuil` varchar(20) DEFAULT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `numero` varchar(10) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `barrio` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(3, 'administrador'),
(4, 'dueño'),
(2, 'medico'),
(1, 'paciente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` bigint(20) NOT NULL,
  `usuario_id` bigint(20) DEFAULT NULL,
  `medico_id` bigint(20) DEFAULT NULL,
  `especialidad_id` bigint(20) DEFAULT NULL,
  `obra_social_id` bigint(20) DEFAULT NULL,
  `habitacion_id` bigint(20) DEFAULT NULL,
  `fecha_turno` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `usuario_id`, `medico_id`, `especialidad_id`, `obra_social_id`, `habitacion_id`, `fecha_turno`) VALUES
(1, 1, 2, 1, 5, 1, '2025-06-30'),
(2, 15, 3, 3, 2, 1, '2025-07-25'),
(3, 15, 3, 3, 3, 1, '2025-07-25'),
(4, 15, 3, 3, 4, 1, '2025-07-25'),
(5, 15, 5, 4, 2, 1, '2025-07-26'),
(6, 16, 3, 3, 4, 1, '2025-07-25'),
(7, 16, 4, 6, 3, 1, '2025-07-25'),
(8, 16, 9, 8, 2, 1, '2025-07-25'),
(9, 15, 7, 7, 3, 1, '2025-07-24'),
(10, 17, 7, 7, 5, 1, '2025-07-28'),
(11, 16, 7, 7, 2, 1, '2025-07-28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `rol_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `dni`, `email`, `telefono`, `contrasena`, `foto_perfil`, `fecha_creacion`, `rol_id`) VALUES
(1, 'Daniela', 'Protoc', '29483547', 'DanielaProtoc@gmail.com', '1145963256', '$2a$08$vNTs9MW6b3.lCu2GIgHSqO1ZvgTNxiICgqmw9mY3.D.O1vi/7xcW6', '1749689921458.png', '2025-06-12 00:57:33', 1),
(2, 'Jorge', 'Mendez', '21589632', 'JorgeMendez@gmail.com', '1185964563', '$2a$08$ZGXLYBK0PYRXmW4xbst9buE9/fifYQxCAPHvLWJnFkptuANb2SVPq', '1749690224517.png', '2025-06-12 01:03:44', 3),
(3, 'Pablo', 'Pascual', '20896354', 'PPascual@gmail.com', '1156853241', '$2a$08$MOlbm3LS.GkmBrI5fq.ALu6fu7MYzTMp/cSusjrvgtvoZmr/Aa7O.', '1750116609261.png', '2025-06-12 01:12:04', 2),
(4, 'Joel', 'Mansilla', '35689421', 'MansillaJoel@gmail.com', '1125586140', '$2a$08$rr4libRMRFlm341phQwKpeh0ZMQZIRRcN7.Sv/352x5NeXxzgQQGm', '1749863370770.png', '2025-06-14 01:09:30', 1),
(5, 'Douglas', 'Vaughan', '26589431', 'DouglasVaughan@hotmail.com', '119574 5946', '$2a$08$Wgxsh/WhKHHd5L4n8GDF0ODsV4pscLFEj4gd6gEJjYgSIz4FqXPjG', '1750283932396.png', '2025-06-18 21:58:52', 2),
(6, 'Gregory', 'Judd', '21846321', 'GregoryJudd@superrito.com', '119687 6492', '$2a$08$RO0p3WZo.EpA0FO3L4IKJ.HIOIrJwSkSaNGDH712WXHwHktUZvynm', '1750284022804.png', '2025-06-18 22:00:22', 2),
(7, 'Michael', 'Williams', '24569874', 'MichaelWilliams@gustr.com', '1198138930', '$2a$08$7wLZ82v9THjxz6fx8e7EL.J6Awz9kR63i8jmffTQkefVZm1mtx1zO', '1750284113336.png', '2025-06-18 22:01:53', 2),
(8, 'John', 'Blackwell', '25598056', 'JohnBlackwell@yahoo.com', '1199236501', '$2a$08$XfZBTknFQlhDesaPBmiZP.9EoBTOmUkSpzHo/K.VXftoh0ktLjg6u', '1750284204162.png', '2025-06-18 22:03:24', 2),
(9, 'Thais', 'Fuentes Leiva', '28963201', 'ThaisFuentesLeiva@yahoo.com', '1197116187', '$2a$08$SXExLHo1KdHtgnmKKrjwFeuXYUQ9aTUq6qkG2wI6cnOn0rbEAvrHO', '1750284332048.png', '2025-06-18 22:05:32', 2),
(10, 'Maria', 'Ribeiro Pereira', '28741103', 'MariaRibeiroPereira@gmail.com', '1199682999', '$2a$08$VoO7i6MoFMWZiK68bEmaXORd0mf3LKmgSw3qZCOyjtiS1hZa204MC', '1750284439189.png', '2025-06-18 22:07:19', 2),
(11, 'Laura', 'Barros Santos', '29563002', 'LauraBarrosSantos@yahoo.com', '1198611829', '$2a$08$g2A4ezPPSlz9MF32miI//ey3YiCcIkuDEguA1zKZ4JTvUkunPGSma', '1750284525802.png', '2025-06-18 22:08:45', 2),
(12, 'Marina', 'Fernandes', '30102005', 'MarinaFernandes@hotmail.com', '1191140138', '$2a$08$pLbLv5FYWtzt5Mf4HEdSO.N0GdHDpErTq8a8lT6fU8JLR7Lj/gPb2', '1750284618795.png', '2025-06-18 22:10:18', 2),
(13, 'Vitória', 'Costa Cardoso', '34890761', 'VitoriaCostaCardoso@hotmail.com', '1199277437', '$2a$08$5b3wVA6/8B0myv1JzrrcaeJVt8S7FKrLU/r618/i6ej3bacy9MOTa', '1750284700984.png', '2025-06-18 22:11:41', 2),
(14, 'Evelyn', 'Pinto', '38203841', 'EvelynPinto@gmail.com', '1174884926', '$2a$08$HQV.q3wwDhfJx5kObB.ppeDV7xmstNJg0xsftNZBW04MAMWzTNv/6', '1750285475980.png', '2025-06-18 22:24:35', 1),
(15, 'Dueño', 'Hospital', '18256934', 'soportehospital4@gmail.com', '1147365702', '$2a$08$QkRqMLCwHq.idJXOL4kuUOQSSW/ohkUD6Y06PqDgU4Ep0uyJflh0q', '1752343005519.png', '2025-07-12 17:56:45', 4),
(16, 'Gaston', 'Joel', '25478936', '45127041@ifts24.edu.ar', '1185624130', '$2a$08$gsjc0tY.X6ShN6wWT5hi4eoKaPM7jg553tOW.qOJ/MnNIAacvDNI2', '1752353005021.png', '2025-07-12 20:43:25', 1),
(17, 'Manuel', 'Gomez', '24635894', 'ManuelGomez@gmail.ocm', '1134924120', '$2a$08$6E8U5Y9H4WfAkGb0VjOR2uuRZSM6hk2kgCJoiK.gI5iB78pw7SFjq', '1752542418305.png', '2025-07-15 01:20:18', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`);

--
-- Indices de la tabla `historiales_medicos`
--
ALTER TABLE `historiales_medicos`
  ADD PRIMARY KEY (`id_HistMedic`),
  ADD KEY `fk_usuario_hm` (`usuario_id`),
  ADD KEY `fk_especialidad_hm` (`especialidad_id`),
  ADD KEY `fk_medico_hm` (`medico_id`),
  ADD KEY `fk_habitacion_hm` (`habitacion_id`);

--
-- Indices de la tabla `hospital`
--
ALTER TABLE `hospital`
  ADD PRIMARY KEY (`id_hospital`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD KEY `fk_usuario_medico` (`usuario_id`),
  ADD KEY `fk_especialidad_medico` (`especialidad_id`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id_OS`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD PRIMARY KEY (`id_perfil`),
  ADD UNIQUE KEY `uk_usuario` (`usuario_id`),
  ADD KEY `genero_id` (`genero_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `fk_usuario_turno` (`usuario_id`),
  ADD KEY `fk_medico_turno` (`medico_id`),
  ADD KEY `fk_especialidad_turno` (`especialidad_id`),
  ADD KEY `fk_obra_social_turno` (`obra_social_id`),
  ADD KEY `fk_habitacion_turno` (`habitacion_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_rol_usuario` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id_genero` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `historiales_medicos`
--
ALTER TABLE `historiales_medicos`
  MODIFY `id_HistMedic` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `hospital`
--
ALTER TABLE `hospital`
  MODIFY `id_hospital` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id_OS` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  MODIFY `id_perfil` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `historiales_medicos`
--
ALTER TABLE `historiales_medicos`
  ADD CONSTRAINT `fk_especialidad_hm` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_habitacion_hm` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id_habitacion`),
  ADD CONSTRAINT `fk_medico_hm` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_usuario_hm` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_especialidad_medico` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_usuario_medico` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `perfil_usuario`
--
ALTER TABLE `perfil_usuario`
  ADD CONSTRAINT `perfil_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `perfil_usuario_ibfk_2` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id_genero`);

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `fk_especialidad_turno` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_habitacion_turno` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id_habitacion`),
  ADD CONSTRAINT `fk_medico_turno` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_obra_social_turno` FOREIGN KEY (`obra_social_id`) REFERENCES `obras_sociales` (`id_OS`),
  ADD CONSTRAINT `fk_usuario_turno` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_rol_usuario` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
