    const express = require("express")
    const router = express.Router()
    const historialService = require("../services/historial.service")

    // Descargar comprobante PDF
    router.get("/descargar/:historialId", async (req, res) => {
    try {
        const { historialId } = req.params

        const historial = await historialService.obtenerComprobantePDF(historialId)

        if (!historial.nombreArchivo) {
        return res.status(404).json({
            success: false,
            message: "Comprobante no encontrado",
        })
        }

        // Leer el PDF desde el servidor
        const pdfBuffer = await historialService.leerPDFDesdeServidor(historial.nombreArchivo)

        // Configurar headers para descarga de PDF
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="${historial.nombreArchivo}"`)

        // Enviar el buffer del PDF
        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error descargando comprobante:", error)
        res.status(500).json({
        success: false,
        message: "Error al descargar el comprobante",
        })
    }
    })

    // Ver comprobante PDF en el navegador
    router.get("/ver/:historialId", async (req, res) => {
    try {
        const { historialId } = req.params

        const historial = await historialService.obtenerComprobantePDF(historialId)

        if (!historial.nombreArchivo) {
        return res.status(404).json({
            success: false,
            message: "Comprobante no encontrado",
        })
        }

        // Leer el PDF desde el servidor
        const pdfBuffer = await historialService.leerPDFDesdeServidor(historial.nombreArchivo)

        // Configurar headers para mostrar PDF en el navegador
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `inline; filename="${historial.nombreArchivo}"`)

        // Enviar el buffer del PDF
        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error mostrando comprobante:", error)
        res.status(500).json({
        success: false,
        message: "Error al mostrar el comprobante",
        })
    }
    })

    module.exports = router
