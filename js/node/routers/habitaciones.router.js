/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/habitaciones.controller");

//// METODO GET  /////

// Para todas las habitaciones
router.get('/', controller.allRooms);

// Para una habitación
router.get('/:id_habitacion', controller.showRoom);

//// METODO POST  ////
router.post('/', controller.storeRoom);

//// METODO PUT  ////
router.put('/:id_habitacion', controller.updateRoom);

//// METODO DELETE ////
router.delete('/:id_habitacion', controller.destroyRoom);

// EXPORTAR ROUTERS
module.exports = router;