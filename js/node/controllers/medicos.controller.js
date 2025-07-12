    /// CONTROLADORES DEL MODULO ///

    // Campos de la tabla medicos
    // id_medico
    // usuario_id
    // estado
    // especialidad_id

    const db = require("../db/db")

    //// METODO GET  /////

    // Para todos los/as medico/a
    const allMedic = (req, res) => {
    const sql = `
            SELECT 
                medicos.id_medico,
                medicos.usuario_id,
                medicos.especialidad_id,
                medicos.estado,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.email,
                especialidades.nombre AS especialidad
            FROM medicos
            INNER JOIN usuarios ON medicos.usuario_id = usuarios.id_usuario
            INNER JOIN especialidades ON medicos.especialidad_id = especialidades.id_especialidad
        `
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting medicos:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        console.log("Médicos obtenidos:", rows)
        res.json(rows)
    })
    }

    // Para un/a medico/a
    const showMedic = (req, res) => {
    const { id_medico } = req.params
    const sql = `
            SELECT 
                medicos.id_medico,
                medicos.usuario_id,
                medicos.especialidad_id,
                medicos.estado,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.email,
                especialidades.nombre AS especialidad
            FROM medicos
            INNER JOIN usuarios ON medicos.usuario_id = usuarios.id_usuario
            INNER JOIN especialidades ON medicos.especialidad_id = especialidades.id_especialidad
            WHERE medicos.id_medico = ?
        `
    db.query(sql, [id_medico], (error, rows) => {
        console.log("Médico específico:", rows)
        if (error) {
        console.error("Error getting medico:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe el medico buscado/a" })
        }
        res.json(rows[0])
    })
    }

    //// METODO POST  ////
    const storeMedic = (req, res) => {
    console.log("=== CREANDO MÉDICO ===")
    console.log("Body recibido:", req.body)

    const { usuario_id, estado, especialidad_id } = req.body

    if (!usuario_id || !estado || !especialidad_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." })
    }

    if (estado !== "libre" && estado !== "ocupado") {
        return res.status(400).json({ error: "Estado inválido. Debe ser 'libre' u 'ocupado'." })
    }

    const sql = "INSERT INTO medicos (usuario_id, estado, especialidad_id) VALUES (?, ?, ?)"
    db.query(sql, [usuario_id, estado, especialidad_id], (error, result) => {
        if (error) {
        console.error("Error creating medico:", error)
        return res.status(500).json({ error: "ERROR: Al ingresar nuevo medico" })
        }

        console.log("Médico creado con ID:", result.insertId)

        // Devolver el médico creado con todos los datos
        const medico = {
        id_medico: result.insertId,
        usuario_id: Number.parseInt(usuario_id),
        especialidad_id: Number.parseInt(especialidad_id),
        estado: estado,
        }

        res.status(201).json(medico)
    })
    }

    //// METODO PUT  ////
    const updateMedic = (req, res) => {
    console.log("=== ACTUALIZANDO MÉDICO ===")
    console.log("ID:", req.params.id_medico)
    console.log("Body:", req.body)

    const { id_medico } = req.params
    const { usuario_id, especialidad_id, estado } = req.body

    if (!estado || !especialidad_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." })
    }

    if (estado !== "libre" && estado !== "ocupado") {
        return res.status(400).json({ error: "Estado inválido. Debe ser 'libre' u 'ocupado'." })
    }

    // Si se proporciona usuario_id, también actualizarlo
    let sql, params
    if (usuario_id) {
        sql = `UPDATE medicos SET usuario_id = ?, estado = ?, especialidad_id = ? WHERE id_medico = ?`
        params = [usuario_id, estado, especialidad_id, id_medico]
    } else {
        sql = `UPDATE medicos SET estado = ?, especialidad_id = ? WHERE id_medico = ?`
        params = [estado, especialidad_id, id_medico]
    }

    db.query(sql, params, (error, result) => {
        if (error) {
        console.error("Error updating medico:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: El/la medico/a al modificar no existe" })
        }

        console.log("Médico actualizado exitosamente")

        const medico = {
        id_medico: Number.parseInt(id_medico),
        usuario_id: usuario_id ? Number.parseInt(usuario_id) : undefined,
        especialidad_id: Number.parseInt(especialidad_id),
        estado: estado,
        }

        res.json(medico)
    })
    }

    //// METODO DELETE ////
    const destroyMedic = (req, res) => {
    console.log("=== ELIMINANDO MÉDICO ===")
    console.log("ID:", req.params.id_medico)

    const { id_medico } = req.params
    const sql = "DELETE FROM medicos WHERE id_medico = ?"
    db.query(sql, [id_medico], (error, result) => {
        if (error) {
        console.error("Error deleting medico:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: Al borrar el/la medico/a no existe" })
        }

        console.log("Médico eliminado exitosamente")
        res.json({ message: "Medico/a Eliminado/a" })
    })
    }

    // EXPORTAR DEL MODULO TODAS LAS FUNCIONES
    module.exports = {
    allMedic,
    showMedic,
    storeMedic,
    updateMedic,
    destroyMedic,
    }
