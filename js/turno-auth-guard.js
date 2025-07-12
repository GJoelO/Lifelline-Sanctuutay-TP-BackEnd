    // Protección de ruta para la página de turnos
    document.addEventListener("DOMContentLoaded", async () => {
    console.log("🔒 Verificando autenticación para página de turnos...")

    // Esperar a que el sistema de autenticación se inicialice
    let attempts = 0
    const maxAttempts = 10

    const checkAuth = () => {
        return new Promise((resolve) => {
        const interval = setInterval(() => {
            attempts++

            if (window.authSystem && window.authSystem.isAuth !== undefined) {
            clearInterval(interval)
            resolve(true)
            } else if (attempts >= maxAttempts) {
            clearInterval(interval)
            resolve(false)
            }
        }, 500)
        })
    }

    const authReady = await checkAuth()

    if (!authReady) {
        console.log("❌ Sistema de autenticación no disponible, redirigiendo...")
        window.location.href = "/login-register"
        return
    }

    // Verificar si el usuario está autenticado
    if (!window.authSystem.isAuth()) {
        console.log("❌ Usuario no autenticado, redirigiendo al login...")

        // Mostrar mensaje opcional
        const showMessage = confirm("Debe iniciar sesión para solicitar un turno. ¿Desea ir a la página de login?")

        if (showMessage) {
        window.location.href = "/login-register"
        } else {
        window.location.href = "/"
        }
        return
    }

    console.log("✅ Usuario autenticado, acceso permitido")

    // Opcional: Mostrar información del usuario en el formulario
    const user = window.authSystem.getUser()
    if (user) {
        console.log("👤 Usuario:", user.nombre, user.apellido)

        // Aquí podrías pre-llenar algunos campos del formulario si tienes la información
        // Por ejemplo, si el usuario tiene provincia guardada, etc.
    }
    })

    // Función para verificar autenticación antes de enviar el formulario
    function verificarAutenticacionAntesDEnvio() {
    if (!window.authSystem || !window.authSystem.isAuth()) {
        alert("Su sesión ha expirado. Por favor, inicie sesión nuevamente.")
        window.location.href = "/login-register"
        return false
    }
    return true
    }

    // Hacer la función disponible globalmente
    window.verificarAutenticacionAntesDEnvio = verificarAutenticacionAntesDEnvio
