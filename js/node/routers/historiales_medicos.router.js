/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/historiales_medicos.controller");

//// METODO GET  /////

// Para todos los historiales médicos
router.get('/', controller.todosHistorialesMedicos);

// Para un historial médico
router.get('/:id_historial', controller.mostrarHistorialMedico);

//// METODO POST  ////
router.post('/', controller.guardarHistorialMedico);

//// METODO PUT  ////
router.put('/:id_historial', controller.actualizarHistorialMedico);

//// METODO DELETE ////
router.delete('/:id_historial', controller.eliminarHistorialMedico);

// EXPORTAR ROUTERS
module.exports = router;