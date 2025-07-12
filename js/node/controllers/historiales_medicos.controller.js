const db = require("../db/db");

const allMedicalRecords = (req, res) => {
    const sql = `
    SELECT
        hm.id_HistMedic,
        hm.usuario_id,
        usuarios.nombre AS nombre_paciente,
        hm.fecha,
        hm.especialidad_id,
        especialidades.nombre AS nombre_especialidad,
        hm.medico_id,
        usuarios_medico.nombre AS nombre_medico,
        hm.habitacion_id,
        habitaciones.numero AS numero_habitacion,
        hm.comprobante
    FROM historiales_medicos hm
    INNER JOIN usuarios ON hm.usuario_id = usuarios.id_usuario
    INNER JOIN especialidades ON hm.especialidad_id = especialidades.id_especialidad
    INNER JOIN medicos ON hm.medico_id = medicos.id_medico
    INNER JOIN usuarios AS usuarios_medico ON medicos.usuario_id = usuarios_medico.id_usuario
    INNER JOIN habitaciones ON hm.habitacion_id = habitaciones.id_habitacion
`;
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showMedicalRecord = (req, res) => {
    const {id_HistMedic} = req.params;
    const sql = `
    SELECT
        hm.id_HistMedic,
        hm.usuario_id,
        usuarios.nombre AS nombre_paciente,
        hm.fecha,
        hm.especialidad_id,
        especialidades.nombre AS nombre_especialidad,
        hm.medico_id,
        usuarios_medico.nombre AS nombre_medico,
        hm.habitacion_id,
        habitaciones.numero AS numero_habitacion,
        hm.comprobante
    FROM historiales_medicos hm
    INNER JOIN usuarios ON hm.usuario_id = usuarios.id_usuario
    INNER JOIN especialidades ON hm.especialidad_id = especialidades.id_especialidad
    INNER JOIN medicos ON hm.medico_id = medicos.id_medico
    INNER JOIN usuarios AS usuarios_medico ON medicos.usuario_id = usuarios_medico.id_usuario
    INNER JOIN habitaciones ON hm.habitacion_id = habitaciones.id_habitacion
    WHERE hm.id_HistMedic = ?
`;
    db.query(sql,[id_HistMedic], (error, rows) => {
        
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
    const {usuario_id, fecha, especialidad_id, medico_id, habitacion_id, comprobante} = req.body;
    if (!usuario_id || !fecha || !especialidad_id || !medico_id || !habitacion_id ) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
}
    const sql = `
    INSERT INTO historiales_medicos (usuario_id, fecha, especialidad_id, medico_id, habitacion_id, comprobante)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;
    db.query(sql,[usuario_id, fecha, especialidad_id, medico_id, habitacion_id, comprobante || null], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const HistMedic = {...req.body, id_HistMedic: result.insertId, fecha_creacion: new Date()};
        res.status(201).json(HistMedic);
    });     
};

const updateMedicalRecord = (req, res) => {
    const {id_HistMedic} = req.params;
    const {usuario_id, fecha, especialidad_id, medico_id, habitacion_id, comprobante} = req.body;
    const sql = `
    UPDATE historiales_medicos
    SET usuario_id = ?, fecha = ?, especialidad_id = ?, medico_id = ?, habitacion_id = ?, comprobante = ?
    WHERE id_HistMedic = ?
`;
    db.query(sql,[usuario_id, fecha, especialidad_id, medico_id, habitacion_id, comprobante || null,  id_HistMedic], (error, result) => {
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
    const {id_HistMedic} = req.params;
    const sql = "DELETE FROM historiales_medicos WHERE id_HistMedic = ?";
    db.query(sql,[id_HistMedic], (error, result) => {
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