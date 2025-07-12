    const db = require("../db/db")
    const nodemailer = require("nodemailer")
    const puppeteer = require("puppeteer")
    const path = require("path")

    // Configuración del transportador de email
    const transporter = nodemailer.createTransport({
    service: "gmail", // Puedes cambiar esto por tu proveedor de email
    auth: {
        user: process.env.EMAIL_USER || "tu-email@gmail.com", // Configura en variables de entorno
        pass: process.env.EMAIL_PASS || "tu-contraseña-app", // Usa contraseña de aplicación
    },
    })

    // Obtener médicos por especialidad
    const getMedicosByEspecialidad = (req, res) => {
    const { especialidad_id } = req.query

    console.log("🔍 Obteniendo médicos para especialidad:", especialidad_id)

    if (!especialidad_id || especialidad_id === "all") {
        // Devolver todos los médicos
        const sql = `
                SELECT 
                    medicos.id_medico,
                    usuarios.nombre,
                    usuarios.apellido,
                    especialidades.nombre as especialidad_nombre,
                    medicos.especialidad_id
                FROM medicos
                INNER JOIN usuarios ON medicos.usuario_id = usuarios.id_usuario
                INNER JOIN especialidades ON medicos.especialidad_id = especialidades.id_especialidad
                ORDER BY usuarios.nombre, usuarios.apellido
            `

        db.query(sql, (error, results) => {
        if (error) {
            console.error("Error obteniendo todos los médicos:", error)
            return res.status(500).json({ error: "Error interno del servidor" })
        }

        console.log("✅ Todos los médicos obtenidos:", results.length)
        res.json(results)
        })
    } else {
        // Filtrar por especialidad específica
        const sql = `
                SELECT 
                    medicos.id_medico,
                    usuarios.nombre,
                    usuarios.apellido,
                    medicos.especialidad_id
                FROM medicos
                INNER JOIN usuarios ON medicos.usuario_id = usuarios.id_usuario
                WHERE medicos.especialidad_id = ?
                ORDER BY usuarios.nombre, usuarios.apellido
            `

        db.query(sql, [especialidad_id], (error, results) => {
        if (error) {
            console.error("Error obteniendo médicos por especialidad:", error)
            return res.status(500).json({ error: "Error interno del servidor" })
        }

        console.log(`✅ Médicos obtenidos para especialidad ${especialidad_id}:`, results.length)
        console.log(
            "Médicos encontrados:",
            results.map((m) => `${m.nombre} ${m.apellido} (ID: ${m.id_medico})`),
        )

        res.json(results)
        })
    }
    }

    // Verificar disponibilidad de turnos
    const checkDisponibilidad = (req, res) => {
    const { especialidad_id, fecha } = req.query

    console.log("📅 Verificando disponibilidad:", { especialidad_id, fecha })

    if (!especialidad_id || !fecha) {
        return res.status(400).json({
        success: false,
        message: "Especialidad y fecha son requeridos",
        })
    }

    // Consultar turnos existentes para esa fecha y especialidad
    const sql = `
            SELECT COUNT(*) as turnos_ocupados
            FROM turnos 
            WHERE especialidad_id = ? AND fecha_turno = ?
        `

    db.query(sql, [especialidad_id, fecha], (error, results) => {
        if (error) {
        console.error("Error verificando disponibilidad:", error)
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        })
        }

        const turnosOcupados = results[0].turnos_ocupados
        const turnosDisponibles = Math.max(0, 10 - turnosOcupados) // Máximo 10 turnos por día

        console.log(`✅ Disponibilidad: ${turnosDisponibles}/10`)

        res.json({
        success: true,
        data: {
            turnos_disponibles: turnosDisponibles,
            turnos_ocupados: turnosOcupados,
            fecha: fecha,
            especialidad_id: especialidad_id,
        },
        })
    })
    }

    // Crear turno con comprobante
    const crearTurnoConComprobante = async (req, res) => {
    console.log("🎫 === CREANDO TURNO CON COMPROBANTE ===")
    console.log("Usuario ID:", req.userId)
    console.log("Body completo recibido:", req.body)
    console.log("Headers:", req.headers)

    const { especialidad_id, medico_id, fecha, provincia, localidad, tieneObraSocial, obra_social_id } = req.body

    // Debug detallado de cada campo
    console.log("🔍 Campos extraídos:")
    console.log("- especialidad_id:", especialidad_id, typeof especialidad_id)
    console.log("- medico_id:", medico_id, typeof medico_id)
    console.log("- fecha:", fecha, typeof fecha)
    console.log("- provincia:", provincia, typeof provincia)
    console.log("- localidad:", localidad, typeof localidad)
    console.log("- tieneObraSocial:", tieneObraSocial, typeof tieneObraSocial)
    console.log("- obra_social_id:", obra_social_id, typeof obra_social_id)

    // Validaciones más específicas
    const camposFaltantes = []

    if (!especialidad_id || especialidad_id === "" || especialidad_id === "undefined") {
        camposFaltantes.push("especialidad_id")
    }
    if (!medico_id || medico_id === "" || medico_id === "undefined") {
        camposFaltantes.push("medico_id")
    }
    if (!fecha || fecha === "" || fecha === "undefined") {
        camposFaltantes.push("fecha")
    }
    if (!provincia || provincia === "" || provincia === "undefined") {
        camposFaltantes.push("provincia")
    }
    if (!localidad || localidad === "" || localidad === "undefined") {
        camposFaltantes.push("localidad")
    }
    if (!tieneObraSocial || tieneObraSocial === "" || tieneObraSocial === "undefined") {
        camposFaltantes.push("tieneObraSocial")
    }

    if (camposFaltantes.length > 0) {
        console.log("❌ Campos faltantes:", camposFaltantes)
        return res.status(400).json({
        success: false,
        message: `Campos faltantes: ${camposFaltantes.join(", ")}`,
        camposFaltantes: camposFaltantes,
        datosRecibidos: req.body,
        })
    }

    if (tieneObraSocial === "si" && (!obra_social_id || obra_social_id === "" || obra_social_id === "undefined")) {
        console.log("❌ Obra social requerida pero no proporcionada")
        return res.status(400).json({
        success: false,
        message: "Debe seleccionar una obra social",
        })
    }

    try {
        // Obtener una habitación disponible
        const habitacionSql = "SELECT id_habitacion FROM habitaciones WHERE estado = 'disponible' LIMIT 1"

        db.query(habitacionSql, (habitacionError, habitacionResults) => {
        if (habitacionError) {
            console.error("Error obteniendo habitación:", habitacionError)
            return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            })
        }

        if (habitacionResults.length === 0) {
            return res.status(400).json({
            success: false,
            message: "No hay habitaciones disponibles",
            })
        }

        const habitacion_id = habitacionResults[0].id_habitacion

        // Crear el turno
        const turnoSql = `
                    INSERT INTO turnos 
                    (usuario_id, medico_id, especialidad_id, obra_social_id, habitacion_id, fecha_turno)
                    VALUES (?, ?, ?, ?, ?, ?)
                `

        const obraSocialValue = tieneObraSocial === "si" ? obra_social_id : null

        console.log("📝 Insertando turno con valores:")
        console.log("- usuario_id:", req.userId)
        console.log("- medico_id:", medico_id)
        console.log("- especialidad_id:", especialidad_id)
        console.log("- obra_social_id:", obraSocialValue)
        console.log("- habitacion_id:", habitacion_id)
        console.log("- fecha_turno:", fecha)

        db.query(
            turnoSql,
            [req.userId, medico_id, especialidad_id, obraSocialValue, habitacion_id, fecha],
            (turnoError, turnoResult) => {
            if (turnoError) {
                console.error("Error creando turno:", turnoError)
                return res.status(500).json({
                success: false,
                message: "Error al crear el turno: " + turnoError.message,
                })
            }

            console.log("✅ Turno creado con ID:", turnoResult.insertId)

            // Obtener datos completos del turno para el comprobante
            const datosSql = `
                            SELECT 
                                t.id_turno,
                                t.fecha_turno,
                                u.nombre as paciente_nombre,
                                u.apellido as paciente_apellido,
                                u.dni as paciente_dni,
                                u.email as paciente_email,
                                um.nombre as medico_nombre,
                                um.apellido as medico_apellido,
                                e.nombre as especialidad_nombre,
                                os.nombre as obra_social_nombre
                            FROM turnos t
                            INNER JOIN usuarios u ON t.usuario_id = u.id_usuario
                            INNER JOIN medicos m ON t.medico_id = m.id_medico
                            INNER JOIN usuarios um ON m.usuario_id = um.id_usuario
                            INNER JOIN especialidades e ON t.especialidad_id = e.id_especialidad
                            LEFT JOIN obras_sociales os ON t.obra_social_id = os.id_OS
                            WHERE t.id_turno = ?
                        `

            db.query(datosSql, [turnoResult.insertId], (datosError, datosResults) => {
                if (datosError) {
                console.error("Error obteniendo datos del turno:", datosError)
                return res.status(500).json({
                    success: false,
                    message: "Turno creado pero error obteniendo datos",
                })
                }

                const turnoData = datosResults[0]

                const response = {
                success: true,
                message: "Turno creado exitosamente",
                turno: {
                    id_turno: turnoResult.insertId,
                    usuario_id: req.userId,
                    medico_id: Number.parseInt(medico_id),
                    especialidad_id: Number.parseInt(especialidad_id),
                    obra_social_id: obraSocialValue ? Number.parseInt(obraSocialValue) : null,
                    habitacion_id: habitacion_id,
                    fecha_turno: fecha,
                },
                datosCompletos: {
                    paciente: {
                    nombre: turnoData.paciente_nombre,
                    apellido: turnoData.paciente_apellido,
                    dni: turnoData.paciente_dni,
                    email: turnoData.paciente_email,
                    },
                    especialidad: turnoData.especialidad_nombre,
                    medico: `${turnoData.medico_nombre} ${turnoData.medico_apellido}`,
                    obraSocial: turnoData.obra_social_nombre,
                    provincia: provincia,
                    localidad: localidad,
                    fecha: fecha,
                },
                }

                console.log("✅ Respuesta completa:", response)
                res.json(response)
            })
            },
        )
        })
    } catch (error) {
        console.error("Error general:", error)
        res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        })
    }
    }

    // Enviar comprobante por email
    const enviarComprobanteEmail = async (req, res) => {
    console.log("📧 === ENVIANDO COMPROBANTE POR EMAIL ===")
    console.log("Usuario ID:", req.userId)
    console.log("Datos recibidos:", req.body)

    const { turnoData, datosCompletos, contenidoHTML } = req.body

    if (!turnoData || !datosCompletos) {
        return res.status(400).json({
        success: false,
        message: "Datos del turno requeridos",
        })
    }

    try {
        // Obtener email del usuario desde la base de datos
        const emailSql = "SELECT email, nombre, apellido FROM usuarios WHERE id_usuario = ?"

        db.query(emailSql, [req.userId], async (emailError, emailResults) => {
        if (emailError) {
            console.error("Error obteniendo email del usuario:", emailError)
            return res.status(500).json({
            success: false,
            message: "Error obteniendo datos del usuario",
            })
        }

        if (emailResults.length === 0) {
            return res.status(404).json({
            success: false,
            message: "Usuario no encontrado",
            })
        }

        const usuario = emailResults[0]
        const emailDestino = usuario.email

        if (!emailDestino) {
            return res.status(400).json({
            success: false,
            message: "El usuario no tiene un email registrado",
            })
        }

        // Generar número de turno
        const numeroTurno = `HLF-${Date.now().toString().slice(-8)}`
        const fechaEmision = new Date().toLocaleString("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

        // Crear plantilla HTML para el email
        const htmlEmail = `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Comprobante de Turno - Hospital Lifeline</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 20px;
                                background-color: #f5f5f5;
                                color: #333;
                            }
                            .email-container {
                                max-width: 800px;
                                margin: 0 auto;
                                background: white;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                            }
                            .email-header {
                                background: linear-gradient(135deg, #65a2bc, #4a90a4);
                                color: white;
                                padding: 30px;
                                text-align: center;
                            }
                            .email-header h1 {
                                margin: 0;
                                font-size: 28px;
                            }
                            .email-header p {
                                margin: 10px 0 0;
                                font-size: 16px;
                                opacity: 0.9;
                            }
                            .email-body {
                                padding: 30px;
                            }
                            .greeting {
                                font-size: 18px;
                                margin-bottom: 20px;
                                color: #333;
                            }
                            .turno-info {
                                background: #f8f9fa;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                                border-left: 4px solid #65a2bc;
                            }
                            .turno-info h3 {
                                margin-top: 0;
                                color: #65a2bc;
                            }
                            .info-grid {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 15px;
                                margin: 15px 0;
                            }
                            .info-item {
                                background: white;
                                padding: 15px;
                                border-radius: 6px;
                                border: 1px solid #e9ecef;
                            }
                            .info-label {
                                font-weight: bold;
                                color: #666;
                                font-size: 14px;
                                margin-bottom: 5px;
                            }
                            .info-value {
                                color: #333;
                                font-size: 16px;
                            }
                            .importante {
                                background: #fff3cd;
                                border: 1px solid #ffc107;
                                padding: 20px;
                                border-radius: 6px;
                                margin: 20px 0;
                            }
                            .importante h4 {
                                color: #856404;
                                margin-top: 0;
                            }
                            .importante ul {
                                color: #856404;
                                margin: 10px 0 0 20px;
                            }
                            .email-footer {
                                background: #f8f9fa;
                                padding: 20px;
                                text-align: center;
                                color: #666;
                                font-size: 14px;
                                border-top: 1px solid #e9ecef;
                            }
                            @media (max-width: 600px) {
                                .info-grid {
                                    grid-template-columns: 1fr;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <h1>🏥 Hospital Lifeline</h1>
                                <p>Comprobante de Turno Médico</p>
                            </div>
                            
                            <div class="email-body">
                                <div class="greeting">
                                    Estimado/a ${usuario.nombre} ${usuario.apellido},
                                </div>
                                
                                <p>Su turno médico ha sido confirmado exitosamente. A continuación encontrará los detalles de su cita:</p>
                                
                                <div class="turno-info">
                                    <h3>📋 Información del Turno</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <div class="info-label">Número de Turno</div>
                                            <div class="info-value">${numeroTurno}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Fecha de Emisión</div>
                                            <div class="info-value">${fechaEmision}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Especialidad</div>
                                            <div class="info-value">${datosCompletos.especialidad}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Médico</div>
                                            <div class="info-value">Dr/a. ${datosCompletos.medico}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Fecha del Turno</div>
                                            <div class="info-value">${new Date(datosCompletos.fecha).toLocaleDateString(
                                            "es-AR",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            },
                                            )}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Ubicación</div>
                                            <div class="info-value">${datosCompletos.provincia}, ${datosCompletos.localidad}</div>
                                        </div>
                                        ${
                                        datosCompletos.obraSocial
                                            ? `
                                        <div class="info-item">
                                            <div class="info-label">Obra Social</div>
                                            <div class="info-value">${datosCompletos.obraSocial}</div>
                                        </div>
                                        `
                                            : ""
                                        }
                                    </div>
                                </div>
                                
                                <div class="importante">
                                    <h4>📋 Información Importante:</h4>
                                    <ul>
                                        <li>Presente este comprobante el día de su cita médica</li>
                                        <li>Se atenderá por orden de llegada</li>
                                        <li>Traiga su DNI y carnet de obra social (si corresponde)</li>
                                        <li>Para cancelar o reprogramar, contacte con 48hs de anticipación</li>
                                        <li>En caso de urgencia, diríjase a la guardia médica</li>
                                    </ul>
                                </div>
                                
                                <p>Gracias por confiar en Hospital Lifeline para su atención médica.</p>
                            </div>
                            
                            <div class="email-footer">
                                <p><strong>Hospital Lifeline</strong> - Cuidando tu salud con excelencia</p>
                                <p>Este comprobante es válido únicamente para la fecha y horario especificados</p>
                                <p>Número de turno: ${numeroTurno} | Emitido: ${fechaEmision}</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `

        // Configurar opciones del email
        const mailOptions = {
            from: `"Hospital Lifeline" <${process.env.EMAIL_USER || "noreply@hospitallifeline.com"}>`,
            to: emailDestino,
            subject: `Comprobante de Turno Médico - ${numeroTurno}`,
            html: htmlEmail,
        }

        console.log("📤 Enviando email a:", emailDestino)

        // Enviar email
        try {
            const info = await transporter.sendMail(mailOptions)
            console.log("✅ Email enviado exitosamente:", info.messageId)

            res.json({
            success: true,
            message: "Comprobante enviado exitosamente",
            emailDestino: emailDestino,
            numeroTurno: numeroTurno,
            })
        } catch (emailSendError) {
            console.error("❌ Error enviando email:", emailSendError)
            res.status(500).json({
            success: false,
            message: "Error al enviar el email: " + emailSendError.message,
            })
        }
        })
    } catch (error) {
        console.error("❌ Error general enviando email:", error)
        res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        })
    }
    }

    // Generar PDF del comprobante
    const generarPDF = async (req, res) => {
    console.log("📄 === GENERANDO PDF DEL COMPROBANTE ===")
    console.log("Usuario ID:", req.userId)

    const { turnoData, datosCompletos, contenidoHTML } = req.body

    if (!turnoData || !datosCompletos) {
        return res.status(400).json({
        success: false,
        message: "Datos del turno requeridos",
        })
    }

    try {
        // Generar número de turno y fecha
        const numeroTurno = `HLF-${Date.now().toString().slice(-8)}`
        const fechaEmision = new Date().toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        })

        const fechaTurno = new Date(datosCompletos.fecha).toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        })

        // Crear HTML optimizado para PDF
        const htmlParaPDF = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Comprobante de Turno - ${numeroTurno}</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        
                        body {
                            font-family: 'Arial', sans-serif;
                            font-size: 14px;
                            line-height: 1.6;
                            color: #333;
                            background: white;
                        }
                        
                        .comprobante-container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        
                        .comprobante-header {
                            background: linear-gradient(135deg, #65a2bc, #4a90a4);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                            margin-bottom: 0;
                        }
                        
                        .hospital-info h1 {
                            font-size: 32px;
                            margin-bottom: 10px;
                            font-weight: bold;
                        }
                        
                        .hospital-info p {
                            font-size: 18px;
                            opacity: 0.9;
                        }
                        
                        .turno-numero {
                            background: rgba(255,255,255,0.2);
                            padding: 10px 20px;
                            border-radius: 25px;
                            font-weight: bold;
                            font-size: 16px;
                            margin-top: 15px;
                            display: inline-block;
                        }
                        
                        .comprobante-section {
                            padding: 25px;
                            border-left: 1px solid #e0e0e0;
                            border-right: 1px solid #e0e0e0;
                            background: white;
                        }
                        
                        .section-title {
                            color: #65a2bc;
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 20px;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #65a2bc;
                        }
                        
                        .datos-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 20px;
                            margin: 20px 0;
                        }
                        
                        .dato-item {
                            background: #f8f9fa;
                            padding: 18px;
                            border-radius: 8px;
                            border-left: 4px solid #65a2bc;
                        }
                        
                        .dato-item.especialidad {
                            border-left-color: #3498db;
                            background: #ebf3fd;
                        }
                        
                        .dato-item.medico {
                            border-left-color: #e74c3c;
                            background: #fdf2f2;
                        }
                        
                        .dato-item.fecha {
                            border-left-color: #27ae60;
                            background: #eafaf1;
                        }
                        
                        .dato-item.obra-social {
                            border-left-color: #9b59b6;
                            background: #f8f4fd;
                        }
                        
                        .dato-label {
                            font-weight: bold;
                            color: #555;
                            font-size: 12px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin-bottom: 8px;
                        }
                        
                        .dato-valor {
                            color: #333;
                            font-size: 16px;
                            font-weight: 500;
                        }
                        
                        .info-importante {
                            background: #fff3cd;
                            border: 2px solid #ffc107;
                            padding: 25px;
                            border-radius: 8px;
                            margin: 25px;
                        }
                        
                        .info-importante h4 {
                            color: #856404;
                            font-size: 18px;
                            margin-bottom: 15px;
                            font-weight: bold;
                        }
                        
                        .info-importante ul {
                            color: #856404;
                            margin-left: 20px;
                            line-height: 1.8;
                        }
                        
                        .info-importante li {
                            margin-bottom: 8px;
                            font-weight: 500;
                        }
                        
                        .comprobante-footer {
                            background: #f8f9fa;
                            padding: 25px;
                            text-align: center;
                            color: #666;
                            font-size: 14px;
                            border: 1px solid #e0e0e0;
                            border-radius: 0 0 8px 8px;
                            border-top: none;
                        }
                        
                        .comprobante-footer p {
                            margin: 5px 0;
                        }
                        
                        .comprobante-footer strong {
                            color: #65a2bc;
                        }
                        
                        /* Estilos específicos para PDF */
                        @media print {
                            body {
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            
                            .comprobante-container {
                                max-width: none;
                                margin: 0;
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="comprobante-container">
                        <div class="comprobante-header">
                            <div class="hospital-info">
                                <h1>🏥 Hospital Lifeline</h1>
                                <p>Comprobante de Turno Médico</p>
                                <div class="turno-numero">N° ${numeroTurno}</div>
                            </div>
                        </div>

                        <div class="comprobante-section">
                            <h3 class="section-title">👤 Datos del Paciente</h3>
                            <div class="datos-grid">
                                <div class="dato-item">
                                    <div class="dato-label">Nombre Completo</div>
                                    <div class="dato-valor">${datosCompletos.paciente.nombre} ${datosCompletos.paciente.apellido}</div>
                                </div>
                                <div class="dato-item">
                                    <div class="dato-label">DNI</div>
                                    <div class="dato-valor">${datosCompletos.paciente.dni}</div>
                                </div>
                                <div class="dato-item">
                                    <div class="dato-label">Fecha de Emisión</div>
                                    <div class="dato-valor">${fechaEmision}</div>
                                </div>
                            </div>
                        </div>

                        <div class="comprobante-section">
                            <h3 class="section-title">📅 Detalles del Turno</h3>
                            <div class="datos-grid">
                                <div class="dato-item especialidad">
                                    <div class="dato-label">Especialidad</div>
                                    <div class="dato-valor">${datosCompletos.especialidad}</div>
                                </div>
                                <div class="dato-item medico">
                                    <div class="dato-label">Médico</div>
                                    <div class="dato-valor">Dr/a. ${datosCompletos.medico}</div>
                                </div>
                                <div class="dato-item fecha">
                                    <div class="dato-label">Fecha del Turno</div>
                                    <div class="dato-valor">${fechaTurno}</div>
                                </div>
                                ${
                                datosCompletos.obraSocial
                                    ? `
                                <div class="dato-item obra-social">
                                    <div class="dato-label">Obra Social</div>
                                    <div class="dato-valor">${datosCompletos.obraSocial}</div>
                                </div>
                                `
                                    : ""
                                }
                            </div>
                        </div>

                        <div class="comprobante-section">
                            <h3 class="section-title">📍 Ubicación</h3>
                            <div class="datos-grid">
                                <div class="dato-item">
                                    <div class="dato-label">Provincia</div>
                                    <div class="dato-valor">${datosCompletos.provincia}</div>
                                </div>
                                <div class="dato-item">
                                    <div class="dato-label">Localidad</div>
                                    <div class="dato-valor">${datosCompletos.localidad}</div>
                                </div>
                            </div>
                        </div>

                        <div class="info-importante">
                            <h4>📋 Información Importante:</h4>
                            <ul>
                                <li>Presente este comprobante el día de su cita médica</li>
                                <li>Se atenderá por orden de llegada</li>
                                <li>Traiga su DNI y carnet de obra social (si corresponde)</li>
                                <li>Para cancelar o reprogramar, contacte con 48hs de anticipación</li>
                                <li>En caso de urgencia, diríjase a la guardia médica</li>
                            </ul>
                        </div>

                        <div class="comprobante-footer">
                            <p><strong>Hospital Lifeline</strong> - Cuidando tu salud con excelencia</p>
                            <p>Este comprobante es válido únicamente para la fecha y horario especificados</p>
                            <p>Número de turno: ${numeroTurno} | Emitido: ${fechaEmision}</p>
                        </div>
                    </div>
                </body>
                </html>
            `

        console.log("🚀 Iniciando Puppeteer...")

        // Configurar Puppeteer
        const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--disable-gpu",
        ],
        })

        const page = await browser.newPage()

        // Configurar el contenido HTML
        await page.setContent(htmlParaPDF, {
        waitUntil: "networkidle0",
        })

        console.log("📄 Generando PDF...")

        // Generar PDF
        const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
        })

        await browser.close()

        console.log("✅ PDF generado exitosamente")

        // Configurar headers para descarga
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="Comprobante_${numeroTurno}.pdf"`)
        res.setHeader("Content-Length", pdfBuffer.length)

        // Enviar el PDF
        res.send(pdfBuffer)
    } catch (error) {
        console.error("❌ Error generando PDF:", error)
        res.status(500).json({
        success: false,
        message: "Error al generar el PDF: " + error.message,
        })
    }
    }

    module.exports = {
    getMedicosByEspecialidad,
    checkDisponibilidad,
    crearTurnoConComprobante,
    enviarComprobanteEmail,
    generarPDF,
    }
