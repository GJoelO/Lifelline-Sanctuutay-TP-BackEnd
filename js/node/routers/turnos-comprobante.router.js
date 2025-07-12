// Router para turnos con comprobante
const express = require("express")
const router = express.Router()
const multer = require("multer")
const { verifyToken } = require("../middleware/auth.middleware")
const controller = require("../controllers/turnos-comprobante.controller")

// Configurar multer para manejar FormData
const upload = multer()

// Ruta para obtener médicos por especialidad
router.get("/medicos", controller.getMedicosByEspecialidad)

// Ruta para verificar disponibilidad
router.get("/disponibilidad", controller.checkDisponibilidad)

// Ruta para crear turno con comprobante
router.post("/crear-con-comprobante", verifyToken, upload.none(), controller.crearTurnoConComprobante)

// Ruta para enviar comprobante por email
router.post("/enviar-email", verifyToken, controller.enviarComprobanteEmail)

// Ruta para generar PDF del comprobante
router.post("/generar-pdf", verifyToken, controller.generarPDF)

module.exports = router
