/// RUTAS DEL MODULO ///
const express = require("express")
const router = express.Router()

const controller = require("../controllers/turnos.controller")

//// METODO GET  /////

// Para todas las turnos
router.get("/", controller.allShifts)

// Para una turnos
router.get("/:id_turno", controller.showShift)

//// METODO POST  ////
router.post("/", controller.storeShift)

//// METODO PUT  ////
router.put("/:id_turno", controller.updateShift)

//// METODO DELETE ////
router.delete("/:id_turno", controller.destroyShift)


// EXPORTAR ROUTERS
module.exports = router
