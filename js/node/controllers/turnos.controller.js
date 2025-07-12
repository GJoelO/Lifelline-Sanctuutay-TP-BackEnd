    const db = require("../db/db")

    const allShifts = (req, res) => {
    const sql = `
        SELECT 
                turnos.id_turno,
                turnos.usuario_id,
                turnos.medico_id,
                turnos.especialidad_id,
                turnos.obra_social_id,
                turnos.habitacion_id,
                turnos.fecha_turno,
                usuarios.nombre AS nombre_paciente,
                usuarios.apellido AS apellido_paciente,
                usuarios_medico.nombre AS nombre_medico,
                usuarios_medico.apellido AS apellido_medico,
                especialidades.nombre AS especialidad,
                obras_sociales.nombre AS obra_social,
                habitaciones.numero AS habitacion,
                habitaciones.tipo AS tipo_habitacion
            FROM turnos
            INNER JOIN usuarios ON turnos.usuario_id = usuarios.id_usuario
            INNER JOIN medicos ON turnos.medico_id = medicos.id_medico
            INNER JOIN usuarios AS usuarios_medico ON medicos.usuario_id = usuarios_medico.id_usuario
            INNER JOIN especialidades ON turnos.especialidad_id = especialidades.id_especialidad
            INNER JOIN obras_sociales ON turnos.obra_social_id = obras_sociales.id_OS
            INNER JOIN habitaciones ON turnos.habitacion_id = habitaciones.id_habitacion
        `

    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting turnos:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        console.log("Turnos obtenidos:", rows)
        res.json(rows)
    })
    }

    const showShift = (req, res) => {
    const { id_turno } = req.params
    const sql = `
        SELECT 
                turnos.id_turno,
                turnos.usuario_id,
                turnos.medico_id,
                turnos.especialidad_id,
                turnos.obra_social_id,
                turnos.habitacion_id,
                turnos.fecha_turno,
                usuarios.nombre AS nombre_paciente,
                usuarios.apellido AS apellido_paciente,
                usuarios_medico.nombre AS nombre_medico,
                usuarios_medico.apellido AS apellido_medico,
                especialidades.nombre AS especialidad,
                obras_sociales.nombre AS obra_social,
                habitaciones.numero AS habitacion
            FROM turnos
            INNER JOIN usuarios ON turnos.usuario_id = usuarios.id_usuario
            INNER JOIN medicos ON turnos.medico_id = medicos.id_medico
            INNER JOIN usuarios AS usuarios_medico ON medicos.usuario_id = usuarios_medico.id_usuario
            INNER JOIN especialidades ON turnos.especialidad_id = especialidades.id_especialidad
            INNER JOIN obras_sociales ON turnos.obra_social_id = obras_sociales.id_OS
            INNER JOIN habitaciones ON turnos.habitacion_id = habitaciones.id_habitacion
            WHERE turnos.id_turno = ?
        `
    db.query(sql, [id_turno], (error, rows) => {
        if (error) {
        console.error("Error getting turno:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe el turno buscado" })
        }
        console.log("Turno específico:", rows[0])
        res.json(rows[0])
    })
    }

    const storeShift = (req, res) => {
    const { usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno } = req.body

    console.log("=== CREANDO TURNO ===")
    console.log("Body recibido:", req.body)

    if (!usuario_id || !medico_id || !especialidad_id || !obra_social_id || !habitacion_id || !fecha_turno) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." })
    }

    const sql = `
            INSERT INTO turnos 
            (usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno)
            VALUES (?, ?, ?, ?, ?, ?)
        `
    db.query(
        sql,
        [usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno],
        (error, result) => {
        if (error) {
            console.error("Error creating turno:", error)
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        console.log("Turno creado con ID:", result.insertId)

        const turno = {
            id_turno: result.insertId,
            usuario_id: Number.parseInt(usuario_id),
            medico_id: Number.parseInt(medico_id),
            especialidad_id: Number.parseInt(especialidad_id),
            obra_social_id: Number.parseInt(obra_social_id),
            habitacion_id: Number.parseInt(habitacion_id),
            fecha_turno: fecha_turno,
        }
        res.status(201).json(turno)
        },
    )
    }

    const updateShift = (req, res) => {
    const { id_turno } = req.params
    const { usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno } = req.body

    console.log("=== ACTUALIZANDO TURNO ===")
    console.log("ID:", id_turno)
    console.log("Body:", req.body)

    if (!usuario_id || !medico_id || !especialidad_id || !obra_social_id || !habitacion_id || !fecha_turno) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." })
    }
    const sql = `
            UPDATE turnos SET 
                usuario_id = ?,
                medico_id = ?,
                especialidad_id = ?,
                obra_social_id = ?,
                habitacion_id = ?,
                fecha_turno = ?
            WHERE id_turno = ?
        `
    db.query(
        sql,
        [usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno, id_turno],
        (error, result) => {
        if (error) {
            console.error("Error updating turno:", error)
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: El turno a modificar no existe" })
        }

        console.log("Turno actualizado exitosamente")

        const turno = {
            id_turno: Number.parseInt(id_turno),
            usuario_id: Number.parseInt(usuario_id),
            medico_id: Number.parseInt(medico_id),
            especialidad_id: Number.parseInt(especialidad_id),
            obra_social_id: Number.parseInt(obra_social_id),
            habitacion_id: Number.parseInt(habitacion_id),
            fecha_turno: fecha_turno,
        }
        res.json(turno)
        },
    )
    }

    const destroyShift = (req, res) => {
    const { id_turno } = req.params

    console.log("=== ELIMINANDO TURNO ===")
    console.log("ID:", id_turno)

    const sql = "DELETE FROM turnos WHERE id_turno = ?"
    db.query(sql, [id_turno], (error, result) => {
        if (error) {
        console.error("Error deleting turno:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: El turno a borrar no existe" })
        }

        console.log("Turno eliminado exitosamente")
        res.json({ mensaje: "Turno Eliminado" })
    })
    }

module.exports = {
    allShifts,
    showShift,
    storeShift,
    updateShift,
    destroyShift,
}
