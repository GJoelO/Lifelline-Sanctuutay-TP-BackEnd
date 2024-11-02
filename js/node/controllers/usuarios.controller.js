const db = require("../db/db");
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Asegúrate de que este directorio exista
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

//// METODO GET  /////

const allUsers = (req, res) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showUser = (req, res) => {
    const {id_usuario} = req.params;
    const sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    db.query(sql,[id_usuario], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el usuario buscado"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO PUT  ////
//// SUBIDA DE ARCHIVO ////
const updateUser = (req, res) => {
    upload.single('foto_perfil')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({error : "ERROR: Problema al subir el archivo"});
        } else if (err) {
            return res.status(500).json({error : "ERROR: " + err.message});
        }
        
        //// ACTUALIZA LA INFORMACION DEL USUARIO ////
        
        const {id_usuario} = req.params; // Extrae el ID
        const {nombre_usuario, email, telefono_usuario, contraseña_usuario} = req.body; // Extrae varios campo del cuerpo de la solicitud
        const foto_perfil = req.file ? req.file.filename : null; // Verifica si se subio un archivo y sino es NULL

        let sql, params; // Declaracion de variable 

        // MODIFICA LA CONTRASENA
        if (contraseña_usuario) {
            bcrypt.hash(contraseña_usuario, 8, (err, hash) => {
                if (err) {
                    return res.status(500).json({error : "ERROR: Problema al hashear la contraseña"});
                }
                
                sql = "UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono_usuario = ?, contraseña_usuario = ?, foto_perfil = ? WHERE id_usuario = ?";
                params = [nombre_usuario, email, telefono_usuario, hash, foto_perfil, id_usuario];
                
                executeUpdate(sql, params);
            });
        } else {
            sql = "UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono_usuario = ?, foto_perfil = ? WHERE id_usuario = ?";
            params = [nombre_usuario, email, telefono_usuario, foto_perfil, id_usuario];
            
            executeUpdate(sql, params);
        }
        
        // Ejecuta consulta SQL para actualizar la informacion del usuario
        function executeUpdate(sql, params) {
            db.query(sql, params, (error, result) => {
                if(error){
                    return res.status(500).json({error : "ERROR: Intente más tarde por favor"});
                }
                if(result.affectedRows == 0){
                    return res.status(404).send({error : "ERROR: El usuario a modificar no existe"});
                };
                
                const updatedUser = {id_usuario, nombre_usuario, email, telefono_usuario, foto_perfil};
                res.json(updatedUser);
            });
        }
    });
};


//// METODO DELETE ////
const destroyUser = (req, res) => {
    const {id_usuario} = req.params;
    const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(sql,[id_usuario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El usuario a borrar no existe"});
        };
        res.json({mesaje : "Usuario Eliminado"});
    }); 
};




// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allUsers,
    showUser,
    updateUser,
    destroyUser
};