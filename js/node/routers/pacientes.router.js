/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/pacientes.controller");

//// METODO GET  /////

// Para todos los pacientes
router.get('/', controller.allPatients);

// Para un paciente
router.get('/:id_paciente', controller.showPatient);

//// METODO POST  ////
router.post('/', controller.storePatient);

//// METODO PUT  ////
router.put('/:id_paciente', controller.updatePatient);

//// METODO DELETE ////
router.delete('/:id_paciente', controller.destroyPatient);

// EXPORTAR ROUTERS
module.exports = router;