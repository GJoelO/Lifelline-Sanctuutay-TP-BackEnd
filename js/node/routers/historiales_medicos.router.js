/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/historiales_medicos.controller");

//// METODO GET  /////

// Para todos los historiales médicos
router.get('/', controller.allMedicalRecords);

// Para un historial médico
router.get('/:id_HistMedic', controller.showMedicalRecord);

//// METODO POST  ////
router.post('/', controller.storeMedicalRecord);

//// METODO PUT  ////
router.put('/:id_HistMedic', controller.updateMedicalRecord);

//// METODO DELETE ////
router.delete('/:id_HistMedic', controller.destroyMedicalRecord);

// EXPORTAR ROUTERS
module.exports = router;