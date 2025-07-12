    const wrapper = document.querySelector(".wrapper")
    const loginLink = document.querySelector(".login-link")
    const registerLink = document.querySelector(".register-link")
    const btnPopup = document.querySelector(".btnLogin-popup")
    const iconClose = document.querySelector(".icon-close")
    const notification = document.getElementById("notification")

    registerLink.addEventListener("click", () => {
    wrapper.classList.add("active")
    })

    loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active")
    })

    btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup")
    })

    iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup")
    })

    // Automáticamente abrir el formulario de login cuando la página carga
    document.addEventListener("DOMContentLoaded", () => {
    wrapper.classList.add("active-popup")
    })

    // Función para mostrar notificaciones
    function showNotification(message, type = "success") {
    notification.textContent = message
    notification.className = `notification ${type} show`

    setTimeout(() => {
        notification.classList.remove("show")
    }, 3000)
    }

    // Manejo mejorado del input de archivo
    document.addEventListener("DOMContentLoaded", () => {
    const profilePhotoInput = document.getElementById("profilePhoto")

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener("change", handleFileSelect)
    }
    })

    function handleFileSelect(event) {
    const file = event.target.files[0]
    const fileDefaultContent = document.getElementById("fileDefaultContent")
    const filePreviewContent = document.getElementById("filePreviewContent")
    const previewImg = document.getElementById("previewImg")
    const fileName = document.getElementById("fileName")
    const fileSize = document.getElementById("fileSize")
    const fileLabel = document.getElementById("fileLabel")
    const fileInputBox = document.querySelector(".file-input-box")

    if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
        showNotification("Por favor selecciona un archivo de imagen válido", "error")
        event.target.value = ""
        return
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
        showNotification("El archivo es demasiado grande. El tamaño máximo es 5MB", "error")
        event.target.value = ""
        return
        }

        // Ocultar contenido por defecto y mostrar preview
        if (fileDefaultContent) {
        fileDefaultContent.classList.add("hidden")
        }
        if (filePreviewContent) {
        filePreviewContent.classList.remove("hidden")
        }

        // Añadir clase de archivo seleccionado
        if (fileLabel) {
        fileLabel.classList.add("file-selected")
        }
        if (fileInputBox) {
        fileInputBox.classList.add("valid")
        fileInputBox.classList.remove("invalid")
        }

        // Mostrar información del archivo
        if (fileName) fileName.textContent = file.name
        if (fileSize) fileSize.textContent = formatFileSize(file.size)

        // Crear preview de la imagen
        const reader = new FileReader()
        reader.onload = (e) => {
        if (previewImg) {
            previewImg.src = e.target.result
        }
        }
        reader.readAsDataURL(file)

        showNotification("Imagen seleccionada correctamente", "success")
    }
    }

    function clearFileSelection() {
    const fileInput = document.getElementById("profilePhoto")
    const fileDefaultContent = document.getElementById("fileDefaultContent")
    const filePreviewContent = document.getElementById("filePreviewContent")
    const fileLabel = document.getElementById("fileLabel")
    const fileInputBox = document.querySelector(".file-input-box")

    // Limpiar input
    if (fileInput) fileInput.value = ""

    // Mostrar contenido por defecto y ocultar preview
    if (fileDefaultContent) {
        fileDefaultContent.classList.remove("hidden")
    }
    if (filePreviewContent) {
        filePreviewContent.classList.add("hidden")
    }

    // Remover clases de estado
    if (fileLabel) {
        fileLabel.classList.remove("file-selected")
    }
    if (fileInputBox) {
        fileInputBox.classList.remove("valid")
        fileInputBox.classList.remove("invalid")
    }

    showNotification("Selección de imagen cancelada", "error")
    }

    function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    // --- REGISTRO ---
    const form = document.getElementById("form-registro")
    if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        console.log("=== INICIANDO REGISTRO ===")

        // Validar que se haya seleccionado una foto
        const profilePhoto = document.getElementById("profilePhoto")
        if (!profilePhoto.files || profilePhoto.files.length === 0) {
        showNotification("Por favor selecciona una foto de perfil", "error")
        return
        }

        // Validar el archivo antes del envío
        const file = profilePhoto.files[0]
        if (!file.type.startsWith("image/")) {
        showNotification("Por favor selecciona un archivo de imagen válido", "error")
        return
        }

        if (file.size > 5 * 1024 * 1024) {
        showNotification("El archivo es demasiado grande. Máximo 5MB", "error")
        return
        }

        // Obtener los valores de los campos
        const campos = {
        nombre: form.querySelector('[name="firstName"]').value.trim(),
        apellido: form.querySelector('[name="lastName"]').value.trim(),
        dni: form.querySelector('[name="dni"]').value.trim(),
        telefono: form.querySelector('[name="phone"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        contrasena: form.querySelector('[name="password"]').value,
        confirm_password: form.querySelector('[name="confirm_password"]').value,
        }

        console.log("Campos obtenidos:", campos)

        // Validación
        const resultado = validarRegistro(campos)
        if (!resultado.valido) {
        showNotification(resultado.mensaje, "error")
        return
        }

        const formData = new FormData()
        formData.append("nombre", campos.nombre)
        formData.append("apellido", campos.apellido)
        formData.append("dni", campos.dni)
        formData.append("email", campos.email)
        formData.append("telefono", campos.telefono)
        formData.append("contrasena", campos.contrasena)
        formData.append("foto_perfil", profilePhoto.files[0])

        console.log("Enviando datos al servidor...")

        try {
        const res = await fetch("/auth/register", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        console.log("Respuesta del servidor:", data)

        if (data.success === false && data.existe) {
            showNotification(data.message, "error")
            return
        }

        if (res.ok && data.success) {
            showNotification("¡Registro exitoso! Redirigiendo al login...", "success")

            // Limpiar formulario
            form.reset()
            clearFileSelection()

            // Esperar 2 segundos y luego cambiar a la vista de login
            setTimeout(() => {
            wrapper.classList.remove("active") // Esto cambia a la vista de login
            showNotification("Ahora puedes iniciar sesión con tus credenciales", "success")
            }, 2000)
        } else {
            showNotification(data.message || "Ocurrió un error inesperado.", "error")
        }
        } catch (err) {
        console.error("Error de conexión:", err)
        showNotification("No se pudo conectar con el servidor.", "error")
        }
    })
    }

    // --- LOGIN ---
    const loginForm = document.getElementById("form-login")
    if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        console.log("=== INICIANDO LOGIN ===")

        const emailInput = loginForm.querySelector('[name="email"]')
        const passwordInput = loginForm.querySelector('[name="password"]')
        const email = emailInput.value.trim()
        const password = passwordInput.value

        console.log("Datos de login:", { email, password: "***" })

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email) || email.includes(" ")) {
        showNotification("Ingrese un email válido y sin espacios.", "error")
        return
        }

        // Validación de contraseña
        if (!password || password.length > 10) {
        showNotification("La contraseña no puede estar vacía y debe tener hasta 10 caracteres.", "error")
        return
        }

        // Crear FormData con los nombres correctos
        const formData = new FormData()
        formData.append("email", email)
        formData.append("contrasena", password)

        try {
        const res = await fetch("/auth/login", {
            method: "POST",
            body: formData,
        })

        const data = await res.json()
        console.log("Respuesta del login:", data)

        if (res.ok && data.auth) {
            // Guardar datos en localStorage
            localStorage.setItem("token", data.token)
            localStorage.setItem("nombre", data.user.nombre)
            localStorage.setItem("apellido", data.user.apellido)
            if (data.user.foto_perfil) {
            localStorage.setItem("foto", data.user.foto_perfil)
            }

            showNotification("¡Inicio de sesión exitoso! Redirigiendo...", "success")

            setTimeout(() => {
            window.location.href = "/"
            }, 1500)
        } else {
            const mensaje = data.message || "Credenciales incorrectas."
            showNotification(mensaje, "error")
        }
        } catch (err) {
        console.error("Error de conexión:", err)
        showNotification("No se pudo conectar con el servidor.", "error")
        }
    })
    }

    // Función de validación para registro
    function validarRegistro(campos) {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,15}$/

    // Validación nombre
    if (!campos.nombre || !soloLetras.test(campos.nombre)) {
        return { valido: false, mensaje: "El nombre solo puede contener letras y espacios, y hasta 15 caracteres." }
    }

    // Validación apellido
    if (!campos.apellido || !soloLetras.test(campos.apellido)) {
        return { valido: false, mensaje: "El apellido solo puede contener letras y espacios, y hasta 15 caracteres." }
    }

    // Validación DNI
    const dniRegex = /^\d{7,8}$/
    if (!campos.dni || !dniRegex.test(campos.dni)) {
        return { valido: false, mensaje: "El DNI debe contener entre 7 y 8 dígitos numéricos." }
    }

    // Validación teléfono
    const telefonoRegex = /^[\d\s\-+()]{8,15}$/
    if (!campos.telefono || !telefonoRegex.test(campos.telefono)) {
        return {
        valido: false,
        mensaje:
            "El teléfono debe tener entre 8 y 15 caracteres y solo puede contener números, espacios, guiones, paréntesis y el signo +.",
        }
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!campos.email || !emailRegex.test(campos.email) || campos.email.includes(" ")) {
        return { valido: false, mensaje: "Ingrese un email válido y sin espacios." }
    }

    // Validación contraseña
    if (!campos.contrasena || campos.contrasena.length > 10) {
        return { valido: false, mensaje: "La contraseña no puede estar vacía y debe tener hasta 10 caracteres." }
    }

    // Validación confirmación de contraseña
    if (campos.contrasena !== campos.confirm_password) {
        return { valido: false, mensaje: "Las contraseñas no coinciden." }
    }

    // Validación campos obligatorios
    for (const key in campos) {
        if (key !== "confirm_password" && (!campos[key] || campos[key].trim() === "")) {
        return { valido: false, mensaje: "Todos los campos son obligatorios." }
        }
    }

    return { valido: true }
    }
