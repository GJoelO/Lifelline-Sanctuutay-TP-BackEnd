    const db = require("../db/db")
    const fs = require("fs")
    const path = require("path")

    const allHospitals = (req, res) => {
    const sql = `
            SELECT 
                id_hospital,
                imagen_hospital,
                descripcion
            FROM hospital
        `
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting hospital info:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        console.log("Información del hospital obtenida:", rows)
        res.json(rows)
    })
    }

    // NUEVA FUNCIÓN: Obtener información del hospital principal (el primero disponible)
    const getHospitalInfo = (req, res) => {
    console.log("=== OBTENIENDO INFO HOSPITAL PRINCIPAL ===")

    const sql = `
            SELECT 
                id_hospital,
                imagen_hospital,
                descripcion
            FROM hospital
            ORDER BY id_hospital ASC
            LIMIT 1
        `

    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting hospital principal:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        if (rows.length == 0) {
        console.log("No hay hospitales en la base de datos")
        return res.status(404).json({ error: "No hay información del hospital disponible" })
        }

        console.log("=== DEBUG HOSPITAL PRINCIPAL ===")
        console.log("Hospital principal encontrado:", rows[0])
        console.log("ID del hospital:", rows[0].id_hospital)
        console.log("Imagen del hospital:", rows[0].imagen_hospital)
        console.log("=== FIN DEBUG ===")

        res.json(rows[0])
    })
    }

    const showHospital = (req, res) => {
    const { id_hospital } = req.params
    const sql = `
            SELECT 
                id_hospital,
                imagen_hospital,
                descripcion
            FROM hospital
            WHERE id_hospital = ?
        `
    db.query(sql, [id_hospital], (error, rows) => {
        if (error) {
        console.error("Error getting hospital:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (rows.length == 0) {
        return res.status(404).send({ error: "ERROR: No existe la información del hospital buscada" })
        }

        console.log("=== DEBUG HOSPITAL INFO ===")
        console.log("Información específica del hospital:", rows[0])
        console.log("Imagen del hospital:", rows[0].imagen_hospital)
        console.log("Ruta completa de imagen:", `/uploads/hospital/${rows[0].imagen_hospital}`)
        console.log("=== FIN DEBUG ===")

        res.json(rows[0])
    })
    }

    const storeHospital = (req, res) => {
    console.log("=== CREANDO INFORMACIÓN DEL HOSPITAL ===")
    console.log("Body recibido:", req.body)
    console.log("Archivo recibido:", req.file)

    const imageName = req.file ? req.file.filename : null
    const { descripcion } = req.body

    if (!descripcion) {
        return res.status(400).json({ error: "El campo descripción es obligatorio." })
    }

    // Verificar que la carpeta de uploads exista
    const uploadDir = "./js/node/uploads/hospital"
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
        console.log(`Directorio creado: ${uploadDir}`)
    }

    const sql = `
            INSERT INTO hospital (imagen_hospital, descripcion)
            VALUES (?, ?)
        `
    db.query(sql, [imageName, descripcion], (error, result) => {
        if (error) {
        console.error("Error creating hospital info:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }

        console.log("Información del hospital creada con ID:", result.insertId)

        const hospital = {
        id_hospital: result.insertId,
        imagen_hospital: imageName,
        descripcion,
        }
        res.status(201).json(hospital)
    })
    }

    const updateHospital = (req, res) => {
    console.log("=== ACTUALIZANDO INFORMACIÓN DEL HOSPITAL ===")
    console.log("ID:", req.params.id_hospital)
    console.log("Body:", req.body)
    console.log("Archivo:", req.file)

    const { id_hospital } = req.params
    const { descripcion } = req.body

    if (!descripcion) {
        return res.status(400).json({ error: "El campo descripción es obligatorio." })
    }

    // Construir la consulta SQL base
    let sql = "UPDATE hospital SET descripcion = ?"
    const params = [descripcion]

    // Si hay una nueva imagen, incluirla en la actualización
    if (req.file) {
        sql += ", imagen_hospital = ?"
        params.push(req.file.filename)
        console.log("Nueva imagen detectada:", req.file.filename)
    }

    // Completar la consulta con la condición WHERE
    sql += " WHERE id_hospital = ?"
    params.push(id_hospital)

    console.log("SQL de actualización:", sql)
    console.log("Parámetros:", params)

    db.query(sql, params, (error, result) => {
        if (error) {
        console.error("Error updating hospital:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: La información del hospital a modificar no existe" })
        }

        console.log("Información del hospital actualizada exitosamente")

        const hospital = {
        id_hospital: Number.parseInt(id_hospital),
        descripcion,
        }

        // Incluir la imagen si se actualizó
        if (req.file) {
        hospital.imagen_hospital = req.file.filename
        }

        res.json(hospital)
    })
    }

    const destroyHospital = (req, res) => {
    console.log("=== ELIMINANDO INFORMACIÓN DEL HOSPITAL ===")
    console.log("ID:", req.params.id_hospital)

    const { id_hospital } = req.params

    const sql = "DELETE FROM hospital WHERE id_hospital = ?"
    db.query(sql, [id_hospital], (error, result) => {
        if (error) {
        console.error("Error deleting hospital:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).send({ error: "ERROR: La información del hospital a borrar no existe" })
        }

        console.log("Información del hospital eliminada exitosamente")
        res.json({ mensaje: "Información del Hospital Eliminada" })
    })
    }

    module.exports = {
    allHospitals,
    showHospital,
    storeHospital,
    updateHospital,
    destroyHospital,
    getHospitalInfo, // NUEVA FUNCIÓN EXPORTADA
    }
