    const express = require("express")
    const router = express.Router()
    const multer = require("multer")
    const path = require("path")
    const fs = require("fs")

    // IMPORTAR EL CONTROLLER
    const {
    allHospitals,
    showHospital,
    storeHospital,
    updateHospital,
    destroyHospital,
    getHospitalInfo, // NUEVA FUNCIÓN IMPORTADA
    } = require("../controllers/hospital.controller")

    // Configuración de multer para subida de archivos
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/hospital")

        // Crear directorio si no existe
        if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
        }

        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, "hospital-" + uniqueSuffix + path.extname(file.originalname))
    },
    })

    const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Verificar que sea una imagen
        if (file.mimetype.startsWith("image/")) {
        cb(null, true)
        } else {
        cb(new Error("Solo se permiten archivos de imagen"), false)
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
    })

    // RUTAS QUE USAN EL CONTROLLER
    router.get("/", allHospitals)
    router.get("/info", getHospitalInfo) // NUEVA RUTA - DEBE IR ANTES DE /:id_hospital
    router.get("/:id_hospital", showHospital)
    router.post("/", upload.single("imagen"), storeHospital)
    router.put("/:id_hospital", upload.single("imagen"), updateHospital)
    router.delete("/:id_hospital", destroyHospital)

    module.exports = router
