const db = require("../db/db");

const allMedicalRecords = (req, res) => {
    const sql = "SELECT * FROM historialesmedicos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showMedicalRecord = (req, res) => {
    const {id_historial} = req.params;
    const sql = "SELECT * FROM historialesmedicos WHERE id_historial = ?";
    db.query(sql,[id_historial], (error, rows) => {
        
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el historial médico buscado"});
        };
        res.json(rows[0]);
    }); 
};

const storeMedicalRecord = (req, res) => {
    const {fk_paciente, diagnostico, tratamiento, notas_adicionales} = req.body;
    const sql = "INSERT INTO historialesmedicos (fk_paciente, diagnostico, tratamiento, notas_adicionales) VALUES (?,?,?,?)";
    db.query(sql,[fk_paciente, diagnostico, tratamiento, notas_adicionales], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const historial = {...req.body, id_historial: result.insertId, fecha_creacion: new Date()};
        res.status(201).json(historial);
    });     
};

const updateMedicalRecord = (req, res) => {
    const {id_historial} = req.params;
    const {fk_paciente, diagnostico, tratamiento, notas_adicionales} = req.body;
    const sql ="UPDATE historialesmedicos SET fk_paciente = ?, diagnostico = ?, tratamiento = ?, notas_adicionales = ? WHERE id_historial = ?";
    db.query(sql,[fk_paciente, diagnostico, tratamiento, notas_adicionales, id_historial], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El historial médico a modificar no existe"});
        };
        const historial = {...req.body, ...req.params};
        res.json(historial);
    });     
};

const destroyMedicalRecord = (req, res) => {
    const {id_historial} = req.params;
    const sql = "DELETE FROM historialesmedicos WHERE id_historial = ?";
    db.query(sql,[id_historial], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El historial médico a borrar no existe"});
        };
        res.json({mensaje : "Historial Médico Eliminado"});
    }); 
};

module.exports = {
    allMedicalRecords,
    showMedicalRecord,
    storeMedicalRecord,
    updateMedicalRecord,
    destroyMedicalRecord
};