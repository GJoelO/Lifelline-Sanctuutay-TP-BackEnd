    const db = require("../db/db")
    const bcrypt = require("bcryptjs")

    //// METODO GET  /////

    const allUsers = (req, res) => {
    const sql = `
            SELECT 
                usuarios.id_usuario,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.dni,
                usuarios.email,
                usuarios.telefono,
                usuarios.contrasena,
                usuarios.foto_perfil,
                usuarios.rol_id,
                roles.nombre AS rol
            FROM usuarios
            LEFT JOIN roles ON usuarios.rol_id = roles.id_rol
        `
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting users:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor." })
        }
        res.json(rows)
    })
    }

    // NUEVO: Obtener solo usuarios con rol de médico
    const getMedicalUsers = (req, res) => {
    const sql = `
            SELECT 
                usuarios.id_usuario,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.dni,
                usuarios.email,
                usuarios.telefono,
                usuarios.foto_perfil,
                usuarios.rol_id,
                roles.nombre AS rol
            FROM usuarios
            LEFT JOIN roles ON usuarios.rol_id = roles.id_rol
            WHERE roles.nombre = 'medico' OR roles.nombre = 'Medico' OR roles.nombre = 'MEDICO'
        `
    db.query(sql, (error, rows) => {
        if (error) {
        console.error("Error getting medical users:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor." })
        }
        console.log("Usuarios médicos encontrados:", rows)
        res.json(rows)
    })
    }

    const showUser = (req, res) => {
    const { id_usuario } = req.params
    const sql = `
            SELECT 
                usuarios.id_usuario,
                usuarios.nombre,
                usuarios.apellido,
                usuarios.dni,
                usuarios.email,
                usuarios.telefono,
                usuarios.contrasena,
                usuarios.foto_perfil,
                usuarios.rol_id,
                roles.nombre AS rol
            FROM usuarios
            LEFT JOIN roles ON usuarios.rol_id = roles.id_rol
            WHERE usuarios.id_usuario = ?
        `
    db.query(sql, [id_usuario], (error, rows) => {
        if (error) {
        console.error("Error getting user:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor." })
        }
        if (rows.length === 0) {
        return res.status(404).json({ error: "ERROR: No existe el usuario buscado." })
        }
        res.json(rows[0])
    })
    }

    //// METODO POST (Crear usuario desde admin) ////
    const createUser = (req, res) => {
    console.log("=== CREANDO USUARIO DESDE ADMIN ===")
    console.log("Body recibido:", req.body)
    console.log("Archivo recibido:", req.file)

    const imageName = req.file ? req.file.filename : null
    const { nombre, apellido, dni, email, telefono, contrasena, rol_id } = req.body

    // Validar campos requeridos
    if (!nombre || !apellido || !dni || !email || !telefono || !contrasena) {
        console.log("Campos faltantes:", { nombre, apellido, dni, email, telefono, contrasena: !!contrasena })
        return res.status(400).json({ error: "Todos los campos son obligatorios" })
    }

    // Verificar si el usuario ya existe
    db.query("SELECT * FROM usuarios WHERE email = ? OR dni = ?", [email, dni], (error, results) => {
        if (error) {
        console.error("Error checking existing user:", error)
        return res.status(500).json({ error: "Error verificando usuario existente" })
        }

        if (results.length > 0) {
        console.log("Usuario ya existe:", results[0])
        return res.status(400).json({ error: "Ya existe un usuario con ese email o DNI" })
        }

        // Encriptar contraseña
        bcrypt.hash(contrasena, 8, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err)
            return res.status(500).json({ error: "Error encriptando contraseña" })
        }

        // Insertar usuario
        const sql = `
            INSERT INTO usuarios (nombre, apellido, dni, email, telefono, contrasena, foto_perfil, rol_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [nombre, apellido, dni, email, telefono, hash, imageName, rol_id || 1]
        console.log("Ejecutando SQL:", sql)
        console.log("Con valores:", values)

        db.query(sql, values, (insertError, result) => {
            if (insertError) {
            console.error("Error inserting user:", insertError)
            return res.status(500).json({ error: "Error creando usuario", details: insertError.message })
            }

            console.log("Usuario creado exitosamente:", result)
            res.status(201).json({
            message: "Usuario creado exitosamente",
            user: {
                id_usuario: result.insertId,
                nombre,
                apellido,
                dni,
                email,
                telefono,
                foto_perfil: imageName,
                rol_id,
            },
            })
        })
        })
    })
    }

    //// METODO PUT  ////
    const updateUser = (req, res) => {
    const { id_usuario } = req.params
    const { nombre, apellido, dni, email, telefono, contrasena, rol_id } = req.body

    console.log("=== ACTUALIZANDO USUARIO ===")
    console.log("ID:", id_usuario)
    console.log("Body:", req.body)
    console.log("Archivo:", req.file)

    // Verificar si hay un archivo de imagen
    let imageName = null
    if (req.file) {
        imageName = req.file.filename
    }

    if (!nombre || !apellido || !dni || !email || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" })
    }

    // Construir la consulta SQL base
    let sql = `
            UPDATE usuarios 
            SET 
                nombre = ?,
                apellido = ?,
                dni = ?, 
                email = ?,  
                telefono = ?, 
                rol_id = ?
        `

    // Parámetros para la consulta
    const params = [nombre, apellido, dni, email, telefono, rol_id]

    // Si se proporciona una contraseña, incluirla en la actualización
    if (contrasena && contrasena.trim() !== "") {
        // Encriptar la nueva contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 8)
        sql += `, contrasena = ?`
        params.push(hashedPassword)
    }

    // Si hay una nueva imagen, incluirla en la actualización
    if (imageName) {
        sql += `, foto_perfil = ?`
        params.push(imageName)
    }

    // Completar la consulta con la condición WHERE
    sql += ` WHERE id_usuario = ?`
    params.push(id_usuario)

    console.log("SQL de actualización:", sql)
    console.log("Parámetros:", params)

    db.query(sql, params, (error, result) => {
        if (error) {
        console.error("Error en la consulta SQL:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor." })
        }
        if (result.affectedRows == 0) {
        return res.status(404).json({ error: "ERROR: El usuario a modificar no existe." })
        }

        console.log("Usuario actualizado exitosamente")
        // Construir el objeto de respuesta
        const updatedUser = {
        id_usuario,
        nombre,
        apellido,
        dni,
        email,
        telefono,
        rol_id,
        }

        // Incluir la foto si se actualizó
        if (imageName) {
        updatedUser.foto_perfil = imageName
        }

        res.json({ message: "Usuario actualizado exitosamente", user: updatedUser })
    })
    }

    //// METODO DELETE ////
    const destroyUser = (req, res) => {
    const { id_usuario } = req.params
    console.log("=== ELIMINANDO USUARIO ===")
    console.log("ID:", id_usuario)

    const sql = "DELETE FROM usuarios WHERE id_usuario = ?"
    db.query(sql, [id_usuario], (error, result) => {
        if (error) {
        console.error("Error deleting user:", error)
        return res.status(500).json({ error: "ERROR: Intente mas tarde por favor" })
        }
        if (result.affectedRows == 0) {
        return res.status(404).json({ error: "ERROR: El usuario a borrar no existe" })
        }
        console.log("Usuario eliminado exitosamente")
        res.json({ message: "Usuario eliminado exitosamente" })
    })
    }

    // EXPORTAR DEL MODULO TODAS LAS FUNCIONES
    module.exports = {
    allUsers,
    getMedicalUsers,
    showUser,
    createUser,
    updateUser,
    destroyUser,
    }
