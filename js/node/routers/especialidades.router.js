/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/especialidades.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allSpecialty);

// Para un producto
router.get('/:id_especialidad', controller.showSpecialty);

//// METODO POST  ////
router.post('/', controller.storeSpecialty);

//// METODO PUT  ////
router.put('/:id_especialidad', controller.updateSpecialty);

//// METODO DELETE ////
router.delete('/:id_especialidad', controller.destroySpecialty);

// EXPORTAR ROUTERS
module.exports = router;