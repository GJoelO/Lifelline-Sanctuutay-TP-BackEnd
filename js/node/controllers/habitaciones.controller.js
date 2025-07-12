    const db = require("../db/db")
    const fs = require("fs")
    const path = require("path")

    const allRooms = (req, res) => {
    const sql = `
        SELECT 
            id_habitacion,
            numero,
            tipo,
            piso,
            estado,
            imagen_habitacion,
            descripcion
        FROM habitaciones
    `
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting habitaciones:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        console.log("Habitaciones obtenidas:", rows)
        res.json(rows)
    })
    }

    const showRoom = (req, res) => {
    const { id_habitacion } = req.params
    const sql = `
        SELECT 
            id_habitacion,
            numero,
            tipo,
            piso,
            estado,
            imagen_habitacion,
            descripcion
        FROM habitaciones
        WHERE id_habitacion = ?
    `
    db.query(sql, [id_habitacion], (error, rows) => {
        if (error) {
        console.error("Error getting habitacion:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe la habitación buscada" })
        }
        console.log("Habitación específica:", rows[0])
        res.json(rows[0])
    })
    }

    const storeRoom = (req, res) => {
    console.log("=== CREANDO HABITACIÓN ===")
    console.log("Body recibido:", req.body)
    console.log("Archivo recibido:", req.file)

    const imageName = req.file ? req.file.filename : null
    const { numero, tipo, piso, estado, descripcion } = req.body

    if (!numero || !tipo || !piso || estado === undefined) {
        return res.status(400).json({ error: "Los campos numero, tipo, piso y estado son obligatorios." })
    }

    // Verificar que la carpeta de uploads exista
    const uploadDir = "./js/node/uploads/habitaciones"
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        console.log(`Directorio creado: ${uploadDir}`)
    }

    const sql = `
        INSERT INTO habitaciones (numero, tipo, piso, estado, imagen_habitacion, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)
    `
    db.query(sql, [numero, tipo, piso, estado, imageName, descripcion || null], (error, result) => {
        if (error) {
        console.error("Error creating habitacion:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        console.log("Habitación creada con ID:", result.insertId)

        const habitacion = {
        id_habitacion: result.insertId,
        numero,
        tipo,
        piso,
        estado,
        imagen_habitacion: imageName,
        descripcion: descripcion || null,
        }
        res.status(201).json(habitacion)
    })
    }

    const updateRoom = (req, res) => {
    console.log("=== ACTUALIZANDO HABITACIÓN ===")
    console.log("ID:", req.params.id_habitacion)
    console.log("Body:", req.body)
    console.log("Archivo:", req.file)

    const { id_habitacion } = req.params
    const { numero, tipo, piso, estado, descripcion } = req.body

    if (!numero || !tipo || !piso || estado === undefined) {
        return res.status(400).json({ error: "Los campos numero, tipo, piso y estado son obligatorios." })
    }

    // Construir la consulta SQL base
    let sql = "UPDATE habitaciones SET numero = ?, tipo = ?, piso = ?, estado = ?, descripcion = ?"
    const params = [numero, tipo, piso, estado, descripcion || null]

    // Si hay una nueva imagen, incluirla en la actualización
    if (req.file) {
        sql += ", imagen_habitacion = ?"
        params.push(req.file.filename)
        console.log("Nueva imagen detectada:", req.file.filename)
    }

    // Completar la consulta con la condición WHERE
    sql += " WHERE id_habitacion = ?"
    params.push(id_habitacion)

    console.log("SQL de actualización:", sql)
    console.log("Parámetros:", params)

    db.query(sql, params, (error, result) => {
        if (error) {
        console.error("Error updating habitacion:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: La habitación a modificar no existe" })
        }

        console.log("Habitación actualizada exitosamente")

        const habitacion = {
        id_habitacion: Number.parseInt(id_habitacion),
        numero,
        tipo,
        piso,
        estado,
        descripcion: descripcion || null,
        }

        // Incluir la imagen si se actualizó
        if (req.file) {
        habitacion.imagen_habitacion = req.file.filename
        }

        res.json(habitacion)
    })
    }

    const destroyRoom = (req, res) => {
    console.log("=== ELIMINANDO HABITACIÓN ===")
    console.log("ID:", req.params.id_habitacion)

    const { id_habitacion } = req.params

    // Primero verificar si la habitación tiene dependencias
    const checkDependenciesSQL = `
        SELECT 
        (SELECT COUNT(*) FROM turnos WHERE habitacion_id = ?) as turnos_count,
        (SELECT COUNT(*) FROM historiales_medicos WHERE habitacion_id = ?) as historiales_count
    `

    db.query(checkDependenciesSQL, [id_habitacion, id_habitacion], (checkError, checkResults) => {
        if (checkError) {
        console.error("Error checking dependencies:", checkError)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        const dependencies = checkResults[0]
        console.log("Dependencias encontradas:", dependencies)

        // Si hay dependencias, devolver un error
        if (dependencies.turnos_count > 0 || dependencies.historiales_count > 0) {
        let errorMessage = "No se puede eliminar la habitación porque tiene registros asociados en: "
        const associatedTables = []

        if (dependencies.turnos_count > 0) associatedTables.push(`turnos (${dependencies.turnos_count})`)
        if (dependencies.historiales_count > 0)
            associatedTables.push(`historiales médicos (${dependencies.historiales_count})`)

        errorMessage += associatedTables.join(", ")

        return res.status(400).json({
            error: errorMessage,
            dependencies: dependencies,
        })
        }

        // Si no hay dependencias, proceder con la eliminación
        const sql = "DELETE FROM habitaciones WHERE id_habitacion = ?"
        db.query(sql, [id_habitacion], (error, result) => {
        if (error) {
            console.error("Error deleting habitacion:", error)
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: La habitación a borrar no existe" })
        }

        console.log("Habitación eliminada exitosamente")
        res.json({ mensaje: "Habitación Eliminada" })
        })
    })
    }

    module.exports = {
    allRooms,
    showRoom,
    storeRoom,
    updateRoom,
    destroyRoom,
    }
