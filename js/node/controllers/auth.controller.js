const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db"); // Importar la conexión a la base de datos

const register = (req, res) => {
    const { nombre_usuario, email, telefono_usuario, contraseña_usuario } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error("Error al Registrase:", error);
            return res.status(500).send("Error checking usuario existente");
        }

        if (results.length > 0) {
            return res.status(400).send("El usuario con ese correo electrónico ya existe.");
        }

        // Encriptar la contraseña
        bcrypt.hash(contraseña_usuario, 8, (err, hash) => {
            if (err) {
                console.error("Error hashing contraseña:", err);
                return res.status(500).send("Error hashing contraseña");
            }

            // Insertar nuevo usuario en la base de datos
            db.query('INSERT INTO usuarios (nombre_usuario, apellido_usuario, email, telefono_usuario, contraseña_usuario) VALUES (?, ?, ?, ?)', [nombre_usuario, email, telefono_usuario, hash], (insertError, insertResults) => {
                if (insertError) {
                    console.error("Error al insertar usuario:", insertError);
                    return res.status(500).send("Error al registrar usuario");
                }

                // Obtener el ID del usuario recién creado
                const userId = insertResults.insertId;

                // Generar un token JWT con el ID del usuario
                const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });

                // Enviar la respuesta con el token
                res.status(201).send({ auth: true, token });
            });
        });
    });
};

// Función para hacer login
const login = (req, res) => {
    const { email, contraseña_usuario } = req.body;

    // Buscar al usuario por correo electrónico
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error("Login error:", error);
            return res.status(500).send("Error al iniciar sesión");
        }

        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const user = results[0];

        // Comparar la contraseña
        bcrypt.compare(contraseña_usuario, user.contraseña_usuario, (err, passwordIsValid) => {
            if (err) {
                console.error("Error al comparar contraseñas:", err);
                return res.status(500).send("Error al comparar contraseñas");
            }

            if (!passwordIsValid) {
                return res.status(401).send({ auth: false, token: null });
            }

            // Generar un token JWT con el ID del usuario
            const token = jwt.sign({ id: user.ID_Login }, process.env.SECRET_KEY, {
                expiresIn: "1h",
            });

            // Enviar la respuesta con el token
            res.send({ auth: true, token });
        });
    });
};

module.exports = {
    register,
    login,
};