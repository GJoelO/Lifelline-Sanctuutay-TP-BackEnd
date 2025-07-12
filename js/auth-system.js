    // Sistema de autenticación del frontend
    class AuthSystem {
    constructor() {
        this.user = null
        this.isAuthenticated = false
        this.init()
    }

    async init() {
        await this.checkAuthStatus()
        this.updateNavbar()
        this.setupEventListeners()
    }

    // Verificar el estado de autenticación
    async checkAuthStatus() {
        try {
        const response = await fetch("/auth/verify", {
            method: "GET",
            credentials: "include", // Incluir cookies
        })

        if (response.ok) {
            const data = await response.json()
            if (data.auth) {
            this.user = data.user
            this.isAuthenticated = true
            console.log("Usuario autenticado:", this.user)
            } else {
            this.clearAuthData()
            }
        } else {
            this.clearAuthData()
        }
        } catch (error) {
        console.error("Error checking auth status:", error)
        this.clearAuthData()
        }
    }

    // Limpiar datos de autenticación
    clearAuthData() {
        this.user = null
        this.isAuthenticated = false
        // Limpiar localStorage también
        localStorage.removeItem("token")
        localStorage.removeItem("nombre")
        localStorage.removeItem("apellido")
        localStorage.removeItem("foto")
    }

    // Actualizar la navbar según el estado de autenticación
    updateNavbar() {
        const userProfileContainer = document.getElementById("userProfileContainer")
        const loginButton = document.querySelector(".btnLogin-popup")
        const userName = document.getElementById("userName")
        const profileImage = document.getElementById("profileImage")
        const adminLink = document.getElementById("adminLink")

        if (this.isAuthenticated && this.user) {
        // Usuario logueado: mostrar menú de usuario
        if (userProfileContainer) {
            userProfileContainer.style.display = "inline-block"
        }
        if (loginButton) {
            loginButton.style.display = "none"
        }

        // Actualizar nombre de usuario
        if (userName) {
            userName.textContent = `${this.user.nombre} ${this.user.apellido}`
        }

        // Actualizar imagen de perfil
        if (profileImage && this.user.foto_perfil) {
            profileImage.src = `/js/node/uploads/usuarios/${this.user.foto_perfil}`
        }

        // Mostrar/ocultar enlace de administrador
        if (adminLink) {
            if (this.user.isAdmin) {
            adminLink.style.display = "block"
            } else {
            adminLink.style.display = "none"
            }
        }
        } else {
        // Usuario no logueado: mostrar botón de login
        if (userProfileContainer) {
            userProfileContainer.style.display = "none"
        }
        if (loginButton) {
            loginButton.style.display = "inline-block"
        }
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Toggle del menú de usuario
        const profileImage = document.getElementById("profileImage")
        const userDropdownMenu = document.getElementById("userDropdownMenu")

        if (profileImage && userDropdownMenu) {
        profileImage.addEventListener("click", (e) => {
            e.stopPropagation()
            userDropdownMenu.classList.toggle("show")
        })

        // Cerrar menú al hacer clic fuera
        document.addEventListener("click", (e) => {
            if (!userDropdownMenu.contains(e.target) && !profileImage.contains(e.target)) {
            userDropdownMenu.classList.remove("show")
            }
        })
        }

        // Botón de logout
        const logoutButton = document.getElementById("logoutButton")
        if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault()
            this.logout()
        })
        }
    }

    // Cerrar sesión
    async logout() {
        try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            credentials: "include",
        })

        if (response.ok) {
            this.clearAuthData()
            this.updateNavbar()
            // Redirigir al home
            window.location.href = "/"
        } else {
            console.error("Error during logout")
        }
        } catch (error) {
        console.error("Error during logout:", error)
        // Forzar logout local en caso de error
        this.clearAuthData()
        this.updateNavbar()
        window.location.href = "/"
        }
    }

    // Verificar si el usuario tiene acceso a una ruta
    hasAccess(requiredRole = null) {
        if (!this.isAuthenticated) {
        return false
        }

        if (requiredRole === "admin") {
        return this.user && this.user.isAdmin
        }

        return true
    }

    // Proteger ruta
    protectRoute(requiredRole = null) {
        if (!this.hasAccess(requiredRole)) {
        if (!this.isAuthenticated) {
            // Redirigir al login si no está autenticado
            window.location.href = "/login-register"
        } else if (requiredRole === "admin") {
            // Mostrar mensaje de acceso denegado para admin
            alert("Acceso denegado. Se requieren permisos de administrador.")
            window.location.href = "/"
        }
        return false
        }
        return true
    }

    // Obtener información del usuario
    getUser() {
        return this.user
    }

    // Verificar si está autenticado
    isAuth() {
        return this.isAuthenticated
    }
    }

    // Instancia global del sistema de autenticación
    window.authSystem = new AuthSystem()

    // Función para proteger rutas (usar en páginas específicas)
    window.protectRoute = (requiredRole = null) => {
    return window.authSystem.protectRoute(requiredRole)
    }
