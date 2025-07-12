const express = require("express")
const router = express.Router()
const controller = require("./generos.controller")
const { verifyToken, verifyAdmin } = require("../js/node/middleware/auth.middleware")

// Rutas públicas para géneros (solo lectura)
router.get("/", controller.getAllGeneros)
router.get("/:id", controller.getGeneroById)

// Rutas protegidas para administradores (crear, actualizar, eliminar)
router.post("/", verifyToken, verifyAdmin, controller.createGenero)
router.put("/:id", verifyToken, verifyAdmin, controller.updateGenero)
router.delete("/:id", verifyToken, verifyAdmin, controller.deleteGenero)

module.exports = router
