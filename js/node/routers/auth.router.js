    /// RUTAS DEL MODULO ///
    const express = require("express")
    const router = express.Router()

    const controller = require("../controllers/auth.controller")
    const { verifyToken, verifyAdmin } = require("../middleware/auth.middleware")

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

    //// RUTAS DE AUTENTICACIÓN ////
    router.post("/register", uploads.single("foto_perfil"), controller.register)
    router.post("/login", uploads.single("foto_perfil"), controller.login)

    // Ruta para verificar el estado de autenticación
    router.get("/verify", verifyToken, controller.verifyAuth)

    // Ruta para cerrar sesión
    router.post("/logout", controller.logout)

    // Ruta protegida para administradores
    router.get("/admin-check", verifyToken, verifyAdmin, (req, res) => {
    res.json({ auth: true, isAdmin: true, user: req.user })
    })

    // EXPORTAR ROUTERS
    module.exports = router
