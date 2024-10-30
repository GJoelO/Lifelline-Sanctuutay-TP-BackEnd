const db = require("../db/db");

const allMedications = (req, res) => {
    const sql = "SELECT * FROM medicamentos";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showMedication = (req, res) => {
    const {id_medicamento} = req.params;
    const sql = "SELECT * FROM medicamentos WHERE id_medicamento = ?";
    db.query(sql,[id_medicamento], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe el medicamento buscado"});
        };
        res.json(rows[0]);
    }); 
};

const storeMedication = (req, res) => {
    const {nombre, descripcion, dosis_recomendada, efectos_secundarios, stock} = req.body;
    const sql = "INSERT INTO medicamentos (nombre, descripcion, dosis_recomendada, efectos_secundarios, stock) VALUES (?,?,?,?,?)";
    db.query(sql,[nombre, descripcion, dosis_recomendada, efectos_secundarios, stock], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const medicamento = {...req.body, id_medicamento: result.insertId};
        res.status(201).json(medicamento);
    });     
};

const updateMedication = (req, res) => {
    const {id_medicamento} = req.params;
    const {nombre, descripcion, dosis_recomendada, efectos_secundarios, stock} = req.body;
    const sql ="UPDATE medicamentos SET nombre = ?, descripcion = ?, dosis_recomendada = ?, efectos_secundarios = ?, stock = ? WHERE id_medicamento = ?";
    db.query(sql,[nombre, descripcion, dosis_recomendada, efectos_secundarios, stock, id_medicamento], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El medicamento a modificar no existe"});
        };
        const medicamento = {...req.body, ...req.params};
        res.json(medicamento);
    });     
};

const destroyMedication = (req, res) => {
    const {id_medicamento} = req.params;
    const sql = "DELETE FROM medicamentos WHERE id_medicamento = ?";
    db.query(sql,[id_medicamento], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: El medicamento a borrar no existe"});
        };
        res.json({mensaje : "Medicamento Eliminado"});
    }); 
};

module.exports = {
    allMedications,
    showMedication,
    storeMedication,
    updateMedication,
    destroyMedication
};