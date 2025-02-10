/// CONTROLADORES DEL MODULO ///

// Campos de la tabla medicos
// id_especialidad
// especialidad

const db = require("../db/db");

//// METODO GET  /////

// Para todos los/as medico/a
const allSpecialty = (req, res) => {
    const sql = "SELECT * FROM especialidades";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para una especialidad
const showSpecialty = (req, res) => {
    const {id_especialidad} = req.params;
    const sql = "SELECT * FROM especialidades WHERE id_especialidad = ?";
    db.query(sql,[id_especialidad], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la especialidad buscada"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeSpecialty = (req, res) => {
    const {especialidad} = req.body;
    const sql = "INSERT INTO especialidades (especialidad) VALUES (?)";
    db.query(sql,[especialidad], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const ocupacion = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(ocupacion); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateSpecialty = (req, res) => {
    const {id_especialidad} = req.params;
    const {especialidad} = req.body;
    const sql ="UPDATE especialidades SET especialidad = ? WHERE id_especialidad = ?";
    db.query(sql,[especialidad, id_especialidad], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La especialidad a modificar no existe"});
        };
        
        const ocupacion = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(ocupacion); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroySpecialty = (req, res) => {
    const {id_especialidad} = req.params;
    const sql = "DELETE FROM especialidades WHERE id_especialidad = ?";
    db.query(sql,[id_especialidad], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: Al borrar la especialidad no existe"});
        };
        res.json({mesaje : "Especialidad Eliminada"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allSpecialty,
    showSpecialty,
    storeSpecialty,
    updateSpecialty,
    destroySpecialty
};
