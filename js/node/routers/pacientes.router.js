/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/pacientes.controller");

//// METODO GET  /////

// Para todos los pacientes
router.get('/', controller.todosLosPacientes);

// Para un paciente
router.get('/:id_paciente', controller.mostrarPaciente);

//// METODO POST  ////
router.post('/', controller.guardarPaciente);

//// METODO PUT  ////
router.put('/:id_paciente', controller.actualizarPaciente);

//// METODO DELETE ////
router.delete('/:id_paciente', controller.eliminarPaciente);

// EXPORTAR ROUTERS
module.exports = router;