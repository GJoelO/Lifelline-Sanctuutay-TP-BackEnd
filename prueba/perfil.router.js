const express = require("express")
const router = express.Router()
const controller = require("./perfil.controller")
const { verifyToken } = require("../js/node/middleware/auth.middleware")

// Multer para manejo de archivos
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Crear directorio si no existe
const uploadDir = "./js/node/uploads/usuarios"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configuración de multer
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

// Rutas protegidas - requieren autenticación
router.use(verifyToken)

// Rutas CRUD completas para administradores (requieren autenticación y permisos de admin)
const { verifyAdmin } = require("../js/node/middleware/auth.middleware")

// ========== RUTAS CRUD PARA PERFILES ==========
// Rutas para administradores - gestión completa de perfiles
router.get("/perfiles", verifyAdmin, controller.allPerfiles)
router.get("/perfiles/:id_perfil", verifyAdmin, controller.showPerfil)
router.post("/perfiles", verifyAdmin, controller.createPerfil)
router.put("/perfiles/:id_perfil", verifyAdmin, controller.updatePerfil)
router.delete("/perfiles/:id_perfil", verifyAdmin, controller.destroyPerfil)

// Rutas de perfil
router.get("/perfil", controller.getPerfilUsuario)
router.put("/perfil", uploads.single("foto_perfil"), controller.updatePerfilUsuario)

// Rutas de domicilio
router.get("/domicilio", controller.getDomicilioUsuario)
router.put("/domicilio/actualizar", controller.updateDomicilioUsuario)

// ========== RUTAS CRUD PARA CONTACTOS ==========
// Rutas para administradores - gestión completa de contactos
router.get("/contactos", verifyAdmin, controller.allContactos)
router.get("/contactos/:id_contacto", verifyAdmin, controller.showContacto)
router.post("/contactos", verifyAdmin, controller.createContacto)
router.put("/contactos/:id_contacto", verifyAdmin, controller.updateContacto)
router.delete("/contactos/:id_contacto", verifyAdmin, controller.destroyContacto)

// Rutas de contactos
router.get("/contacto", controller.getContactosUsuario)
router.get("/contacto/:id", controller.getContactoUsuario)
router.post("/contacto", controller.createContactoUsuario)
router.put("/contacto/:id", controller.updateContactoUsuario)
router.delete("/contacto/:id", controller.deleteContactoUsuario)

// Ruta de historial médico
router.get("/historial", controller.getHistorialUsuario)

module.exports = router
