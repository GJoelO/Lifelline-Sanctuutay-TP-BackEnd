    /// CONTROLADORES DEL MODULO ///

    const jwt = require("jsonwebtoken")
    const bcrypt = require("bcryptjs")
    const db = require("../db/db") // Importar la conexión a la base de datos
    const dotenv = require("dotenv")

    dotenv.config()

    // Función para registrar usuario
    const register = (req, res) => {
    console.log("Cuerpo de la solicitud:", req.body) // Verifica los datos que llegan
    console.log("Imagen:", req.file) // Verifica si la imagen se está subiendo correctamente
    const imageName = req.file ? req.file.filename : null // Manejo de la imagen

    const { nombre, apellido, dni, email, telefono, contrasena, rol_id } = req.body

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !apellido || !dni || !email || !telefono || !contrasena) {
        return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
        })
    }

    // Verificar si el usuario ya existe
    db.query("SELECT * FROM usuarios WHERE email = ? OR dni = ?", [email, dni], (error, results) => {
        if (error) {
        console.error("Registration error:", error)
        return res.status(500).json({ success: false, message: "Error checking user existence" })
        }

        if (results.length > 0) {
        return res
            .status(400)
            .json({ success: false, existe: true, message: "Ya existe un usuario con ese email o DNI." })
        }

        // Encriptar la contraseña
        bcrypt.hash(contrasena, 8, (err, hash) => {
        if (err) {
            console.error("Error hashing contrasenia:", err)
            return res.status(500).json({ success: false, message: "Error hashing contrasenia." })
        }

        // Insertar nuevo usuario en la base de datos
        db.query(
            "INSERT INTO usuarios (nombre, apellido, dni, email, telefono, contrasena, foto_perfil, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, apellido, dni, email, telefono, hash, imageName, rol_id || 1],
            (insertError, insertResults) => {
            if (insertError) {
                console.error("Error inserting user:", insertError)
                return res
                .status(500)
                .json({ success: false, message: "Error registering user", error: insertError.message })
            }

            // Obtener el ID del usuario recién creado
            const id_usuario = insertResults.insertId

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: id_usuario }, process.env.SECRET_KEY || "defaultSecretKey", {
                expiresIn: process.env.JWT_EXPIRATION || "1h",
            })

            // Enviar la respuesta con el token
            res.status(201).json({
                success: true,
                auth: true,
                token,
                message: "Usuario registrado exitosamente",
                user: {
                id_usuario,
                nombre,
                apellido,
                email,
                foto_perfil: imageName,
                },
            })
            },
        )
        })
    })
    }

    // Función para hacer login
    const login = (req, res) => {
    const { email, contrasena } = req.body

    // Buscar al usuario por email con información del rol
    db.query(
        `SELECT usuarios.id_usuario, usuarios.nombre, usuarios.apellido, usuarios.dni, usuarios.email, 
        usuarios.contrasena, usuarios.foto_perfil, usuarios.rol_id, roles.nombre as rol_nombre
        FROM usuarios 
        LEFT JOIN roles ON usuarios.rol_id = roles.id_rol 
        WHERE usuarios.email = ?`,
        [email],
        (error, results) => {
        if (error) {
            console.error("Login error:", error)
            return res.status(500).json({ auth: false, message: "Error during login." })
        }

        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.json({ auth: false, message: "Usuario no encontrado." })
        }

        const user = results[0]
        console.log("Retrieved user:", user)

        // Verificar que la contraseña no esté vacía o indefinida
        if (!user.contrasena) {
            console.error("Password not set for this user.")
            return res.status(500).send("Password not set for this user.")
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        bcrypt.compare(contrasena, user.contrasena, (err, contrasenaEsValida) => {
            if (err) {
            console.error("Error comparing passwords:", err)
            return res.status(500).json({ auth: false, message: "Error comparing passwords" })
            }

            if (!contrasenaEsValida) {
            return res.status(401).json({ auth: false, message: "Contraseña incorrecta." })
            }

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET_KEY || "defaultSecretKey", {
            expiresIn: process.env.JWT_EXPIRATION || "24h",
            })

            // Configurar cookie HttpOnly
            const cookieOption = {
            expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRES || 24) * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
            sameSite: "strict",
            path: "/",
            }
            res.cookie("jwt", token, cookieOption)

            // Determinar si es administrador
            const roleName = user.rol_nombre?.toLowerCase()
            const isAdmin = roleName === "administrador" || roleName === "dueño" || roleName === "admin"

            // Enviar la respuesta con el token y los datos del usuario
            res.json({
            auth: true,
            token,
            status: "ok",
            message: "Usuario loggeado",
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                foto_perfil: user.foto_perfil,
                rol_id: user.rol_id,
                rol_nombre: user.rol_nombre,
                isAdmin: isAdmin,
            },
            })
        })
        },
    )
    }

    // Función para verificar autenticación
    const verifyAuth = (req, res) => {
    const userId = req.userId

    // Obtener información completa del usuario
    db.query(
        `SELECT usuarios.id_usuario, usuarios.nombre, usuarios.apellido, usuarios.email, 
        usuarios.foto_perfil, usuarios.rol_id, roles.nombre as rol_nombre
        FROM usuarios 
        LEFT JOIN roles ON usuarios.rol_id = roles.id_rol 
        WHERE usuarios.id_usuario = ?`,
        [userId],
        (error, results) => {
        if (error) {
            console.error("Verify auth error:", error)
            return res.status(500).json({ auth: false, message: "Error verifying authentication" })
        }

        if (results.length === 0) {
            return res.status(404).json({ auth: false, message: "User not found" })
        }

        const user = results[0]
        const roleName = user.rol_nombre?.toLowerCase()
        const isAdmin = roleName === "administrador" || roleName === "dueño" || roleName === "admin"

        res.json({
            auth: true,
            user: {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            foto_perfil: user.foto_perfil,
            rol_id: user.rol_id,
            rol_nombre: user.rol_nombre,
            isAdmin: isAdmin,
            },
        })
        },
    )
    }

    // Función para cerrar sesión
    const logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    })

    res.json({
        success: true,
        message: "Sesión cerrada exitosamente",
    })
    }

    module.exports = {
    register,
    login,
    verifyAuth,
    logout,
    }
