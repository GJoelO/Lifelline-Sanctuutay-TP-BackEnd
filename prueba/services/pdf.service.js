/*const PDFDocument = require("pdfkit")

    class PDFService {
    async generarComprobanteTurno(datos) {
        return new Promise((resolve, reject) => {
        try {
            console.log("📄 Generando PDF con datos:", datos)

            const doc = new PDFDocument({ margin: 50 })
            const chunks = []

            // Capturar el PDF en memoria
            doc.on("data", (chunk) => chunks.push(chunk))
            doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks)
            console.log("✅ PDF generado exitosamente")
            resolve(pdfBuffer)
            })

            // Configurar fuentes y colores
            const colorPrimario = "#65a2bc"
            const colorSecundario = "#2c3e50"
            const colorTexto = "#333333"

            // HEADER
            doc
            .fillColor(colorPrimario)
            .fontSize(24)
            .text("HOSPITAL LIFELLINE", 50, 50, { align: "center" })
            .fontSize(18)
            .text("COMPROBANTE DE TURNO MEDICO", 50, 80, { align: "center" })

            // Línea separadora
            doc.strokeColor(colorPrimario).lineWidth(2).moveTo(50, 110).lineTo(550, 110).stroke()

            // INFORMACIÓN DEL TURNO
            let yPosition = 140

            doc.fillColor(colorSecundario).fontSize(16).text("INFORMACION DEL TURNO", 50, yPosition)

            yPosition += 30

            // Crear tabla de información
            const infoTurno = [
            ["Numero de Turno:", `#${datos.id_turno}`],
            ["Fecha:", new Date(datos.fecha_turno).toLocaleDateString("es-ES")],
            ["Especialidad:", datos.nombre_especialidad],
            ["Medico:", `Dr/a. ${datos.nombre_medico}`],
            ["Obra Social:", datos.obra_social],
            ]

            infoTurno.forEach(([label, value]) => {
            doc
                .fillColor(colorTexto)
                .fontSize(12)
                .text(label, 70, yPosition, { width: 150, continued: true })
                .font("Helvetica-Bold")
                .text(value, 220, yPosition)
                .font("Helvetica")

            yPosition += 25
            })

            // INFORMACIÓN DEL PACIENTE
            yPosition += 20
            doc.fillColor(colorSecundario).fontSize(16).text("INFORMACION DEL PACIENTE", 50, yPosition)

            yPosition += 30

            const infoPaciente = [
            ["Nombre Completo:", `${datos.nombre_paciente} ${datos.apellido_paciente}`],
            ["DNI:", datos.dni_paciente],
            ["Email:", datos.email_paciente],
            ["Telefono:", datos.telefono_paciente || "No especificado"],
            ["Provincia:", datos.provincia || "No especificada"],
            ["Localidad:", datos.localidad || "No especificada"],
            ]

            infoPaciente.forEach(([label, value]) => {
            doc
                .fillColor(colorTexto)
                .fontSize(12)
                .text(label, 70, yPosition, { width: 150, continued: true })
                .font("Helvetica-Bold")
                .text(value, 220, yPosition)
                .font("Helvetica")

            yPosition += 25
            })

            // INSTRUCCIONES IMPORTANTES
            yPosition += 30
            doc.fillColor(colorSecundario).fontSize(16).text("INSTRUCCIONES IMPORTANTES", 50, yPosition)

            yPosition += 30

            const instrucciones = [
            "• Presentarse 15 minutos antes del horario del turno",
            "• Traer DNI y carnet de obra social",
            "• Para cancelar o reprogramar, contactar con 24hs de anticipacion",
            "• En caso de no asistir sin aviso, el turno sera dado de baja",
            ]

            doc.fillColor(colorTexto).fontSize(11)

            instrucciones.forEach((instruccion) => {
            doc.text(instruccion, 70, yPosition, { width: 450 })
            yPosition += 20
            })

            // FOOTER
            yPosition += 40

            // Línea separadora
            doc.strokeColor(colorPrimario).lineWidth(1).moveTo(50, yPosition).lineTo(550, yPosition).stroke()

            yPosition += 20

            doc
            .fillColor(colorPrimario)
            .fontSize(12)
            .text("Hospital Lifelline", 50, yPosition, { align: "center" })
            .fontSize(10)
            .text("info@hospitallifelline.com | (011) 1234-5678", 50, yPosition + 15, { align: "center" })
            .text("Av. Salud 123, Ciudad Autonoma de Buenos Aires", 50, yPosition + 30, { align: "center" })

            yPosition += 60

            doc
            .fillColor(colorTexto)
            .fontSize(8)
            .text(`Comprobante generado el ${new Date().toLocaleString("es-ES")}`, 50, yPosition, { align: "center" })

            // Finalizar el documento
            doc.end()
        } catch (error) {
            console.error("❌ Error generando PDF:", error)
            reject(error)
        }
        })
    }
    }

    // Crear instancia única del servicio
    const pdfService = new PDFService()

    module.exports = pdfService */ 
