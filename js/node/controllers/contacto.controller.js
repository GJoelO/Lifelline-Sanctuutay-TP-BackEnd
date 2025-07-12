    const db = require("../db/db")
    const nodemailer = require("nodemailer")
    require("dotenv").config()

    // Configurar el transportador de correo
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    })

    const enviarReporte = async (req, res) => {
    console.log("=== ENVIANDO REPORTE DE CONTACTO ===")
    console.log("Body recibido:", req.body)
    console.log("Usuario ID:", req.userId)

    try {
        const { motivo, descripcion } = req.body
        const usuario_id = req.userId

        // Validaciones
        if (!usuario_id) {
        return res.status(401).json({
            success: false,
            message: "Usuario no autenticado",
        })
        }

        if (!motivo || motivo.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "El motivo es obligatorio",
        })
        }

        if (!descripcion || descripcion.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "La descripción es obligatoria",
        })
        }

        if (descripcion.length < 10 || descripcion.length > 500) {
        return res.status(400).json({
            success: false,
            message: "La descripción debe tener entre 10 y 500 caracteres",
        })
        }

        console.log("Validaciones pasadas, obteniendo datos del usuario...")

        // Obtener datos del usuario
        const getUserQuery = `
        SELECT u.nombre, u.apellido, u.email, u.telefono, r.nombre as rol_nombre
        FROM usuarios u
        LEFT JOIN roles r ON u.rol_id = r.id_rol
        WHERE u.id_usuario = ?
        `

        db.query(getUserQuery, [usuario_id], async (error, userResults) => {
        if (error) {
            console.error("Error obteniendo datos del usuario:", error)
            return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            })
        }

        if (userResults.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Usuario no encontrado",
            })
        }

        const usuario = userResults[0]
        console.log("Datos del usuario obtenidos:", usuario)

        // Preparar el contenido del correo
        const fechaActual = new Date().toLocaleString("es-ES", {
            timeZone: "America/Argentina/Buenos_Aires",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Soporte - Hospital Lifelline</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f7fa;
                    }
                    .container {
                        background: white;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #65a2bc;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #65a2bc;
                        margin: 0;
                        font-size: 24px;
                    }
                    .section {
                        margin-bottom: 25px;
                    }
                    .section h2 {
                        color: #4a5764;
                        font-size: 18px;
                        margin-bottom: 15px;
                        border-left: 4px solid #65a2bc;
                        padding-left: 15px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                        padding: 10px;
                        background: #f8f9fa;
                        border-radius: 4px;
                    }
                    .info-item strong {
                        color: #4a5764;
                        display: inline-block;
                        width: 120px;
                    }
                    .problem-section {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 6px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .motivo {
                        background: #e3f2fd;
                        padding: 10px;
                        border-radius: 4px;
                        margin-bottom: 15px;
                        font-weight: bold;
                        color: #1565c0;
                    }
                    .descripcion {
                        background: white;
                        padding: 15px;
                        border-radius: 4px;
                        border: 1px solid #ddd;
                        white-space: pre-wrap;
                        font-family: monospace;
                        font-size: 14px;
                    }
                    .priority {
                        background: #ff6b6b;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        display: inline-block;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Hospital Lifelline Sanctuary</h1>
                        <p>Reporte de Soporte Técnico</p>
                    </div>

                    <div class="priority">NUEVO REPORTE DE SOPORTE</div>

                    <div class="section">
                        <h2>Información del Reporte</h2>
                        <div class="info-item">
                            <strong>Fecha:</strong> ${fechaActual}
                        </div>
                        <div class="info-item">
                            <strong>ID Usuario:</strong> #${usuario_id}
                        </div>
                    </div>

                    <div class="section">
                        <h2>Datos del Usuario</h2>
                        <div class="info-item">
                            <strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}
                        </div>
                        <div class="info-item">
                            <strong>Email:</strong> ${usuario.email}
                        </div>
                        <div class="info-item">
                            <strong>Teléfono:</strong> ${usuario.telefono || "No proporcionado"}
                        </div>
                        <div class="info-item">
                            <strong>Rol:</strong> ${usuario.rol_nombre || "No especificado"}
                        </div>
                    </div>

                    <div class="problem-section">
                        <h3>Detalles del Problema</h3>
                        
                        <div class="motivo">
                            Motivo: ${motivo}
                        </div>

                        <div>
                            <strong>Descripción:</strong>
                            <div class="descripcion">${descripcion}</div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Sistema de Gestión Hospitalaria - Hospital Lifelline Sanctuary</p>
                        <p>Para responder contactar directamente a: ${usuario.email}</p>
                    </div>
                </div>
            </body>
            </html>
        `

        // Configurar el correo
        const mailOptions = {
            from: {
            name: "Sistema Hospital Lifelline",
            address: process.env.EMAIL_USER,
            },
            to: "soportehospital4@gmail.com",
            subject: `Nuevo Reporte de Soporte - ${motivo} | Usuario: ${usuario.nombre} ${usuario.apellido}`,
            html: htmlContent,
            replyTo: usuario.email,
        }

        console.log("Enviando correo...")

        // Enviar el correo
        try {
            const info = await transporter.sendMail(mailOptions)
            console.log("Correo enviado exitosamente")

            res.json({
            success: true,
            message: "Reporte enviado exitosamente. Te contactaremos pronto.",
            })
        } catch (emailError) {
            console.error("Error enviando correo:", emailError)

            res.status(500).json({
            success: false,
            message: "Error al enviar el reporte. Inténtalo de nuevo.",
            })
        }
        })
    } catch (error) {
        console.error("Error general:", error)
        res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        })
    }
    }

    module.exports = {
    enviarReporte,
    }
