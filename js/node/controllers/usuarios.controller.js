const db = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

//// METODO POST  ////
const storeUser = (req, res)  => {
    let imagenAsubir = "";
    if (req.file){
        imagenAsubir = req.file.filename;
    }
    const {nombre_usuario, email, telefono_usuario, contraseña_usuario} = req.params;
    if (!nombre_usuario || !email || !telefono_usuario || !contraseña_usuario){
        return res.status(400).send('Falta Completar Campos');
    }

    // Encriptacion de Contraseña BCRYPT
    bcrypt.hash(contraseña_usuario, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Error hashing contraseña");
    }

        const sql = "INSERT INTO usuarios (nombre_usuario, email, telefono_usuario, contraseña_usuario, foto_perfil) VALUES (?, ?, ?, ?, ?)";
        db.query(sql,[nombre_usuario, email, telefono_usuario, hashedPassword, foto_perfil], (error, result) => {
            console.log(result);
            if(error){
                return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
            }
            const usuario = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
            res.status(201).json(usuario); // muestra creado con exito el elemento
        });  
})};

//// METODO PUT  ////
const updateUser = (req, res) => {
    const {id_usuario} = req.params;
    const {nombre_usuario, email, telefono_usuario, contraseña_usuario, foto_perfil} = req.body;
    const sql ="UPDATE usuarios SET nombre_usuario = ?, email = ?, telefono_usuario = ?, contraseña_usuario = ?, foto_perfil = ? WHERE id_usuario = ?";
    db.query(sql,[nombre_usuario, email, telefono_usuario, contraseña_usuario, foto_perfil, id_usuario], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El/la medico/a al modificar no existe"});
        };
        
        const usuario = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(usuario); // mostrar el elmento que existe
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
    storeUser,
    updateUser,
    destroyUser
};