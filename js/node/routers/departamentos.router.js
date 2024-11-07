/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/departamentos.controller");

//// METODO GET  /////

// Para todos los departamentos
router.get('/', controller.allDepartments);

// Para un departamento
router.get('/:id_departamento', controller.showDepartment);

//// METODO POST  ////
router.post('/', controller.storeDepartment);

//// METODO PUT  ////
router.put('/:id_departamento', controller.updateDepartment);

//// METODO DELETE ////
router.delete('/:id_departamento', controller.destroyDepartment);

// EXPORTAR ROUTERS
module.exports = router;