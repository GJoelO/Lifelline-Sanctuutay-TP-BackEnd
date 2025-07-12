    // Sistema de comprobante de turnos - JavaScript Vanilla
    document.addEventListener("DOMContentLoaded", () => {
    console.log("🎫 Sistema de comprobante de turnos iniciado")

    // Verificar si estamos en la página de turnos (no en admin)
    if (window.location.pathname.includes("admin")) {
        console.log("🚫 Página de admin detectada, no inicializar comprobantes")
        return
    }

    // Verificar si estamos en la página de turnos
    if (
        window.location.pathname.includes("turnos") ||
        document.getElementById("turnoForm") ||
        document.getElementById("solicitudForm")
    ) {
        initializeTurnoComprobante()
    }
    })

    function initializeTurnoComprobante() {
    // Verificar que no estemos en admin
    if (window.location.pathname.includes("admin")) {
        return
    }

    const form = document.getElementById("turnoForm") || document.getElementById("solicitudForm")

    if (form) {
        // Verificar si ya tiene el event listener para evitar duplicados
        if (form.hasAttribute("data-comprobante-initialized")) {
        console.log("⚠️ Comprobante ya inicializado")
        return
        }

        // Marcar como inicializado
        form.setAttribute("data-comprobante-initialized", "true")

        // Reemplazar el event listener existente
        form.addEventListener("submit", handleTurnoSubmitWithComprobante)

        // Inicializar filtrado de médicos
        inicializarFiltradoMedicos()

        console.log("✅ Event listener del comprobante configurado")
    }
    }

    // Variable global para almacenar datos del turno para el email
    let datosComprobanteGlobal = null

    async function handleTurnoSubmitWithComprobante(event) {
    event.preventDefault()
    event.stopPropagation()

    console.log("🎫 Procesando turno con comprobante...")

    // Verificar que no estemos en admin
    if (window.location.pathname.includes("admin")) {
        console.log("🚫 Evitando ejecución en página de admin")
        return
    }

    // Verificar autenticación antes de proceder
    if (typeof window.authSystem === "undefined" || !window.authSystem) {
        console.log("⚠️ Sistema de autenticación no disponible")
        alert("Sistema de autenticación no disponible. Recargue la página.")
        return
    }

    if (!window.authSystem.isAuth()) {
        alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.")
        window.location.href = "/login-register"
        return
    }

    const form = event.target
    const formData = new FormData(form)

    // Debug: mostrar todos los datos del formulario
    console.log("📝 Datos del formulario:")
    for (const [key, value] of formData.entries()) {
        console.log(`- ${key}:`, value, typeof value)
    }

    // Obtener valores usando múltiples métodos para asegurar compatibilidad
    const especialidad =
        formData.get("especialidad_id") ||
        formData.get("especialidad") ||
        getSelectValue("especialidad") ||
        getSelectValue("especialidad_id")

    const medico =
        formData.get("medico_id") || formData.get("medico") || getSelectValue("medico") || getSelectValue("medico_id")

    const fecha =
        formData.get("fecha") || formData.get("fecha_turno") || getInputValue("fecha") || getInputValue("fecha_turno")

    const provincia = formData.get("provincia") || getSelectValue("provincia") || getInputValue("provincia")

    const localidad = formData.get("localidad") || getInputValue("localidad")

    const tieneObraSocial =
        formData.get("tieneObraSocial") ||
        formData.get("tiene_obra_social") ||
        getRadioValue("tieneObraSocial") ||
        getRadioValue("tiene_obra_social")

    const obraSocial =
        formData.get("obra_social_id") ||
        formData.get("obra_social") ||
        getSelectValue("obra_social_id") ||
        getSelectValue("obra_social") ||
        getSelectValue("obraSocial")

    console.log("🔍 Verificación de campos:")
    console.log("- Especialidad:", especialidad, "¿Válido?", !!especialidad && especialidad !== "")
    console.log("- Médico:", medico, "¿Válido?", !!medico && medico !== "")
    console.log("- Fecha:", fecha, "¿Válido?", !!fecha && fecha !== "")
    console.log("- Provincia:", provincia, "¿Válido?", !!provincia && provincia !== "")
    console.log("- Localidad:", localidad, "¿Válido?", !!localidad && localidad !== "")
    console.log("- Tiene obra social:", tieneObraSocial, "¿Válido?", !!tieneObraSocial && tieneObraSocial !== "")
    console.log("- Obra social:", obraSocial)

    // Validación detallada con mensajes específicos
    const camposVacios = []

    if (!especialidad || especialidad === "" || especialidad === "undefined") {
        camposVacios.push("Especialidad")
    }

    if (!medico || medico === "" || medico === "undefined") {
        camposVacios.push("Médico")
    }

    if (!fecha || fecha === "" || fecha === "undefined") {
        camposVacios.push("Fecha")
    }

    if (!provincia || provincia === "" || provincia === "undefined") {
        camposVacios.push("Provincia")
    }

    if (!localidad || localidad === "" || localidad === "undefined") {
        camposVacios.push("Localidad")
    }

    if (!tieneObraSocial || tieneObraSocial === "" || tieneObraSocial === "undefined") {
        camposVacios.push("Obra Social (Sí/No)")
    }

    // Si tiene obra social, verificar que se haya seleccionado una
    if (tieneObraSocial === "si" || tieneObraSocial === "Sí") {
        if (!obraSocial || obraSocial === "" || obraSocial === "undefined") {
        camposVacios.push("Selección de Obra Social")
        }
    }

    if (camposVacios.length > 0) {
        const mensaje = `Por favor, complete los siguientes campos:\n• ${camposVacios.join("\n• ")}`
        alert(mensaje)

        // Resaltar campos vacíos
        resaltarCamposVacios(camposVacios)
        return
    }

    // Validar fecha (no puede ser anterior a mañana)
    const fechaSeleccionada = new Date(fecha)
    const mañana = new Date()
    mañana.setDate(mañana.getDate() + 1)
    mañana.setHours(0, 0, 0, 0)

    if (fechaSeleccionada < mañana) {
        alert("La fecha del turno debe ser a partir de mañana.")
        return
    }

    // Crear FormData con los valores correctos
    const finalFormData = new FormData()
    finalFormData.append("especialidad_id", especialidad)
    finalFormData.append("medico_id", medico)
    finalFormData.append("fecha", fecha)
    finalFormData.append("provincia", provincia)
    finalFormData.append("localidad", localidad)
    finalFormData.append("tieneObraSocial", tieneObraSocial)

    if (tieneObraSocial === "si" || tieneObraSocial === "Sí") {
        finalFormData.append("obra_social_id", obraSocial)
    }

    console.log("📤 Datos finales a enviar:")
    for (const [key, value] of finalFormData.entries()) {
        console.log(`- ${key}:`, value)
    }

    try {
        // Mostrar loading
        showLoadingState(true)

        console.log("📤 Enviando datos al servidor...")

        // Crear el turno
        const response = await fetch("/turnos-comprobante/crear-con-comprobante", {
        method: "POST",
        body: finalFormData,
        credentials: "include", // Incluir cookies para autenticación
        })

        console.log("📥 Respuesta del servidor:", response.status, response.statusText)

        const result = await response.json()
        console.log("📋 Resultado:", result)

        if (response.ok && result.success) {
        console.log("✅ Turno creado exitosamente:", result)

        // Almacenar datos globalmente para el envío de email
        datosComprobanteGlobal = {
            turno: result.turno,
            datosCompletos: result.datosCompletos,
        }

        // Mostrar confirmación y comprobante
        await mostrarConfirmacionYComprobante(result.turno, result.datosCompletos)
        } else {
        console.error("❌ Error al crear turno:", result)
        alert("Error al crear el turno: " + (result.message || "Error desconocido"))

        // Si hay información de debugging, mostrarla
        if (result.camposFaltantes) {
            console.log("Campos faltantes:", result.camposFaltantes)
            console.log("Datos recibidos por el servidor:", result.datosRecibidos)
        }
        }
    } catch (error) {
        console.error("❌ Error de conexión:", error)
        alert("Error de conexión. Por favor, intente nuevamente.")
    } finally {
        showLoadingState(false)
    }
    }

    // Funciones auxiliares para obtener valores de diferentes tipos de elementos
    function getSelectValue(id) {
    const element = document.getElementById(id)
    return element ? element.value : null
    }

    function getInputValue(id) {
    const element = document.getElementById(id)
    return element ? element.value : null
    }

    function getRadioValue(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]`)
    for (const radio of radios) {
        if (radio.checked) {
        return radio.value
        }
    }
    return null
    }

    // Nueva función para resaltar campos vacíos
    function resaltarCamposVacios(camposVacios) {
    // Limpiar resaltados anteriores
    document.querySelectorAll(".campo-error").forEach((el) => {
        el.classList.remove("campo-error")
    })

    // Mapeo de nombres de campos a posibles IDs de elementos
    const mapeoElementos = {
        Especialidad: ["especialidad", "especialidad_id"],
        Médico: ["medico", "medico_id"],
        Fecha: ["fecha", "fecha_turno"],
        Provincia: ["provincia"],
        Localidad: ["localidad"],
        "Obra Social (Sí/No)": ["tieneObraSocial", "tiene_obra_social"],
        "Selección de Obra Social": ["obra_social_id", "obra_social", "obraSocial"],
    }

    // Resaltar campos vacíos
    camposVacios.forEach((campo) => {
        const posiblesIds = mapeoElementos[campo] || []

        for (const elementId of posiblesIds) {
        const elemento = document.getElementById(elementId)
        if (elemento) {
            elemento.classList.add("campo-error")
            break // Solo resaltar el primer elemento encontrado
        }
        }

        // Para radio buttons, resaltar el contenedor
        if (campo === "Obra Social (Sí/No)") {
        const radioGroup =
            document.querySelector(".radio-group") ||
            document.querySelector('[name="tieneObraSocial"]')?.closest(".form-group")
        if (radioGroup) {
            radioGroup.classList.add("campo-error")
        }
        }
    })

    // Agregar estilos CSS si no existen
    if (!document.getElementById("campo-error-styles")) {
        const style = document.createElement("style")
        style.id = "campo-error-styles"
        style.textContent = `
        .campo-error {
            border: 2px solid #e74c3c !important;
            background-color: #fdf2f2 !important;
        }
        .radio-group.campo-error,
        .form-group.campo-error {
            border: 2px solid #e74c3c;
            border-radius: 4px;
            padding: 10px;
            background-color: #fdf2f2;
        }
        `
        document.head.appendChild(style)
    }

    // Scroll al primer campo con error
    const primerCampoError = document.querySelector(".campo-error")
    if (primerCampoError) {
        primerCampoError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    }

    async function mostrarConfirmacionYComprobante(turnoData, datosCompletos) {
    console.log("🎫 Mostrando comprobante:", { turnoData, datosCompletos })

    // Ocultar formulario
    const formularioContainer =
        document.getElementById("formulario") ||
        document.querySelector(".turno-form-container") ||
        document.querySelector("form").closest("div")
    if (formularioContainer) {
        formularioContainer.style.display = "none"
    }

    // Crear y mostrar el comprobante
    const comprobanteHTML = generarComprobanteHTML(turnoData, datosCompletos)

    // Buscar o crear contenedor del comprobante
    let comprobanteContainer = document.getElementById("comprobante-container")
    if (!comprobanteContainer) {
        comprobanteContainer = document.createElement("div")
        comprobanteContainer.id = "comprobante-container"

        // Buscar contenedor principal
        const mainContainer =
        document.querySelector(".container") ||
        document.querySelector(".turno-main") ||
        document.querySelector("main") ||
        document.body

        mainContainer.appendChild(comprobanteContainer)
    }

    comprobanteContainer.innerHTML = comprobanteHTML
    comprobanteContainer.style.display = "block"

    // Configurar event listeners para los botones
    setupComprobanteEventListeners()

    // Scroll al comprobante
    comprobanteContainer.scrollIntoView({ behavior: "smooth" })
    }

    function generarComprobanteHTML(turnoData, datosCompletos) {
    const fechaEmision = new Date().toLocaleString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    const fechaTurno = new Date(turnoData.fecha_turno).toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const numeroTurno = `HLF-${Date.now().toString().slice(-8)}`

    return `
            <!-- Mensaje de confirmación -->
            <div class="confirmacion-mensaje">
                <div class="confirmacion-content">
                    <div class="success-icon">✓</div>
                    <h2>¡Turno Confirmado con Éxito!</h2>
                    <p>Su turno ha sido registrado correctamente en nuestro sistema</p>
                </div>
            </div>

            <!-- Comprobante -->
            <div class="comprobante-wrapper">
                <div class="comprobante-container" id="comprobante-contenido">
                    <!-- Header del comprobante -->
                    <div class="comprobante-header">
                        <div class="hospital-logo">
                            <img src="/img/Logo PNG.png" alt="Logo Hospital Lifeline" onerror="this.style.display='none'">
                        </div>
                        <div class="hospital-info">
                            <h1>Hospital Lifeline</h1>
                            <p>Comprobante de Turno Médico</p>
                        </div>
                        <div class="turno-numero">
                            <span>N° ${numeroTurno}</span>
                        </div>
                    </div>

                    <!-- Información del paciente -->
                    <div class="comprobante-section">
                        <h3 class="section-title">
                            <i class="icon-user"></i>
                            Datos del Paciente
                        </h3>
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

                    <!-- Información del turno -->
                    <div class="comprobante-section">
                        <h3 class="section-title">
                            <i class="icon-calendar"></i>
                            Detalles del Turno
                        </h3>
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

                    <!-- Información de ubicación -->
                    <div class="comprobante-section">
                        <h3 class="section-title">
                            <i class="icon-location"></i>
                            Ubicación
                        </h3>
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

                    <!-- Información importante -->
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

                    <!-- Footer -->
                    <div class="comprobante-footer">
                        <p><strong>Hospital Lifeline</strong> - Cuidando tu salud con excelencia</p>
                        <p>Este comprobante es válido únicamente para la fecha y horario especificados</p>
                        <p>Número de turno: ${numeroTurno} | Emitido: ${fechaEmision}</p>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="comprobante-actions no-print">
                    <button id="btn-enviar-email" class="btn-action btn-primary">
                        <i class="icon-email"></i>
                        Enviar Comprobante al Mail
                    </button>
                    <button id="btn-descargar" class="btn-action btn-secondary">
                        <i class="icon-download"></i>
                        Descargar PDF
                    </button>
                    <button id="btn-nuevo-turno" class="btn-action btn-outline">
                        <i class="icon-plus"></i>
                        Solicitar Otro Turno
                    </button>
                    <button id="btn-volver-inicio" class="btn-action btn-outline">
                        <i class="icon-home"></i>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        `
    }

    function setupComprobanteEventListeners() {
    // Verificar que los elementos existan antes de agregar listeners
    const btnEnviarEmail = document.getElementById("btn-enviar-email")
    if (btnEnviarEmail) {
        btnEnviarEmail.addEventListener("click", enviarComprobanteEmail)
    }

    const btnDescargar = document.getElementById("btn-descargar")
    if (btnDescargar) {
        btnDescargar.addEventListener("click", descargarComprobantePDF)
    }

    const btnNuevoTurno = document.getElementById("btn-nuevo-turno")
    if (btnNuevoTurno) {
        btnNuevoTurno.addEventListener("click", solicitarNuevoTurno)
    }

    const btnVolverInicio = document.getElementById("btn-volver-inicio")
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener("click", () => {
        window.location.href = "/"
        })
    }
    }

    async function enviarComprobanteEmail() {
    console.log("📧 Enviando comprobante por email...")

    if (!datosComprobanteGlobal) {
        alert("Error: No se encontraron los datos del comprobante")
        return
    }

    // Mostrar estado de envío
    const btnEnviar = document.getElementById("btn-enviar-email")
    const textoOriginal = btnEnviar.innerHTML
    btnEnviar.disabled = true
    btnEnviar.innerHTML = '<i class="icon-loading"></i> Enviando...'

    try {
        // Obtener el contenido HTML del comprobante
        const contenidoComprobante = document.getElementById("comprobante-contenido")
        if (!contenidoComprobante) {
        throw new Error("No se pudo obtener el contenido del comprobante")
        }

        // Preparar datos para enviar
        const emailData = {
        turnoData: datosComprobanteGlobal.turno,
        datosCompletos: datosComprobanteGlobal.datosCompletos,
        contenidoHTML: contenidoComprobante.innerHTML,
        }

        console.log("📤 Enviando email con datos:", emailData)

        // Enviar al backend
        const response = await fetch("/turnos-comprobante/enviar-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
        credentials: "include",
        })

        const result = await response.json()

        if (response.ok && result.success) {
        // Mostrar mensaje de éxito
        mostrarMensajeExitoEmail(result.emailDestino, result.numeroTurno)
        console.log("✅ Email enviado exitosamente:", result)
        } else {
        throw new Error(result.message || "Error al enviar el email")
        }
    } catch (error) {
        console.error("❌ Error enviando email:", error)
        alert("❌ Error al enviar el comprobante por email: " + error.message)
    } finally {
        // Restaurar botón
        btnEnviar.disabled = false
        btnEnviar.innerHTML = textoOriginal
    }
    }

    async function descargarComprobantePDF() {
    console.log("📥 Descargando comprobante como PDF...")

    if (!datosComprobanteGlobal) {
        alert("Error: No se encontraron los datos del comprobante")
        return
    }

    // Mostrar estado de descarga
    const btnDescargar = document.getElementById("btn-descargar")
    const textoOriginal = btnDescargar.innerHTML
    btnDescargar.disabled = true
    btnDescargar.innerHTML = '<i class="icon-loading"></i> Generando PDF...'

    try {
        // Obtener el contenido HTML del comprobante
        const contenidoComprobante = document.getElementById("comprobante-contenido")
        if (!contenidoComprobante) {
        throw new Error("No se pudo obtener el contenido del comprobante")
        }

        // Preparar datos para enviar al backend
        const pdfData = {
        turnoData: datosComprobanteGlobal.turno,
        datosCompletos: datosComprobanteGlobal.datosCompletos,
        contenidoHTML: contenidoComprobante.innerHTML,
        }

        console.log("📤 Solicitando generación de PDF...")

        // Solicitar PDF al backend
        const response = await fetch("/turnos-comprobante/generar-pdf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
        credentials: "include",
        })

        if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al generar el PDF")
        }

        // Obtener el PDF como blob
        const pdfBlob = await response.blob()

        // Crear URL temporal para el blob
        const pdfUrl = window.URL.createObjectURL(pdfBlob)

        // Generar nombre del archivo
        const numeroTurno = document.querySelector(".turno-numero span")?.textContent || "turno"
        const fechaActual = new Date().toISOString().split("T")[0]
        const nombreArchivo = `Comprobante_${numeroTurno}_${fechaActual}.pdf`

        // Crear enlace de descarga y hacer clic automáticamente
        const enlaceDescarga = document.createElement("a")
        enlaceDescarga.href = pdfUrl
        enlaceDescarga.download = nombreArchivo
        enlaceDescarga.style.display = "none"

        // Agregar al DOM, hacer clic y remover
        document.body.appendChild(enlaceDescarga)
        enlaceDescarga.click()
        document.body.removeChild(enlaceDescarga)

        // Limpiar URL temporal
        setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl)
        }, 1000)

        console.log("✅ PDF descargado exitosamente:", nombreArchivo)
    } catch (error) {
        console.error("❌ Error descargando PDF:", error)
        alert("❌ Error al descargar el comprobante: " + error.message)
    } finally {
        // Restaurar botón
        btnDescargar.disabled = false
        btnDescargar.innerHTML = textoOriginal
    }
    }

    function solicitarNuevoTurno() {
    console.log("🔄 Solicitando nuevo turno...")

    // Ocultar comprobante
    const comprobanteContainer = document.getElementById("comprobante-container")
    if (comprobanteContainer) {
        comprobanteContainer.style.display = "none"
    }

    // Mostrar formulario
    const formularioContainer = document.getElementById("formulario") || document.querySelector(".turno-form-container")
    if (formularioContainer) {
        formularioContainer.style.display = "block"

        // Limpiar formulario
        const form = document.getElementById("turnoForm") || document.getElementById("solicitudForm")
        if (form) {
        form.reset()

        // Limpiar selects dependientes
        const medicoSelect = document.getElementById("medico") || document.getElementById("medico_id")
        if (medicoSelect) {
            medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>'
            const medicoGroup = document.getElementById("medicoGroup")
            if (medicoGroup) {
            medicoGroup.style.display = "none"
            }
        }

        // Ocultar obra social
        const obraSocialGroup = document.getElementById("obraSocialGroup")
        if (obraSocialGroup) {
            obraSocialGroup.style.display = "none"
        }
        }

        // Scroll al formulario
        formularioContainer.scrollIntoView({ behavior: "smooth" })
    }
    }

    function showLoadingState(show) {
    const submitBtn =
        document.querySelector('button[type="submit"]') ||
        document.querySelector(".btn-submit") ||
        document.querySelector('button:contains("Solicitar Turno")')
    if (submitBtn) {
        if (show) {
        submitBtn.disabled = true
        submitBtn.textContent = "Procesando..."
        } else {
        submitBtn.disabled = false
        submitBtn.textContent = submitBtn.getAttribute("data-original-text") || "Solicitar Turno"
        }
    }
    }

    function getComprobanteStyles() {
    return `
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: #333;
            }
            .comprobante-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
            }
            .comprobante-header {
                background: linear-gradient(135deg, #65a2bc, #4a90a4);
                color: white;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .hospital-logo img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: white;
                padding: 5px;
            }
            .hospital-info h1 {
                margin: 0;
                font-size: 24px;
            }
            .hospital-info p {
                margin: 5px 0 0;
                opacity: 0.9;
            }
            .turno-numero {
                background: rgba(255,255,255,0.2);
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
            }
            .comprobante-section {
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            .section-title {
                color: #65a2bc;
                font-size: 18px;
                margin-bottom: 15px;
                font-weight: bold;
            }
            .datos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            .dato-item {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #65a2bc;
            }
            .dato-label {
                font-weight: bold;
                color: #555;
                font-size: 14px;
                margin-bottom: 5px;
            }
            .dato-valor {
                color: #333;
                font-size: 16px;
            }
            .info-importante {
                background: #fff3cd;
                border: 1px solid #ffc107;
                padding: 20px;
                margin: 20px;
                border-radius: 6px;
            }
            .info-importante h4 {
                color: #856404;
                margin-top: 0;
            }
            .info-importante ul {
                color: #856404;
                margin: 10px 0 0 20px;
            }
            .comprobante-footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            @media print {
                body { margin: 0; padding: 0; }
                .comprobante-container { border: none; border-radius: 0; }
            }
            .icon-email::before {
            content: "📧";
            }
            .icon-loading::before {
            content: "⏳";
            }
        `
    }

    // Función para cargar médicos por especialidad
    async function cargarMedicosPorEspecialidad(especialidadId) {
    console.log("🔍 Cargando médicos para especialidad:", especialidadId)

    const medicoSelect = document.getElementById("medico") || document.getElementById("medico_id")
    const medicoGroup = document.getElementById("medicoGroup")

    if (!medicoSelect) {
        console.log("❌ No se encontró el select de médicos")
        return
    }

    // Limpiar el select de médicos
    medicoSelect.innerHTML = '<option value="">Seleccione un médico</option>'

    // Ocultar el grupo de médicos si no hay especialidad seleccionada
    if (!especialidadId || especialidadId === "") {
        if (medicoGroup) {
        medicoGroup.style.display = "none"
        }
        return
    }

    try {
        // Hacer petición al backend para obtener médicos filtrados
        const response = await fetch(`/turnos-comprobante/medicos?especialidad_id=${especialidadId}`)

        if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
        }

        const medicos = await response.json()
        console.log("📋 Médicos recibidos:", medicos)

        if (!Array.isArray(medicos)) {
        console.log("⚠️ La respuesta no es un array:", medicos)
        return
        }

        // Agregar médicos al select
        medicos.forEach((medico) => {
        const option = document.createElement("option")
        option.value = medico.id_medico
        option.textContent = `Dr/a. ${medico.nombre} ${medico.apellido}`
        medicoSelect.appendChild(option)
        })

        // Mostrar el grupo de médicos
        if (medicoGroup) {
        medicoGroup.style.display = "block"
        }

        console.log(`✅ ${medicos.length} médicos cargados para la especialidad ${especialidadId}`)
    } catch (error) {
        console.error("❌ Error cargando médicos:", error)

        // En caso de error, mostrar mensaje en el select
        medicoSelect.innerHTML = '<option value="">Error cargando médicos</option>'

        if (medicoGroup) {
        medicoGroup.style.display = "none"
        }
    }
    }

    // Función para inicializar el filtrado de médicos
    function inicializarFiltradoMedicos() {
    const especialidadSelect = document.getElementById("especialidad") || document.getElementById("especialidad_id")

    if (especialidadSelect) {
        // Remover listeners existentes para evitar duplicados
        especialidadSelect.removeEventListener("change", manejarCambioEspecialidad)

        // Agregar nuevo listener
        especialidadSelect.addEventListener("change", manejarCambioEspecialidad)

        console.log("✅ Filtrado de médicos inicializado")
    } else {
        console.log("⚠️ No se encontró el select de especialidades")
    }
    }

    // Función para manejar el cambio de especialidad
    function manejarCambioEspecialidad(event) {
    const especialidadId = event.target.value
    console.log("🔄 Especialidad cambiada a:", especialidadId)

    // Cargar médicos para la nueva especialidad
    cargarMedicosPorEspecialidad(especialidadId)
    }

    // Hacer funciones disponibles globalmente solo si no estamos en admin
    if (!window.location.pathname.includes("admin")) {
    window.mostrarConfirmacionYComprobante = mostrarConfirmacionYComprobante
    window.enviarComprobanteEmail = enviarComprobanteEmail
    window.descargarComprobantePDF = descargarComprobantePDF
    window.solicitarNuevoTurno = solicitarNuevoTurno
    }

    // Función para mostrar mensaje de éxito atractivo
    function mostrarMensajeExitoEmail(emailDestino, numeroTurno) {
    // Crear overlay
    const overlay = document.createElement("div")
    overlay.className = "email-success-overlay"

    // Crear modal
    const modal = document.createElement("div")
    modal.className = "email-success-modal"

    modal.innerHTML = `
        <div class="email-success-content">
        <div class="email-success-icon">
            <div class="email-icon-animation">
            📧
            </div>
            <div class="success-checkmark">✓</div>
        </div>
        
        <h2 class="email-success-title">¡Comprobante Enviado!</h2>
        
        <p class="email-success-message">
            Su comprobante de turno ha sido enviado exitosamente a:
        </p>
        
        <div class="email-address-container">
            <span class="email-address">${emailDestino}</span>
        </div>
        
        <div class="email-success-details">
            <div class="detail-item">
            <span class="detail-icon">🎫</span>
            <span class="detail-text">Número de turno: <strong>${numeroTurno}</strong></span>
            </div>
            <div class="detail-item">
            <span class="detail-icon">⏰</span>
            <span class="detail-text">Enviado: <strong>${new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</strong></span>
            </div>
        </div>
        
        <div class="email-success-tips">
            <h4>💡 Consejos importantes:</h4>
            <ul>
            <li>Revise su <strong>bandeja de entrada</strong></li>
            <li>No olvide verificar la carpeta de <strong>spam</strong></li>
            <li>Guarde el comprobante para el día de su cita</li>
            </ul>
        </div>
        
        <div class="email-success-actions">
            <button class="btn-email-success" onclick="cerrarMensajeExito()">
            <span class="btn-icon">👍</span>
            ¡Perfecto!
            </button>
        </div>
        </div>
    `

    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    // Agregar estilos si no existen
    if (!document.getElementById("email-success-styles")) {
        const styles = document.createElement("style")
        styles.id = "email-success-styles"
        styles.textContent = `
        .email-success-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeInOverlay 0.3s ease-out;
        }
        
        .email-success-modal {
            background: white;
            border-radius: 20px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideInModal 0.4s ease-out;
            position: relative;
        }
        
        .email-success-content {
            padding: 40px 30px 30px;
            text-align: center;
        }
        
        .email-success-icon {
            position: relative;
            margin-bottom: 25px;
        }
        
        .email-icon-animation {
            font-size: 60px;
            animation: bounceEmail 2s infinite;
            display: inline-block;
        }
        
        .success-checkmark {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #27ae60;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            animation: popIn 0.6s ease-out 0.5s both;
            box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
        }
        
        .email-success-title {
            color: #2c3e50;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .email-success-message {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .email-address-container {
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            border: 2px solid #27ae60;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 25px;
        }
        
        .email-address {
            color: #27ae60;
            font-weight: bold;
            font-size: 18px;
            word-break: break-all;
        }
        
        .email-success-details {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            text-align: left;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 15px;
        }
        
        .detail-item:last-child {
            margin-bottom: 0;
        }
        
        .detail-icon {
            font-size: 20px;
            margin-right: 12px;
            width: 25px;
            text-align: center;
        }
        
        .detail-text {
            color: #555;
            flex: 1;
        }
        
        .email-success-tips {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            border: 2px solid #ffc107;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
        }
        
        .email-success-tips h4 {
            color: #856404;
            margin-bottom: 15px;
            font-size: 16px;
            text-align: center;
        }
        
        .email-success-tips ul {
            color: #856404;
            margin: 0;
            padding-left: 20px;
            line-height: 1.8;
        }
        
        .email-success-tips li {
            margin-bottom: 8px;
            font-weight: 500;
        }
        
        .email-success-actions {
            text-align: center;
        }
        
        .btn-email-success {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 0 auto;
            min-width: 180px;
        }
        
        .btn-email-success:hover {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
        }
        
        .btn-email-success:active {
            transform: translateY(0);
        }
        
        .btn-icon {
            font-size: 20px;
        }
        
        /* Animaciones */
        @keyframes fadeInOverlay {
            from {
            opacity: 0;
            }
            to {
            opacity: 1;
            }
        }
        
        @keyframes slideInModal {
            from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
            }
            to {
            opacity: 1;
            transform: translateY(0) scale(1);
            }
        }
        
        @keyframes bounceEmail {
            0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
            }
            40% {
            transform: translateY(-10px);
            }
            60% {
            transform: translateY(-5px);
            }
        }
        
        @keyframes popIn {
            from {
            opacity: 0;
            transform: scale(0);
            }
            to {
            opacity: 1;
            transform: scale(1);
            }
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .email-success-modal {
            width: 95%;
            margin: 10px;
            }
            
            .email-success-content {
            padding: 30px 20px 25px;
            }
            
            .email-success-title {
            font-size: 24px;
            }
            
            .email-icon-animation {
            font-size: 50px;
            }
            
            .btn-email-success {
            padding: 12px 30px;
            font-size: 16px;
            min-width: 160px;
            }
        }
        `
        document.head.appendChild(styles)
    }

    // Animación de entrada
    setTimeout(() => {
        overlay.style.opacity = "1"
    }, 10)

    // Cerrar con ESC
    const handleEsc = (e) => {
        if (e.key === "Escape") {
        cerrarMensajeExito()
        document.removeEventListener("keydown", handleEsc)
        }
    }
    document.addEventListener("keydown", handleEsc)

    // Cerrar al hacer clic fuera del modal
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
        cerrarMensajeExito()
        }
    })
    }

    // Función para cerrar el mensaje de éxito
    function cerrarMensajeExito() {
    const overlay = document.querySelector(".email-success-overlay")
    if (overlay) {
        overlay.style.animation = "fadeInOverlay 0.3s ease-out reverse"
        setTimeout(() => {
        overlay.remove()
        }, 300)
    }
    }

    console.log("✅ Sistema de comprobante de turnos cargado")
