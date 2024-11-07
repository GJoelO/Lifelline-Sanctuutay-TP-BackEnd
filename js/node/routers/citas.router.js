/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/citas.controller");

//// METODO GET  /////

// Para todas las citas
router.get('/', controller.allAppointments);

// Para una cita
router.get('/:id_cita', controller.showAppointment);

//// METODO POST  ////
router.post('/', controller.storeAppointment);

//// METODO PUT  ////
router.put('/:id_cita', controller.updateAppointment);

//// METODO DELETE ////
router.delete('/:id_cita', controller.destroyAppointment);

// EXPORTAR ROUTERS
module.exports = router;