/// CONTROLADORES DEL MODULO ///

// Campos de la tabla medicos
// id_medico
// fk_profesion
// apellido
// nombre
// edad
// email
// telefono
// años_ejerciendo

const db = require("../db/db");

//// METODO GET  /////

// Para todos los/as medico/a
const allMedic = (req, res) => {
    const sql = "SELECT * FROM medicos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para un/a medico/a
const showMedic = (req, res) => {
    const {id_medico} = req.params;
    const sql = "SELECT * FROM medicos WHERE id_medico = ?";
    db.query(sql,[id_medico], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el medico buscado/a"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeMedic = (req, res) => {
    const {fk_profesion, apellido, nombre, edad, email, telefono, años_ejerciendo} = req.body;
    const sql = "INSERT INTO medicos (fk_profesion, apellido, nombre, edad, email, telefono, años_ejerciendo) VALUES (?,?,?,?,?,?,?)";
    db.query(sql,[fk_profesion, apellido, nombre, edad, email, telefono, años_ejerciendo], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const medico = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(medico); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateMedic = (req, res) => {
    const {id_medico} = req.params;
    const {fk_profesion, apellido, nombre, edad, email, telefono, años_ejerciendo} = req.body;
    const sql ="UPDATE medicos SET fk_profesion = ?, apellido = ?, nombre = ?, edad = ?, email = ?, telefono = ?, años_ejerciendo = ? WHERE id_medico = ?";
    db.query(sql,[fk_profesion, apellido, nombre, edad, email, telefono, años_ejerciendo, id_medico], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El/la medico/a al modificar no existe"});
        };
        
        const medico = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(medico); // mostrar el elmento que existe
    });     
};


//// METODO DELETE ////
const destroyMedic = (req, res) => {
    const {id_medico} = req.params;
    const sql = "DELETE FROM medicos WHERE id_medico = ?";
    db.query(sql,[id_medico], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: Al borrar el/la medico/a no existe"});
        };
        res.json({mesaje : "Medico/a Eliminado/a"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allMedic,
    showMedic,
    storeMedic,
    updateMedic,
    destroyMedic
};
