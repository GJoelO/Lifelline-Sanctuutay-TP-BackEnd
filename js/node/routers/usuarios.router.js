/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/usuario.controller");

//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allUsers);

// Para un producto
router.get('/:id_usuario', controller.showUser);


//// METODO PUT  ////
router.put('/:id_usuario', controller.updateUser);

//// METODO DELETE ////
router.delete('/:id_usuario', controller.destroyUser);

// EXPORTAR ROUTERS
module.exports = router;