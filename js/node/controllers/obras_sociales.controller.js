const db = require("../db/db");

const allSocialWorks = (req, res) => {
    const sql = "SELECT id_OS, nombre, codigo FROM obras_sociales";
    db.query(sql, (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        res.json(rows);
    }); 
};

const showSocialWork = (req, res) => {
    const {id_OS} = req.params;
    const sql = "SELECT id_OS, nombre, codigo FROM obras_sociales WHERE id_OS = ?";
    db.query(sql,[id_OS], (error, rows) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(rows.length == 0){
            return res.status(404).send({error : "ERROR: No existe la obras sociales buscado"});
        };
        res.json(rows[0]);
    }); 
};

const storeSocialWork = (req, res) => {
    const {nombre, codigo} = req.body;

    console.log(req.body);

    const sql = "INSERT INTO obras_sociales (nombre, codigo) VALUES (?,?)";
    db.query(sql,[nombre, codigo], (error, result) => {

        console.log(error);

        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        const obras_sociales = {...req.body, id_OS: result.insertId};
        res.status(201).json(obras_sociales);
    });     
};

const updateSocialWork = (req, res) => {
    const {id_OS} = req.params;
    const {nombre, codigo} = req.body;
    const sql = `
    UPDATE obras_sociales
    SET nombre = ?, codigo = ?
    WHERE id_OS = ?
`;
    db.query(sql,[nombre, codigo, id_OS], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La obra social a modificar no existe"});
        };
        const obras_sociales = {...req.body, ...req.params};
        res.json(obras_sociales);
    });     
};

const destroySocialWork = (req, res) => {
    const {id_OS} = req.params;
    const sql = "DELETE FROM obras_sociales WHERE id_OS = ?";
    db.query(sql,[id_OS], (error, result) => {
        if(error){
            return res.status(500).json({error : "ERROR: Intente mas tarde por favor"});
        }
        if(result.affectedRows == 0){
            return res.status(404).send({error : "ERROR: La obra social a borrar no existe"});
        };
        res.json({mensaje : "Obras social Eliminado"});
    }); 
};

module.exports = {
    allSocialWorks,
    showSocialWork,
    storeSocialWork,
    updateSocialWork,
    destroySocialWork
};