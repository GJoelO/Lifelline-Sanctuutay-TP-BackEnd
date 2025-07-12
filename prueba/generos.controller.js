    const db = require("../js/node/db/db")

    // Obtener todos los géneros
    const getAllGeneros = (req, res) => {
    const sql = "SELECT id_genero, descripcion FROM generos ORDER BY descripcion"

    db.query(sql, (error, results) => {
        if (error) {
        console.error("Error obteniendo géneros:", error)
        return res.status(500).json({ error: "Error obteniendo géneros" })
        }

        res.json(results)
    })
    }

    // Obtener un género por ID
    const getGeneroById = (req, res) => {
    const { id } = req.params
    const sql = "SELECT id_genero, descripcion FROM generos WHERE id_genero = ?"

    db.query(sql, [id], (error, results) => {
        if (error) {
        console.error("Error obteniendo género:", error)
        return res.status(500).json({ error: "Error obteniendo género" })
        }

        if (results.length === 0) {
        return res.status(404).json({ error: "Género no encontrado" })
        }

        res.json(results[0])
    })
    }

    // Crear un nuevo género
    const createGenero = (req, res) => {
    const { descripcion } = req.body

    if (!descripcion) {
        return res.status(400).json({ error: "La descripción es obligatoria" })
    }

    // Verificar que no existe ya un género con esa descripción
    db.query("SELECT id_genero FROM generos WHERE descripcion = ?", [descripcion], (error, results) => {
        if (error) {
        console.error("Error verificando género existente:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (results.length > 0) {
        return res.status(400).json({ error: "ERROR: Ya existe un género con esa descripción" })
        }

        const sql = "INSERT INTO generos (descripcion) VALUES (?)"
        db.query(sql, [descripcion], (error, result) => {
        if (error) {
            console.error("Error creando género:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }

        const genero = {
            id_genero: result.insertId,
            descripcion,
            fecha_creacion: new Date(),
        }
        res.status(201).json(genero)
        })
    })
    }

    // Actualizar un género
    const updateGenero = (req, res) => {
    const { id } = req.params
    const { descripcion } = req.body

    if (!descripcion) {
        return res.status(400).json({ error: "La descripción es obligatoria" })
    }

    // Verificar que no existe ya otro género con esa descripción
    db.query(
        "SELECT id_genero FROM generos WHERE descripcion = ? AND id_genero != ?",
        [descripcion, id],
        (error, results) => {
        if (error) {
            console.error("Error verificando género existente:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "ERROR: Ya existe otro género con esa descripción" })
        }

        const sql = "UPDATE generos SET descripcion = ? WHERE id_genero = ?"
        db.query(sql, [descripcion, id], (error, result) => {
            if (error) {
            console.error("Error actualizando género:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
            }
            if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: El género a modificar no existe" })
            }

            const genero = { id_genero: id, descripcion }
            res.json(genero)
        })
        },
    )
    }

    // Eliminar un género
    const deleteGenero = (req, res) => {
    const { id } = req.params

    // Verificar que no hay perfiles usando este género
    db.query("SELECT COUNT(*) as count FROM perfil_usuario WHERE genero_id = ?", [id], (error, results) => {
        if (error) {
        console.error("Error verificando uso del género:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }

        if (results[0].count > 0) {
        return res.status(400).json({
            error: "ERROR: No se puede eliminar el género porque está siendo usado por perfiles de usuario",
        })
        }

        const sql = "DELETE FROM generos WHERE id_genero = ?"
        db.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error eliminando género:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: El género a borrar no existe" })
        }
        res.json({ mensaje: "Género eliminado correctamente" })
        })
    })
    }

    module.exports = {
    getAllGeneros,
    getGeneroById,
    createGenero,
    updateGenero,
    deleteGenero,
    }
