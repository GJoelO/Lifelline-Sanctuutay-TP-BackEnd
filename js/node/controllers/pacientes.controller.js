const db = require("../db/db");

const allPatients = (req, res) => {
    const sql = "SELECT * FROM pacientes";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showPatient = (req, res) => {
    const {id_paciente} = req.params;
    const sql = "SELECT * FROM pacientes WHERE id_paciente = ?";
    db.query(sql,[id_paciente], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el paciente buscado"});
        };
        res.json(rows[0]);
    }); 
};

const storePatient = (req, res) => {
    const {apellido, nombre, fecha_nacimiento, genero, direccion, telefono, email, grupo_sanguineo} = req.body;
    const sql = "INSERT INTO pacientes (apellido, nombre, fecha_nacimiento, genero, direccion, telefono, email, grupo_sanguineo) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sql,[apellido, nombre, fecha_nacimiento, genero, direccion, telefono, email, grupo_sanguineo], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const paciente = {...req.body, id_paciente: result.insertId};
        res.status(201).json(paciente);
    });     
};

const updatePatient = (req, res) => {
    const {id_paciente} = req.params;
    const {apellido, nombre, fecha_nacimiento, genero, direccion, telefono, email, grupo_sanguineo} = req.body;
    const sql ="UPDATE pacientes SET apellido = ?, nombre = ?, fecha_nacimiento = ?, genero = ?, direccion = ?, telefono = ?, email = ?, grupo_sanguineo = ? WHERE id_paciente = ?";
    db.query(sql,[apellido, nombre, fecha_nacimiento, genero, direccion, telefono, email, grupo_sanguineo, id_paciente], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El paciente a modificar no existe"});
        };
        const paciente = {...req.body, ...req.params};
        res.json(paciente);
    });     
};

const destroyPatient = (req, res) => {
    const {id_paciente} = req.params;
    const sql = "DELETE FROM pacientes WHERE id_paciente = ?";
    db.query(sql,[id_paciente], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El paciente a borrar no existe"});
        };
        res.json({mensaje : "Paciente Eliminado"});
    }); 
};

module.exports = {
    allPatients,
    showPatient,
    storePatient,
    updatePatient,
    destroyPatient
};