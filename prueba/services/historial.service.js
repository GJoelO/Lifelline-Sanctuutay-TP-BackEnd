/*const nodemailer = require("nodemailer")

    class EmailService {
    constructor() {
        this.transporter = this.createTransporter()
    }

    createTransporter() {
        return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        })
    }

    async enviarComprobanteTurno(datosTurno, pdfBuffer) {
        try {
        console.log("📧 Preparando envío de email...")
        console.log("📧 Datos del turno:", datosTurno)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: datosTurno.email_paciente,
            subject: `Comprobante de Turno Médico - ${datosTurno.nombre_especialidad}`,
            html: this.generarHTMLEmail(datosTurno),
            attachments: [
            {
                filename: `comprobante_turno_${datosTurno.id_turno}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
            ],
        }

        console.log("📧 Enviando email a:", datosTurno.email_paciente)
        const result = await this.transporter.sendMail(mailOptions)
        console.log("✅ Email enviado exitosamente:", result.messageId)
        return result
        } catch (error) {
        console.error("❌ Error enviando email:", error)
        throw error
        }
    }

    generarHTMLEmail(datos) {
        const fechaFormateada = new Date(datos.fecha_turno).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        })

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Comprobante de Turno Médico</title>
            <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #65a2bc;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                background-color: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                border: 1px solid #ddd;
            }
            .turno-info {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #65a2bc;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .info-label {
                font-weight: bold;
                color: #555;
            }
            .info-value {
                color: #333;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                background-color: #f0f0f0;
                border-radius: 8px;
                font-size: 14px;
                color: #666;
            }
            .important {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .important h3 {
                color: #856404;
                margin-top: 0;
            }
            </style>
        </head>
        <body>
            <div class="header">
            <h1>🏥 Hospital Lifelline</h1>
            <h2>Comprobante de Turno Médico</h2>
            </div>
            
            <div class="content">
            <p>Estimado/a <strong>${datos.nombre_paciente} ${datos.apellido_paciente}</strong>,</p>
            
            <p>Su turno médico ha sido confirmado exitosamente. A continuación encontrará los detalles:</p>
            
            <div class="turno-info">
                <h3>📋 Información del Turno</h3>
                
                <div class="info-row">
                <span class="info-label">Número de Turno:</span>
                <span class="info-value">#${datos.id_turno}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">Fecha:</span>
                <span class="info-value">${fechaFormateada}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">Especialidad:</span>
                <span class="info-value">${datos.nombre_especialidad}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">Médico:</span>
                <span class="info-value">Dr/a. ${datos.nombre_medico}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">Obra Social:</span>
                <span class="info-value">${datos.obra_social}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">Paciente:</span>
                <span class="info-value">${datos.nombre_paciente} ${datos.apellido_paciente}</span>
                </div>
                
                <div class="info-row">
                <span class="info-label">DNI:</span>
                <span class="info-value">${datos.dni_paciente}</span>
                </div>
            </div>
            
            <div class="important">
                <h3>📌 Instrucciones Importantes</h3>
                <ul>
                <li><strong>Presentarse 15 minutos antes</strong> del horario del turno</li>
                <li>Traer <strong>DNI</strong> y <strong>carnet de obra social</strong></li>
                <li>Para cancelar o reprogramar, contactar con <strong>24 horas de anticipación</strong></li>
                <li>En caso de no asistir sin aviso, el turno será dado de baja</li>
                </ul>
            </div>
            
            <p><strong>📎 Adjunto:</strong> Encontrará el comprobante en PDF adjunto a este email.</p>
            
            <p>Si tiene alguna consulta, no dude en contactarnos.</p>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo Médico - Hospital Lifelline</strong></p>
            </div>
            
            <div class="footer">
            <p>🏥 <strong>Hospital Lifelline</strong></p>
            <p>📧 Email: info@hospitallifelline.com | 📞 Teléfono: (011) 1234-5678</p>
            <p>📍 Dirección: Av. Salud 123, Ciudad Autónoma de Buenos Aires</p>
            <hr>
            <p><small>Este es un email automático, por favor no responder directamente.</small></p>
            </div>
        </body>
        </html>
        `
    }

    async verificarConexion() {
        try {
        await this.transporter.verify()
        console.log("✅ Conexión de email verificada correctamente")
        return true
        } catch (error) {
        console.error("❌ Error en la conexión de email:", error)
        return false
        }
    }

    async enviarEmailSimple(destinatario, asunto, mensaje) {
        try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: asunto,
            html: mensaje,
        }

        const result = await this.transporter.sendMail(mailOptions)
        console.log("✅ Email simple enviado:", result.messageId)
        return result
        } catch (error) {
        console.error("❌ Error enviando email simple:", error)
        throw error
        }
    }
    }

    // Crear instancia única del servicio
    const emailService = new EmailService()

    module.exports = emailService*/
