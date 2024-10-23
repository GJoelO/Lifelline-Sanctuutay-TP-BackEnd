/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/profesiones.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allProfession);

// Para un producto
router.get('/:id_profesion', controller.showProfession);

//// METODO POST  ////
router.post('/', controller.storeProfession);

//// METODO PUT  ////
router.put('/:id_profesion', controller.updateProfession);

//// METODO DELETE ////
router.delete('/:id_profesion', controller.destroyProfession);

// EXPORTAR ROUTERS
module.exports = router;