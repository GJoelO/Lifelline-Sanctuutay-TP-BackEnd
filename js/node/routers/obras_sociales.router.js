/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/obras_sociales.controller");

//// METODO GET  /////

// Para todos las obra social
router.get('/', controller.allSocialWorks);

// Para un obra social
router.get('/:id_OS', controller.showSocialWork);

//// METODO POST  ////
router.post('/', controller.storeSocialWork);

//// METODO PUT  ////
router.put('/:id_OS', controller.updateSocialWork);

//// METODO DELETE ////
router.delete('/:id_OS', controller.destroySocialWork);

// EXPORTAR ROUTERS
module.exports = router;