    /// CONTROLADORES DEL MODULO ///

    const db = require("../db/db")
    const fs = require("fs")
    const path = require("path")

    //// METODO GET  /////

    // Para todas las especialidades
    const allSpecialty = (req, res) => {
    const sql = "SELECT * FROM especialidades"
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting especialidades:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        console.log("Especialidades obtenidas:", rows)
        res.json(rows)
    })
    }

    // Para una especialidad
    const showSpecialty = (req, res) => {
    const { id_especialidad } = req.params
    const sql = "SELECT * FROM especialidades WHERE id_especialidad = ?"
    db.query(sql, [id_especialidad], (error, rows) => {
        if (error) {
        console.error("Error getting especialidad:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe la especialidad buscada" })
        }
        console.log("Especialidad específica:", rows[0])
        res.json(rows[0])
    })
    }

    //// METODO POST  ////
    const storeSpecialty = (req, res) => {
    console.log("=== CREANDO ESPECIALIDAD ===")
    console.log("Body recibido:", req.body)
    console.log("Archivo recibido:", req.file)

    const imageName = req.file ? req.file.filename : null
    const { nombre, descripcion } = req.body

    if (!nombre) {
        return res.status(400).json({ error: "El nombre es obligatorio" })
    }

    // Verificar que la carpeta de uploads exista
    const uploadDir = "./js/node/uploads/especialidades"
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        console.log(`Directorio creado: ${uploadDir}`)
    }

    const sql = "INSERT INTO especialidades (nombre, imagen_especialidad, descripcion) VALUES (?, ?, ?)"
    db.query(sql, [nombre, imageName, descripcion || null], (error, result) => {
        if (error) {
        console.error("Error creating especialidad:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        console.log("Especialidad creada con ID:", result.insertId)

        const especialidad = {
        id_especialidad: result.insertId,
        nombre,
        imagen_especialidad: imageName,
        descripcion: descripcion || null,
        }
        res.status(201).json(especialidad)
    })
    }

    //// METODO PUT  ////
    const updateSpecialty = (req, res) => {
    console.log("=== ACTUALIZANDO ESPECIALIDAD ===")
    console.log("ID:", req.params.id_especialidad)
    console.log("Body:", req.body)
    console.log("Archivo:", req.file)

    const { id_especialidad } = req.params
    const { nombre, descripcion } = req.body

    if (!nombre) {
        return res.status(400).json({ error: "El nombre es obligatorio" })
    }

    // Construir la consulta SQL base
    let sql = "UPDATE especialidades SET nombre = ?, descripcion = ?"
    const params = [nombre, descripcion || null]

    // Si hay una nueva imagen, incluirla en la actualización
    if (req.file) {
        sql += ", imagen_especialidad = ?"
        params.push(req.file.filename)
        console.log("Nueva imagen detectada:", req.file.filename)
    }

    // Completar la consulta con la condición WHERE
    sql += " WHERE id_especialidad = ?"
    params.push(id_especialidad)

    console.log("SQL de actualización:", sql)
    console.log("Parámetros:", params)

    db.query(sql, params, (error, result) => {
        if (error) {
        console.error("Error updating especialidad:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: La especialidad a modificar no existe" })
        }

        console.log("Especialidad actualizada exitosamente")

        const especialidad = {
        id_especialidad: Number.parseInt(id_especialidad),
        nombre,
        descripcion: descripcion || null,
        }

        // Incluir la imagen si se actualizó
        if (req.file) {
        especialidad.imagen_especialidad = req.file.filename
        }

        res.json(especialidad)
    })
    }

    //// METODO DELETE ////
    const destroySpecialty = (req, res) => {
    console.log("=== ELIMINANDO ESPECIALIDAD ===")
    console.log("ID:", req.params.id_especialidad)

    const { id_especialidad } = req.params

    // Primero verificar si la especialidad tiene dependencias
    const checkDependenciesSQL = `
        SELECT 
        (SELECT COUNT(*) FROM medicos WHERE especialidad_id = ?) as medicos_count,
        (SELECT COUNT(*) FROM turnos WHERE especialidad_id = ?) as turnos_count,
        (SELECT COUNT(*) FROM historiales_medicos WHERE especialidad_id = ?) as historiales_count
    `

    db.query(checkDependenciesSQL, [id_especialidad, id_especialidad, id_especialidad], (checkError, checkResults) => {
        if (checkError) {
        console.error("Error checking dependencies:", checkError)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        const dependencies = checkResults[0]
        console.log("Dependencias encontradas:", dependencies)

        // Si hay dependencias, devolver un error
        if (dependencies.medicos_count > 0 || dependencies.turnos_count > 0 || dependencies.historiales_count > 0) {
        let errorMessage = "No se puede eliminar la especialidad porque tiene registros asociados en: "
        const associatedTables = []

        if (dependencies.medicos_count > 0) associatedTables.push(`médicos (${dependencies.medicos_count})`)
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
        const sql = "DELETE FROM especialidades WHERE id_especialidad = ?"
        db.query(sql, [id_especialidad], (error, result) => {
        if (error) {
            console.error("Error deleting especialidad:", error)
            return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
            return res.status(404).send({ error: "ERROR: Al borrar la especialidad no existe" })
        }

        console.log("Especialidad eliminada exitosamente")
        res.json({ mensaje: "Especialidad Eliminada" })
        })
    })
    }

    // EXPORTAR DEL MODULO TODAS LAS FUNCIONES
    module.exports = {
    allSpecialty,
    showSpecialty,
    storeSpecialty,
    updateSpecialty,
    destroySpecialty,
    }
