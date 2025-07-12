    // Sistema de contacto y soporte
    class ContactSystem {
    constructor() {
        this.form = document.getElementById("contactForm")
        this.submitBtn = document.getElementById("submitBtn")
        this.loadingOverlay = document.getElementById("loadingOverlay")
        this.notification = document.getElementById("notification")
        this.userData = null

        this.init()
    }

    async init() {
        // Verificar autenticación antes de cargar la página
        if (!(await this.checkAuthentication())) {
        this.redirectToLogin()
        return
        }

        await this.loadUserData()
        this.setupEventListeners()
        this.setupCharacterCounter()
    }

    async checkAuthentication() {
        try {
        const response = await fetch("/auth/verify", {
            method: "GET",
            credentials: "include",
        })

        if (response.ok) {
            const data = await response.json()
            return data.auth
        }
        return false
        } catch (error) {
        console.error("Error verificando autenticación:", error)
        return false
        }
    }

    redirectToLogin() {
        this.showNotification("Debes iniciar sesión para acceder a esta página", "error")
        setTimeout(() => {
        window.location.href = "/login-register"
        }, 2000)
    }

    async loadUserData() {
        try {
        const response = await fetch("/auth/verify", {
            method: "GET",
            credentials: "include",
        })

        if (response.ok) {
            const data = await response.json()
            if (data.auth && data.user) {
            this.userData = data.user
            this.displayUserInfo()
            }
        }
        } catch (error) {
        console.error("Error cargando datos del usuario:", error)
        this.showNotification("Error cargando tus datos de contacto", "error")
        }
    }

    displayUserInfo() {
        if (!this.userData) return

        const nombreElement = document.getElementById("displayNombre")
        const emailElement = document.getElementById("displayEmail")
        const telefonoElement = document.getElementById("displayTelefono")

        if (nombreElement) {
        nombreElement.textContent = `${this.userData.nombre} ${this.userData.apellido}`
        }
        if (emailElement) {
        emailElement.textContent = this.userData.email
        }
        if (telefonoElement) {
        this.getUserPhone()
        }
    }

    async getUserPhone() {
        try {
        const response = await fetch(`/usuarios/${this.userData.id_usuario}`, {
            method: "GET",
            credentials: "include",
        })

        if (response.ok) {
            const userData = await response.json()
            const telefonoElement = document.getElementById("displayTelefono")
            if (telefonoElement && userData.telefono) {
            telefonoElement.textContent = userData.telefono
            } else if (telefonoElement) {
            telefonoElement.textContent = "No disponible"
            }
        }
        } catch (error) {
        console.error("Error obteniendo teléfono:", error)
        const telefonoElement = document.getElementById("displayTelefono")
        if (telefonoElement) {
            telefonoElement.textContent = "No disponible"
        }
        }
    }

    setupEventListeners() {
        if (this.form) {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e))
        }

        // Validación en tiempo real
        const motivoSelect = document.getElementById("motivo")
        const descripcionTextarea = document.getElementById("descripcion")

        if (motivoSelect) {
        motivoSelect.addEventListener("change", () => this.validateField("motivo"))
        }

        if (descripcionTextarea) {
        descripcionTextarea.addEventListener("input", () => {
            this.validateField("descripcion")
            this.updateCharacterCounter()
        })
        }
    }

    setupCharacterCounter() {
        const descripcionTextarea = document.getElementById("descripcion")
        const charCount = document.getElementById("charCount")

        if (descripcionTextarea && charCount) {
        descripcionTextarea.addEventListener("input", () => {
            const currentLength = descripcionTextarea.value.length
            charCount.textContent = currentLength

            if (currentLength > 450) {
            charCount.style.color = "#e74c3c"
            } else if (currentLength > 400) {
            charCount.style.color = "#f39c12"
            } else {
            charCount.style.color = "#666"
            }
        })
        }
    }

    updateCharacterCounter() {
        const descripcionTextarea = document.getElementById("descripcion")
        const charCount = document.getElementById("charCount")

        if (descripcionTextarea && charCount) {
        charCount.textContent = descripcionTextarea.value.length
        }
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName)
        const errorElement = document.getElementById(`${fieldName}Error`)
        const formGroup = field.closest(".form-group")

        if (!field || !errorElement || !formGroup) return false

        let isValid = true
        let errorMessage = ""

        switch (fieldName) {
        case "motivo":
            if (!field.value.trim()) {
            isValid = false
            errorMessage = "Por favor selecciona el motivo del problema"
            }
            break

        case "descripcion":
            const description = field.value.trim()
            if (!description) {
            isValid = false
            errorMessage = "Por favor describe el problema"
            } else if (description.length < 10) {
            isValid = false
            errorMessage = "La descripción debe tener al menos 10 caracteres"
            } else if (description.length > 500) {
            isValid = false
            errorMessage = "La descripción no puede exceder 500 caracteres"
            }
            break
        }

        errorElement.textContent = errorMessage
        formGroup.classList.remove("error", "success")

        if (field.value.trim()) {
        formGroup.classList.add(isValid ? "success" : "error")
        }

        return isValid
    }

    validateForm() {
        const motivoValid = this.validateField("motivo")
        const descripcionValid = this.validateField("descripcion")

        return motivoValid && descripcionValid
    }

    async handleSubmit(e) {
        e.preventDefault()

        if (!this.validateForm()) {
        this.showNotification("Por favor corrige los errores en el formulario", "error")
        return
        }

        if (!this.userData) {
        this.showNotification("Error: No se pudieron cargar tus datos de usuario", "error")
        return
        }

        this.showLoading(true)
        this.submitBtn.disabled = true

        try {
        const motivo = document.getElementById("motivo").value
        const descripcion = document.getElementById("descripcion").value

        const response = await fetch("/contacto/enviar", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            motivo: motivo,
            descripcion: descripcion,
            }),
            credentials: "include",
        })

        const result = await response.json()

        if (response.ok && result.success) {
            this.showNotification(result.message, "success")
            this.form.reset()
            this.updateCharacterCounter()

            // Limpiar estados de validación
            document.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("error", "success")
            })
            document.querySelectorAll(".error-message").forEach((error) => {
            error.textContent = ""
            })

            // Si hay una advertencia, mostrarla también
            if (result.warning) {
            setTimeout(() => {
                this.showNotification(result.warning, "info")
            }, 3000)
            }
        } else {
            this.showNotification(result.message || "Error al enviar el reporte", "error")
        }
        } catch (error) {
        console.error("Error enviando reporte:", error)
        this.showNotification("Error de conexión. Inténtalo de nuevo.", "error")
        } finally {
        this.showLoading(false)
        this.submitBtn.disabled = false
        }
    }

    showLoading(show) {
        if (this.loadingOverlay) {
        this.loadingOverlay.style.display = show ? "flex" : "none"
        }
    }

    showNotification(message, type = "info") {
        if (!this.notification) return

        this.notification.textContent = message
        this.notification.className = `notification ${type}`
        this.notification.classList.add("show")

        setTimeout(() => {
        this.notification.classList.remove("show")
        }, 5000)
    }
    }

    // Inicializar el sistema cuando el DOM esté listo
    document.addEventListener("DOMContentLoaded", () => {
    new ContactSystem()
    })
