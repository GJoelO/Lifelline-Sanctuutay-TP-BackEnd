/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/medicamentos.controller");

//// METODO GET  /////

// Para todos los medicamentos
router.get('/', controller.allMedications);

// Para un medicamento
router.get('/:id_medicamento', controller.showMedication);

//// METODO POST  ////
router.post('/', controller.storeMedication);

//// METODO PUT  ////
router.put('/:id_medicamento', controller.updateMedication);

//// METODO DELETE ////
router.delete('/:id_medicamento', controller.destroyMedication);

// EXPORTAR ROUTERS
module.exports = router;