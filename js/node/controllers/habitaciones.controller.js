const db = require("../db/db");

const allRooms = (req, res) => {
    const sql = "SELECT * FROM habitaciones";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showRoom = (req, res) => {
    const {id_habitacion} = req.params;
    const sql = "SELECT * FROM habitaciones WHERE id_habitacion = ?";
    db.query(sql,[id_habitacion], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la habitación buscada"});
        };
        res.json(rows[0]);
    }); 
};

const storeRoom = (req, res) => {
    const {numero, tipo, estado, precio_por_dia} = req.body;
    const sql = "INSERT INTO habitaciones (numero, tipo, estado, precio_por_dia) VALUES (?,?,?,?)";
    db.query(sql,[numero, tipo, estado, precio_por_dia], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const habitacion = {...req.body, id_habitacion: result.insertId};
        res.status(201).json(habitacion);
    });     
};

const updateRoom = (req, res) => {
    const {id_habitacion} = req.params;
    const {numero, tipo, estado, precio_por_dia} = req.body;
    const sql ="UPDATE habitaciones SET numero = ?, tipo = ?, estado = ?, precio_por_dia = ? WHERE id_habitacion = ?";
    db.query(sql,[numero, tipo, estado, precio_por_dia, id_habitacion], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La habitación a modificar no existe"});
        };
        const habitacion = {...req.body, ...req.params};
        res.json(habitacion);
    });     
};

const destroyRoom = (req, res) => {
    const {id_habitacion} = req.params;
    const sql = "DELETE FROM habitaciones WHERE id_habitacion = ?";
    db.query(sql,[id_habitacion], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La habitación a borrar no existe"});
        };
        res.json({mensaje : "Habitación Eliminada"});
    }); 
};

module.exports = {
    allRooms,
    showRoom,
    storeRoom,
    updateRoom,
    destroyRoom
};