    const express = require("express")
    const router = express.Router()
    const controller = require("../controllers/contacto.controller")
    const { verifyToken } = require("../middleware/auth.middleware")

    // Middleware para parsear JSON
    router.use(express.json())
    router.use(express.urlencoded({ extended: true }))

    // Ruta de prueba (opcional, puedes eliminarla después)
    router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Router de contacto funcionando",
        timestamp: new Date().toISOString(),
    })
    })

    // Ruta para enviar reporte de contacto (protegida - solo usuarios logueados)
    router.post("/enviar", verifyToken, controller.enviarReporte)

    module.exports = router
