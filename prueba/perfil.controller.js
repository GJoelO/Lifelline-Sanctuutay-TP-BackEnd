    const db = require("../js/node/db/db")
    const multer = require("multer")
    const path = require("path")
    const fs = require("fs")

    // Obtener perfil del usuario
    const getPerfilUsuario = (req, res) => {
    const userId = req.userId

    const sql = `
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.dni,
                u.email,
                u.telefono,
                u.foto_perfil,
                p.genero_id,
                p.cuil,
                p.calle,
                p.numero,
                p.localidad,
                p.barrio,
                g.descripcion as genero_descripcion
            FROM usuarios u
            LEFT JOIN perfil_usuario p ON u.id_usuario = p.usuario_id
            LEFT JOIN generos g ON p.genero_id = g.id_genero
            WHERE u.id_usuario = ?
        `

    db.query(sql, [userId], (error, results) => {
        if (error) {
        console.error("Error obteniendo perfil:", error)
        return res.status(500).json({ error: "Error obteniendo perfil del usuario" })
        }

        if (results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" })
        }

        const user = results[0]
        res.json({
        usuario: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            dni: user.dni,
            email: user.email,
            telefono: user.telefono,
            foto_perfil: user.foto_perfil,
        },
        perfil: {
            genero_id: user.genero_id,
            cuil: user.cuil,
            calle: user.calle,
            numero: user.numero,
            localidad: user.localidad,
            barrio: user.barrio,
            genero_descripcion: user.genero_descripcion,
        },
        })
    })
    }

    // Actualizar perfil del usuario
    const updatePerfilUsuario = (req, res) => {
    const userId = req.userId
    const { nombre, apellido, genero_id, cuil } = req.body
    const imageName = req.file ? req.file.filename : null

    console.log("Actualizando perfil para usuario:", userId)
    console.log("Datos recibidos:", { nombre, apellido, genero_id, cuil })
    console.log("Imagen:", imageName)

    // Validar campos requeridos
    if (!nombre || !apellido) {
        return res.status(400).json({ error: "Nombre y apellido son obligatorios" })
    }

    // Actualizar datos básicos del usuario
    let updateUserSql = "UPDATE usuarios SET nombre = ?, apellido = ?"
    const userParams = [nombre, apellido]

    if (imageName) {
        updateUserSql += ", foto_perfil = ?"
        userParams.push(imageName)
    }

    updateUserSql += " WHERE id_usuario = ?"
    userParams.push(userId)

    db.query(updateUserSql, userParams, (error, result) => {
        if (error) {
        console.error("Error actualizando usuario:", error)
        return res.status(500).json({ error: "Error actualizando datos del usuario" })
        }

        // Verificar si existe perfil del usuario
        db.query("SELECT * FROM perfil_usuario WHERE usuario_id = ?", [userId], (error, profileResults) => {
        if (error) {
            console.error("Error verificando perfil:", error)
            return res.status(500).json({ error: "Error verificando perfil" })
        }

        const profileData = {
            genero_id: genero_id || null,
            cuil: cuil || null,
        }

        if (profileResults.length === 0) {
            // Crear nuevo perfil
            const insertSql = "INSERT INTO perfil_usuario (usuario_id, genero_id, cuil) VALUES (?, ?, ?)"
            db.query(insertSql, [userId, profileData.genero_id, profileData.cuil], (error, insertResult) => {
            if (error) {
                console.error("Error creando perfil:", error)
                return res.status(500).json({ error: "Error creando perfil" })
            }

            res.json({
                message: "Perfil actualizado correctamente",
                foto_perfil: imageName,
            })
            })
        } else {
            // Actualizar perfil existente
            const updateSql = "UPDATE perfil_usuario SET genero_id = ?, cuil = ? WHERE usuario_id = ?"
            db.query(updateSql, [profileData.genero_id, profileData.cuil, userId], (error, updateResult) => {
            if (error) {
                console.error("Error actualizando perfil:", error)
                return res.status(500).json({ error: "Error actualizando perfil" })
            }

            res.json({
                message: "Perfil actualizado correctamente",
                foto_perfil: imageName,
            })
            })
        }
        })
    })
    }

    // Obtener domicilio del usuario
    const getDomicilioUsuario = (req, res) => {
    const userId = req.userId

    const sql = `
            SELECT calle, numero, localidad, barrio
            FROM perfil_usuario
            WHERE usuario_id = ?
        `

    db.query(sql, [userId], (error, results) => {
        if (error) {
        console.error("Error obteniendo domicilio:", error)
        return res.status(500).json({ error: "Error obteniendo domicilio" })
        }

        if (results.length === 0) {
        return res.json({ domicilio: null })
        }

        res.json({ domicilio: results[0] })
    })
    }

    // Actualizar domicilio del usuario
    const updateDomicilioUsuario = (req, res) => {
    const userId = req.userId
    const { calle, numero, localidad, barrio } = req.body

    console.log("Actualizando domicilio para usuario:", userId)
    console.log("Datos:", { calle, numero, localidad, barrio })

    // Verificar si existe perfil del usuario
    db.query("SELECT * FROM perfil_usuario WHERE usuario_id = ?", [userId], (error, results) => {
        if (error) {
        console.error("Error verificando perfil:", error)
        return res.status(500).json({ error: "Error verificando perfil" })
        }

        if (results.length === 0) {
        // Crear nuevo perfil con domicilio
        const insertSql =
            "INSERT INTO perfil_usuario (usuario_id, calle, numero, localidad, barrio) VALUES (?, ?, ?, ?, ?)"
        db.query(insertSql, [userId, calle, numero, localidad, barrio], (error, insertResult) => {
            if (error) {
            console.error("Error creando perfil con domicilio:", error)
            return res.status(500).json({ error: "Error guardando domicilio" })
            }

            res.json({ message: "Domicilio guardado correctamente" })
        })
        } else {
        // Actualizar domicilio existente
        const updateSql =
            "UPDATE perfil_usuario SET calle = ?, numero = ?, localidad = ?, barrio = ? WHERE usuario_id = ?"
        db.query(updateSql, [calle, numero, localidad, barrio, userId], (error, updateResult) => {
            if (error) {
            console.error("Error actualizando domicilio:", error)
            return res.status(500).json({ error: "Error actualizando domicilio" })
            }

            res.json({ message: "Domicilio actualizado correctamente" })
        })
        }
    })
    }

    // Obtener contactos del usuario
    const getContactosUsuario = (req, res) => {
    const userId = req.userId

    const sql = `
            SELECT id_contacto, tipo, contacto, fecha_creacion
            FROM contactos_usuario
            WHERE usuario_id = ?
            ORDER BY fecha_creacion DESC
        `

    db.query(sql, [userId], (error, results) => {
        if (error) {
        console.error("Error obteniendo contactos:", error)
        return res.status(500).json({ error: "Error obteniendo contactos" })
        }

        res.json(results)
    })
    }

    // Obtener un contacto específico
    const getContactoUsuario = (req, res) => {
    const userId = req.userId
    const { id } = req.params

    const sql = `
            SELECT id_contacto, tipo, contacto
            FROM contactos_usuario
            WHERE id_contacto = ? AND usuario_id = ?
        `

    db.query(sql, [id, userId], (error, results) => {
        if (error) {
        console.error("Error obteniendo contacto:", error)
        return res.status(500).json({ error: "Error obteniendo contacto" })
        }

        if (results.length === 0) {
        return res.status(404).json({ error: "Contacto no encontrado" })
        }

        res.json(results[0])
    })
    }

    // Crear contacto del usuario
    const createContactoUsuario = (req, res) => {
    const userId = req.userId
    const { tipo, contacto } = req.body

    console.log("Creando contacto para usuario:", userId)
    console.log("Datos:", { tipo, contacto })

    if (!tipo || !contacto) {
        return res.status(400).json({ error: "Tipo y contacto son obligatorios" })
    }

    const sql = "INSERT INTO contactos_usuario (usuario_id, tipo, contacto) VALUES (?, ?, ?)"
    db.query(sql, [userId, tipo, contacto], (error, result) => {
        if (error) {
        console.error("Error creando contacto:", error)
        return res.status(500).json({ error: "Error creando contacto" })
        }

        res.status(201).json({
        message: "Contacto creado correctamente",
        id_contacto: result.insertId,
        })
    })
    }

    // Actualizar contacto del usuario
    const updateContactoUsuario = (req, res) => {
    const userId = req.userId
    const { id } = req.params
    const { tipo, contacto } = req.body

    console.log("Actualizando contacto:", id, "para usuario:", userId)
    console.log("Datos:", { tipo, contacto })

    if (!tipo || !contacto) {
        return res.status(400).json({ error: "Tipo y contacto son obligatorios" })
    }

    const sql = "UPDATE contactos_usuario SET tipo = ?, contacto = ? WHERE id_contacto = ? AND usuario_id = ?"
    db.query(sql, [tipo, contacto, id, userId], (error, result) => {
        if (error) {
        console.error("Error actualizando contacto:", error)
        return res.status(500).json({ error: "Error actualizando contacto" })
        }

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Contacto no encontrado" })
        }

        res.json({ message: "Contacto actualizado correctamente" })
    })
    }

    // Eliminar contacto del usuario
    const deleteContactoUsuario = (req, res) => {
    const userId = req.userId
    const { id } = req.params

    console.log("Eliminando contacto:", id, "para usuario:", userId)

    const sql = "DELETE FROM contactos_usuario WHERE id_contacto = ? AND usuario_id = ?"
    db.query(sql, [id, userId], (error, result) => {
        if (error) {
        console.error("Error eliminando contacto:", error)
        return res.status(500).json({ error: "Error eliminando contacto" })
        }

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Contacto no encontrado" })
        }

        res.json({ message: "Contacto eliminado correctamente" })
    })
    }

    // Actualizar la función getHistorialUsuario para usar la estructura existente y agregar los campos faltantes

    // Obtener historial médico del usuario
    const getHistorialUsuario = (req, res) => {
    const userId = req.userId

    const sql = `
            SELECT 
                hm.id_HistMedic,
                hm.fecha,
                hm.diagnostico,
                hm.tratamiento,
                hm.observaciones,
                hm.comprobante,
                usuarios_medico.nombre as medico_nombre,
                usuarios_medico.apellido as medico_apellido,
                especialidades.nombre as especialidad_nombre,
                habitaciones.numero as numero_habitacion,
                habitaciones.tipo as tipo_habitacion
            FROM historiales_medicos hm
            INNER JOIN medicos ON hm.medico_id = medicos.id_medico
            INNER JOIN usuarios AS usuarios_medico ON medicos.usuario_id = usuarios_medico.id_usuario
            LEFT JOIN especialidades ON hm.especialidad_id = especialidades.id_especialidad
            LEFT JOIN habitaciones ON hm.habitacion_id = habitaciones.id_habitacion
            WHERE hm.usuario_id = ?
            ORDER BY hm.fecha DESC
        `

    db.query(sql, [userId], (error, results) => {
        if (error) {
        console.error("Error obteniendo historial médico:", error)
        return res.status(500).json({ error: "Error obteniendo historial médico" })
        }

        res.json(results)
    })
    }

    // ========== MÉTODOS CRUD PARA PERFILES ==========

    // Obtener todos los perfiles (para administradores)
    const allPerfiles = (req, res) => {
    const sql = `
        SELECT 
        p.id_perfil,
        p.usuario_id,
        u.nombre,
        u.apellido,
        u.dni,
        u.email,
        u.telefono,
        u.foto_perfil,
        p.genero_id,
        g.descripcion as genero_descripcion,
        p.cuil,
        p.calle,
        p.numero,
        p.localidad,
        p.barrio
        FROM perfil_usuario p
        INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
        LEFT JOIN generos g ON p.genero_id = g.id_genero
        ORDER BY u.nombre, u.apellido
    `

    db.query(sql, (error, results) => {
        if (error) {
        console.error("Error obteniendo perfiles:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        res.json(results)
    })
    }

    // Obtener un perfil específico por ID
    const showPerfil = (req, res) => {
    const { id_perfil } = req.params
    const sql = `
        SELECT 
        p.id_perfil,
        p.usuario_id,
        u.nombre,
        u.apellido,
        u.dni,
        u.email,
        u.telefono,
        u.foto_perfil,
        p.genero_id,
        g.descripcion as genero_descripcion,
        p.cuil,
        p.calle,
        p.numero,
        p.localidad,
        p.barrio
        FROM perfil_usuario p
        INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
        LEFT JOIN generos g ON p.genero_id = g.id_genero
        WHERE p.id_perfil = ?
    `

    db.query(sql, [id_perfil], (error, results) => {
        if (error) {
        console.error("Error obteniendo perfil:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (results.length === 0) {
        return res.status(404).json({ error: "ERROR: No existe el perfil buscado" })
        }
        res.json(results[0])
    })
    }

    // Crear un nuevo perfil
    const createPerfil = (req, res) => {
    const { usuario_id, genero_id, cuil, calle, numero, localidad, barrio } = req.body

    if (!usuario_id) {
        return res.status(400).json({ error: "El ID de usuario es obligatorio" })
    }

    // Verificar que el usuario existe
    db.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ?", [usuario_id], (error, userResults) => {
        if (error) {
        console.error("Error verificando usuario:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (userResults.length === 0) {
        return res.status(404).json({ error: "ERROR: El usuario no existe" })
        }

        // Verificar que no existe ya un perfil para este usuario
        db.query("SELECT id_perfil FROM perfil_usuario WHERE usuario_id = ?", [usuario_id], (error, profileResults) => {
        if (error) {
            console.error("Error verificando perfil existente:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (profileResults.length > 0) {
            return res.status(400).json({ error: "ERROR: Ya existe un perfil para este usuario" })
        }

        // Crear el perfil
        const sql = `
            INSERT INTO perfil_usuario (usuario_id, genero_id, cuil, calle, numero, localidad, barrio)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `
        db.query(
            sql,
            [usuario_id, genero_id || null, cuil || null, calle || null, numero || null, localidad || null, barrio || null],
            (error, result) => {
            if (error) {
                console.error("Error creando perfil:", error)
                return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
            }

            const perfil = {
                id_perfil: result.insertId,
                usuario_id,
                genero_id,
                cuil,
                calle,
                numero,
                localidad,
                barrio,
                fecha_creacion: new Date(),
            }
            res.status(201).json(perfil)
            },
        )
        })
    })
    }

    // Actualizar un perfil específico
    const updatePerfil = (req, res) => {
    const { id_perfil } = req.params
    const { genero_id, cuil, calle, numero, localidad, barrio } = req.body

    const sql = `
        UPDATE perfil_usuario 
        SET genero_id = ?, cuil = ?, calle = ?, numero = ?, localidad = ?, barrio = ?
        WHERE id_perfil = ?
    `

    db.query(
        sql,
        [genero_id || null, cuil || null, calle || null, numero || null, localidad || null, barrio || null, id_perfil],
        (error, result) => {
        if (error) {
            console.error("Error actualizando perfil:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "ERROR: El perfil a modificar no existe" })
        }

        const perfil = { id_perfil, genero_id, cuil, calle, numero, localidad, barrio }
        res.json(perfil)
        },
    )
    }

    // Eliminar un perfil
    const destroyPerfil = (req, res) => {
    const { id_perfil } = req.params

    const sql = "DELETE FROM perfil_usuario WHERE id_perfil = ?"
    db.query(sql, [id_perfil], (error, result) => {
        if (error) {
        console.error("Error eliminando perfil:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "ERROR: El perfil a borrar no existe" })
        }
        res.json({ mensaje: "Perfil eliminado correctamente" })
    })
    }

    // ========== MÉTODOS CRUD PARA CONTACTOS ==========

    // Obtener todos los contactos (para administradores)
    const allContactos = (req, res) => {
    const sql = `
        SELECT 
        c.id_contacto,
        c.usuario_id,
        u.nombre,
        u.apellido,
        u.dni,
        c.tipo,
        c.contacto,
        c.fecha_creacion
        FROM contactos_usuario c
        INNER JOIN usuarios u ON c.usuario_id = u.id_usuario
        ORDER BY c.fecha_creacion DESC
    `

    db.query(sql, (error, results) => {
        if (error) {
        console.error("Error obteniendo contactos:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        res.json(results)
    })
    }

    // Obtener un contacto específico por ID
    const showContacto = (req, res) => {
    const { id_contacto } = req.params
    const sql = `
        SELECT 
        c.id_contacto,
        c.usuario_id,
        u.nombre,
        u.apellido,
        u.dni,
        c.tipo,
        c.contacto,
        c.fecha_creacion
        FROM contactos_usuario c
        INNER JOIN usuarios u ON c.usuario_id = u.id_usuario
        WHERE c.id_contacto = ?
    `

    db.query(sql, [id_contacto], (error, results) => {
        if (error) {
        console.error("Error obteniendo contacto:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (results.length === 0) {
        return res.status(404).json({ error: "ERROR: No existe el contacto buscado" })
        }
        res.json(results[0])
    })
    }

    // Crear un nuevo contacto
    const createContacto = (req, res) => {
    const { usuario_id, tipo, contacto } = req.body

    if (!usuario_id || !tipo || !contacto) {
        return res.status(400).json({ error: "Usuario ID, tipo y contacto son obligatorios" })
    }

    // Verificar que el usuario existe
    db.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ?", [usuario_id], (error, userResults) => {
        if (error) {
        console.error("Error verificando usuario:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (userResults.length === 0) {
        return res.status(404).json({ error: "ERROR: El usuario no existe" })
        }

        const sql = "INSERT INTO contactos_usuario (usuario_id, tipo, contacto) VALUES (?, ?, ?)"
        db.query(sql, [usuario_id, tipo, contacto], (error, result) => {
        if (error) {
            console.error("Error creando contacto:", error)
            return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }

        const nuevoContacto = {
            id_contacto: result.insertId,
            usuario_id,
            tipo,
            contacto,
            fecha_creacion: new Date(),
        }
        res.status(201).json(nuevoContacto)
        })
    })
    }

    // Actualizar un contacto específico
    const updateContacto = (req, res) => {
    const { id_contacto } = req.params
    const { tipo, contacto } = req.body

    if (!tipo || !contacto) {
        return res.status(400).json({ error: "Tipo y contacto son obligatorios" })
    }

    const sql = "UPDATE contactos_usuario SET tipo = ?, contacto = ? WHERE id_contacto = ?"
    db.query(sql, [tipo, contacto, id_contacto], (error, result) => {
        if (error) {
        console.error("Error actualizando contacto:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "ERROR: El contacto a modificar no existe" })
        }

        const contactoActualizado = { id_contacto, tipo, contacto }
        res.json(contactoActualizado)
    })
    }

    // Eliminar un contacto
    const destroyContacto = (req, res) => {
    const { id_contacto } = req.params

    const sql = "DELETE FROM contactos_usuario WHERE id_contacto = ?"
    db.query(sql, [id_contacto], (error, result) => {
        if (error) {
        console.error("Error eliminando contacto:", error)
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" })
        }
        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "ERROR: El contacto a borrar no existe" })
        }
        res.json({ mensaje: "Contacto eliminado correctamente" })
    })
    }

    // Actualizar el module.exports para incluir todos los métodos
    module.exports = {
    // Métodos específicos del perfil del usuario autenticado
    getPerfilUsuario,
    updatePerfilUsuario,
    getDomicilioUsuario,
    updateDomicilioUsuario,
    getContactosUsuario,
    getContactoUsuario,
    createContactoUsuario,
    updateContactoUsuario,
    deleteContactoUsuario,
    getHistorialUsuario,

    // Métodos CRUD completos para administradores
    allPerfiles,
    showPerfil,
    createPerfil,
    updatePerfil,
    destroyPerfil,
    allContactos,
    showContacto,
    createContacto,
    updateContacto,
    destroyContacto,
    }
