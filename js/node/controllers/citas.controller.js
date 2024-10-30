const db = require("../db/db");

const allAppointments = (req, res) => {
    const sql = "SELECT * FROM citas";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showAppointment = (req, res) => {
    const {id_cita} = req.params;
    const sql = "SELECT * FROM citas WHERE id_cita = ?";
    db.query(sql,[id_cita], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la cita buscada"});
        };
        res.json(rows[0]);
    }); 
};

const storeAppointment = (req, res) => {
    const {fk_paciente, fk_medico, fecha_hora, motivo, estado} = req.body;
    const sql = "INSERT INTO citas (fk_paciente, fk_medico, fecha_hora, motivo, estado) VALUES (?,?,?,?,?)";
    db.query(sql,[fk_paciente, fk_medico, fecha_hora, motivo, estado], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const cita = {...req.body, id_cita: result.insertId};
        res.status(201).json(cita);
    });     
};

const updateAppointment = (req, res) => {
    const {id_cita} = req.params;
    const {fk_paciente, fk_medico, fecha_hora, motivo, estado} = req.body;
    const sql ="UPDATE citas SET fk_paciente = ?, fk_medico = ?, fecha_hora = ?, motivo = ?, estado = ? WHERE id_cita = ?";
    db.query(sql,[fk_paciente, fk_medico, fecha_hora, motivo, estado, id_cita], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La cita a modificar no existe"});
        };
        const cita = {...req.body, ...req.params};
        res.json(cita);
    });     
};

const destroyAppointment = (req, res) => {
    const {id_cita} = req.params;
    const sql = "DELETE FROM citas WHERE id_cita = ?";
    db.query(sql,[id_cita], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La cita a borrar no existe"});
        };
        res.json({mensaje : "Cita Eliminada"});
    }); 
};

module.exports = {
    allAppointments,
    showAppointment,
    storeAppointment,
    updateAppointment,
    destroyAppointment
};