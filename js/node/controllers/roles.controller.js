const db = require("../db/db")

const allRoles = (req, res) => {
    const sql = `
        SELECT 
            id_rol,
            nombre
        FROM roles
    `
    db.query(sql, (error, rows) => {
        if (error) {
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        res.json(rows)
    })
}

const showRol = (req, res) => {
    const { id_rol } = req.params
    const sql = `
        SELECT 
            id_rol,
            nombre
        FROM roles
        WHERE id_rol = ?
    `
    db.query(sql, [id_rol], (error, rows) => {
        if (error) {
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe el rol buscado" })
        }
        res.json(rows[0])
    })
}

const storeRol = (req, res) => {
    const { nombre } = req.body
    if (!nombre) {
        return res.status(400).json({ error: "El nombre del rol es obligatorio." })
    }
    const sql = `
        INSERT INTO roles (nombre)
        VALUES (?)
    `
    db.query(sql, [nombre], (error, result) => {
        if (error) {
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        const rol = { ...req.body, id_rol: result.insertId }
        res.status(201).json(rol)
    })
}

const updateRol = (req, res) => {
    const { id_rol } = req.params
    const { nombre } = req.body
    if (!nombre) {
        return res.status(400).json({ error: "El nombre del rol es obligatorio." })
    }
    const sql = `
        UPDATE roles
        SET nombre = ?
        WHERE id_rol = ?
    `
    db.query(sql, [nombre, id_rol], (error, result) => {
        if (error) {
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: El rol a modificar no existe" })
        }
        const rol = { ...req.body, ...req.params }
        res.json(rol)
    })
}

const destroyRol = (req, res) => {
    const { id_rol } = req.params
    const sql = "DELETE FROM roles WHERE id_rol = ?"
    db.query(sql, [id_rol], (error, result) => {
        if (error) {
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: El rol a borrar no existe" })
        }
        res.json({ mensaje: "Rol Eliminado" })
    })
}

    module.exports = {
    allRoles,
    showRol,
    storeRol,
    updateRol,
    destroyRol,
}
