    /// RUTAS DEL MODULO ///
    const express = require("express")
    const router = express.Router()

    const controller = require("../controllers/habitaciones.controller")

    /// MULTER ///
    const multer = require("multer")
    const path = require("path")
    const fs = require("fs")

    // Crear directorio si no existe
    const uploadDir = "./js/node/uploads/habitaciones"
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Configuración de multer para el almacenamiento de archivos
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
    })

    const uploads = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log("Archivo recibido:", file)
        const filetypes = /jpg|jpeg|png|webp/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        if (mimetype && extname) {
        return cb(null, true)
        }
        cb(new Error("Tipo de archivo no soportado"))
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB límite
    })

    //// METODO GET  /////

    // Para todas las habitaciones
    router.get("/", controller.allRooms)

    // Para una habitación
    router.get("/:id_habitacion", controller.showRoom)

    //// METODO POST  ////
    router.post("/", uploads.single("imagen"), controller.storeRoom)

    //// METODO PUT  ////
    router.put("/:id_habitacion", uploads.single("imagen"), controller.updateRoom)

    //// METODO DELETE ////
    router.delete("/:id_habitacion", controller.destroyRoom)

    // EXPORTAR ROUTERS
    module.exports = router
