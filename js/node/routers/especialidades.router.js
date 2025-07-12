    /// RUTAS DEL MODULO ///
    const express = require("express")
    const router = express.Router()

    const controller = require("../controllers/especialidades.controller")

    /// MULTER ///
    const multer = require("multer")
    const path = require("path")
    const fs = require("fs")

    // Crear directorio si no existe
    const uploadDir = "./js/node/uploads/especialidades"
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

    // Para todas las especialidades
    router.get("/", controller.allSpecialty)

    // Para una especialidad
    router.get("/:id_especialidad", controller.showSpecialty)

    //// METODO POST  ////
    router.post("/", uploads.single("imagen"), controller.storeSpecialty)

    //// METODO PUT  ////
    router.put("/:id_especialidad", uploads.single("imagen"), controller.updateSpecialty)

    //// METODO DELETE ////
    router.delete("/:id_especialidad", controller.destroySpecialty)

    // EXPORTAR ROUTERS
    module.exports = router
