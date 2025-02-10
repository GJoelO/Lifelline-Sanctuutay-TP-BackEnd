/// RUTAS DEL MODULO ///
const express = require("express");
const router = express.Router();

const controller = require("../controllers/usuarios.controller");

/// MULTER ///
const multer = require('multer');
const path = require('path');

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './js/node/uploads') // Asegúrate de que este directorio exista
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const uploads = multer({ storage, fileFilter: (req, file, cb) => {
    console.log(file);
    const filetypes = /jpg|jpeg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const  extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && path.extname){
        return cb(null, true);
    };
    cb("Tipo de archivo no soportado");},
    limits: {fileSize: 1024 * 1024 * 1},
});


//// METODO GET  /////

// Para todos los productos
router.get('/', controller.allUsers);

// Para un producto
router.get('/:id_usuario', controller.showUser);

//// METODO POST  ////
router.post('/', uploads.single('foto_perfil'), controller.storeUser);

//// METODO PUT  ////
router.put('/:id_usuario', uploads.single('foto_perfil'), controller.updateUser);

//// METODO DELETE ////
router.delete('/:id_usuario', controller.destroyUser);

// EXPORTAR ROUTERS
module.exports = router;