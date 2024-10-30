/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/habitaciones.controller");

//// METODO GET  /////

// Para todas las habitaciones
router.get('/', controller.todasHabitaciones);

// Para una habitación
router.get('/:id_habitacion', controller.mostrarHabitacion);

//// METODO POST  ////
router.post('/', controller.guardarHabitacion);

//// METODO PUT  ////
router.put('/:id_habitacion', controller.actualizarHabitacion);

//// METODO DELETE ////
router.delete('/:id_habitacion', controller.eliminarHabitacion);

// EXPORTAR ROUTERS
module.exports = router;