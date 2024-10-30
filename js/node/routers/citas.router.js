/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/citas.controller");

//// METODO GET  /////

// Para todas las citas
router.get('/', controller.todasLasCitas);

// Para una cita
router.get('/:id_cita', controller.mostrarCita);

//// METODO POST  ////
router.post('/', controller.guardarCita);

//// METODO PUT  ////
router.put('/:id_cita', controller.actualizarCita);

//// METODO DELETE ////
router.delete('/:id_cita', controller.eliminarCita);

// EXPORTAR ROUTERS
module.exports = router;