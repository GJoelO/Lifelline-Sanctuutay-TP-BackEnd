const db = require("../db/db");

const allDepartments = (req, res) => {
    const sql = "SELECT * FROM departamentos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showDepartment = (req, res) => {
    const {id_departamento} = req.params;
    const sql = "SELECT * FROM departamentos WHERE id_departamento = ?";
    db.query(sql,[id_departamento], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el departamento buscado"});
        };
        res.json(rows[0]);
    }); 
};

const storeDepartment = (req, res) => {
    const {nombre, descripcion, jefe_departamento} = req.body;
    const sql = "INSERT INTO departamentos (nombre, descripcion, jefe_departamento) VALUES (?,?,?)";
    db.query(sql,[nombre, descripcion, jefe_departamento], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const departamento = {...req.body, id_departamento: result.insertId};
        res.status(201).json(departamento);
    });     
};

const updateDepartment = (req, res) => {
    const {id_departamento} = req.params;
    const {nombre, descripcion, jefe_departamento} = req.body;
    const sql ="UPDATE departamentos SET nombre = ?, descripcion = ?, jefe_departamento = ? WHERE id_departamento = ?";
    db.query(sql,[nombre, descripcion, jefe_departamento, id_departamento], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El departamento a modificar no existe"});
        };
        const departamento = {...req.body, ...req.params};
        res.json(departamento);
    });     
};

const destroyDepartment = (req, res) => {
    const {id_departamento} = req.params;
    const sql = "DELETE FROM departamentos WHERE id_departamento = ?";
    db.query(sql,[id_departamento], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El departamento a borrar no existe"});
        };
        res.json({mensaje : "Departamento Eliminado"});
    }); 
};

module.exports = {
    allDepartments,
    showDepartment,
    storeDepartment,
    updateDepartment,
    destroyDepartment
};