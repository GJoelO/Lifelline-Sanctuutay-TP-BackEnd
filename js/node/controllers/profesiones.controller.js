/// CONTROLADORES DEL MODULO ///

// Campos de la tabla medicos
// id_profesion
// profesion

const db = require("../db/db");

//// METODO GET  /////

// Para todos los/as medico/a
const allProfession = (req, res) => {
    const sql = "SELECT * FROM profesiones";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

// Para una profesion
const showProfession = (req, res) => {
    const {id_profesion} = req.params;
    const sql = "SELECT * FROM profesiones WHERE id_profesion = ?";
    db.query(sql,[id_profesion], (error, rows) => {
        console.log(rows);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la profesion buscada"});
        };
        res.json(rows[0]); 
        // me muestra el elemento en la posicion cero si existe.
    }); 
};

//// METODO POST  ////
const storeProfession = (req, res) => {
    const {profesion} = req.body;
    const sql = "INSERT INTO profesiones (profesion) VALUES (?)";
    db.query(sql,[profesion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const ocupacion = {...req.body, id: result.insertId}; // ... reconstruir el objeto del body
        res.status(201).json(ocupacion); // muestra creado con exito el elemento
    });     

};

//// METODO PUT  ////
const updateProfession = (req, res) => {
    const {id_profesion} = req.params;
    const {profesion} = req.body;
    const sql ="UPDATE profesiones SET profesion = ? WHERE id_profesion = ?";
    db.query(sql,[profesion, id_profesion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La profesion a modificar no existe"});
        };
        
        const ocupacion = {...req.body, ...req.params}; // ... reconstruir el objeto del body

        res.json(ocupacion); // mostrar el elemento que existe
    });     
};


//// METODO DELETE ////
const destroyProfession = (req, res) => {
    const {id_profesion} = req.params;
    const sql = "DELETE FROM profesiones WHERE id_profesion = ?";
    db.query(sql,[id_profesion], (error, result) => {
        console.log(result);
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: Al borrar la profesion no existe"});
        };
        res.json({mesaje : "Profesion Eliminada"});
    }); 
};


// EXPORTAR DEL MODULO TODAS LAS FUNCIONES
module.exports = {
    allProfession,
    showProfession,
    storeProfession,
    updateProfession,
    destroyProfession
};
