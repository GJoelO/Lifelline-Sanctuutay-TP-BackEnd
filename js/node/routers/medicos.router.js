/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/medicos.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allMedic);

// Para un producto
router.get('/:id_medico', controller.showMedic);

//// METODO POST  ////
router.post('/', controller.storeMedic);

//// METODO PUT  ////
router.put('/:id_medico', controller.updateMedic);

//// METODO DELETE ////
router.delete('/:id_medico', controller.destroyMedic);

// EXPORTAR ROUTERS
module.exports = router;

