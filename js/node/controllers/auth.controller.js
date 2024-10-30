const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db");
const multer = require('multer');
const path = require('path');

// Configuración de multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Asegúrate de que este directorio exista
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const register = (req, res) => {
    upload.single('foto_perfil')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({error : "ERROR: Problema al subir el archivo"});
        } else if (err) {
            return res.status(500).json({error : "ERROR: " + err.message});
        }

        const { nombre_usuario, email, telefono_usuario, contraseña_usuario } = req.body;
        const foto_perfil = req.file ? req.file.filename : null;

        // Verificar si el usuario ya existe
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
            if (error) {
                console.error("Error al Registrarse:", error);
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
                db.query('INSERT INTO usuarios (nombre_usuario, email, telefono_usuario, contraseña_usuario, foto_perfil) VALUES (?, ?, ?, ?, ?)', 
                    [nombre_usuario, email, telefono_usuario, hash, foto_perfil], 
                    (insertError, insertResults) => {
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
                    }
                );
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