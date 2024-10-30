/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/departamentos.controller");

//// METODO GET  /////

// Para todos los departamentos
router.get('/', controller.todosDepartamentos);

// Para un departamento
router.get('/:id_departamento', controller.mostrarDepartamento);

//// METODO POST  ////
router.post('/', controller.guardarDepartamento);

//// METODO PUT  ////
router.put('/:id_departamento', controller.actualizarDepartamento);

//// METODO DELETE ////
router.delete('/:id_departamento', controller.eliminarDepartamento);

// EXPORTAR ROUTERS
module.exports = router;