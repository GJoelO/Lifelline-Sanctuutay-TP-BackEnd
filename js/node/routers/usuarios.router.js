    /// RUTAS DEL MODULO ///
    const express = require("express")
    const router = express.Router()

    const controller = require("../controllers/usuarios.controller")

    /// MULTER ///
    const multer = require("multer")
    const path = require("path")
    const fs = require("fs")

    // Crear directorio si no existe
    const uploadDir = "./js/node/uploads/usuarios"
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
    router.get("/", controller.allUsers)
    router.get("/medicos", controller.getMedicalUsers) // NUEVA RUTA para usuarios médicos
    router.get("/:id_usuario", controller.showUser)

    //// METODO POST ////
    router.post("/", uploads.single("foto_perfil"), controller.createUser)

    //// METODO PUT  ////
    router.put("/:id_usuario", uploads.single("foto_perfil"), controller.updateUser)

    //// METODO DELETE ////
    router.delete("/:id_usuario", controller.destroyUser)

    // EXPORTAR ROUTERS
    module.exports = router
