/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/medicamentos.controller");

//// METODO GET  /////

// Para todos los medicamentos
router.get('/', controller.todosMedicamentos);

// Para un medicamento
router.get('/:id_medicamento', controller.mostrarMedicamento);

//// METODO POST  ////
router.post('/', controller.guardarMedicamento);

//// METODO PUT  ////
router.put('/:id_medicamento', controller.actualizarMedicamento);

//// METODO DELETE ////
router.delete('/:id_medicamento', controller.eliminarMedicamento);

// EXPORTAR ROUTERS
module.exports = router;