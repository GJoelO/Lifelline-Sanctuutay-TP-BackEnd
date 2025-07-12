    // Script específico para el menú de usuario - Versión mejorada
    console.log("Cargando userMenu.js v2.0")

    // Variables globales para el menú
    let userDropdownMenu = null
    let profileImage = null
    let overlay = null

    // Función para inicializar el menú dropdown
    function initializeDropdownMenu() {
    console.log("Inicializando menú dropdown...")

    // Obtener elementos
    userDropdownMenu = document.getElementById("userDropdownMenu")
    profileImage = document.getElementById("profileImage")

    console.log("Elementos encontrados:")
    console.log("- profileImage:", profileImage)
    console.log("- userDropdownMenu:", userDropdownMenu)

    if (!profileImage || !userDropdownMenu) {
        console.log("No se encontraron los elementos necesarios")
        return false
    }

    // Crear overlay si no existe
    overlay = document.getElementById("dropdown-overlay")
    if (!overlay) {
        overlay = document.createElement("div")
        overlay.id = "dropdown-overlay"
        overlay.className = "dropdown-overlay"
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        display: none;
        `
        document.body.appendChild(overlay)
        console.log("Overlay creado")
    }

    // Limpiar event listeners existentes
    const newProfileImage = profileImage.cloneNode(true)
    profileImage.parentNode.replaceChild(newProfileImage, profileImage)
    profileImage = newProfileImage

    // Agregar event listener para abrir/cerrar menú
    profileImage.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        console.log("CLICK DETECTADO EN IMAGEN DE PERFIL")

        const isOpen = userDropdownMenu.classList.contains("show")
        console.log("Estado actual del menú:", isOpen ? "abierto" : "cerrado")

        if (isOpen) {
        closeDropdownMenu()
        } else {
        openDropdownMenu()
        }
    })

    // Event listener para cerrar con overlay
    overlay.addEventListener("click", () => {
        console.log("Cerrando menú por overlay")
        closeDropdownMenu()
    })

    // Prevenir cierre al hacer clic dentro del menú
    userDropdownMenu.addEventListener("click", (e) => {
        e.stopPropagation()
    })

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && userDropdownMenu.classList.contains("show")) {
        console.log("Cerrando menú con Escape")
        closeDropdownMenu()
        }
    })

    console.log("Menú dropdown inicializado correctamente")
    return true
    }

    // Función para abrir el menú
    function openDropdownMenu() {
    console.log("Abriendo menú dropdown")

    if (userDropdownMenu && overlay) {
        userDropdownMenu.classList.add("show")
        overlay.style.display = "block"
        overlay.classList.add("show")
        console.log("Menú abierto")
    }
    }

    // Función para cerrar el menú
    function closeDropdownMenu() {
    console.log("Cerrando menú dropdown")

    if (userDropdownMenu && overlay) {
        userDropdownMenu.classList.remove("show")
        overlay.style.display = "none"
        overlay.classList.remove("show")
        console.log("Menú cerrado")
    }
    }

    // Función para debuggear el menú dropdown
    function debugDropdownMenu() {
    console.log("=== DEBUG DROPDOWN MENU ===")

    const profileImage = document.getElementById("profileImage")
    const userDropdownMenu = document.getElementById("userDropdownMenu")
    const userProfileContainer = document.getElementById("userProfileContainer")

    console.log("Elementos:")
    console.log("- profileImage:", profileImage)
    console.log("- userDropdownMenu:", userDropdownMenu)
    console.log("- userProfileContainer:", userProfileContainer)

    if (profileImage) {
        console.log("- Estilos de profileImage:")
        const styles = window.getComputedStyle(profileImage)
        console.log("  - display:", styles.display)
        console.log("  - visibility:", styles.visibility)
        console.log("  - pointer-events:", styles.pointerEvents)
        console.log("  - z-index:", styles.zIndex)
    }

    if (userDropdownMenu) {
        console.log("- Estado del dropdown:")
        console.log("  - Clases:", userDropdownMenu.classList.toString())
        console.log("  - Display:", window.getComputedStyle(userDropdownMenu).display)
        console.log("  - Visibility:", window.getComputedStyle(userDropdownMenu).visibility)
        console.log("  - Opacity:", window.getComputedStyle(userDropdownMenu).opacity)
    }

    if (userProfileContainer) {
        console.log("- Container display:", window.getComputedStyle(userProfileContainer).display)
    }

    console.log("=== FIN DEBUG ===")
    }

    // Función para forzar la apertura del menú (para testing)
    function forceOpenDropdown() {
    console.log("🔧 Forzando apertura del menú...")
    openDropdownMenu()
    }

    // Función para forzar el cierre del menú
    function forceCloseDropdown() {
    console.log("🔧 Forzando cierre del menú...")
    closeDropdownMenu()
    }

    // Función para reinicializar el menú
    function reinitializeDropdown() {
    console.log("🔄 Reinicializando dropdown...")

    // Esperar un poco y luego inicializar
    setTimeout(() => {
        if (initializeDropdownMenu()) {
        console.log("Dropdown reinicializado correctamente")
        } else {
        console.log("Error al reinicializar dropdown")
        }
    }, 500)
    }

    // Inicializar cuando el DOM esté listo
    document.addEventListener("DOMContentLoaded", () => {
    console.log("userMenu.js - DOM cargado")

    // Intentar inicializar varias veces para asegurar que funcione
    setTimeout(() => {
        console.log("🔧 Primer intento de inicialización...")
        initializeDropdownMenu()
    }, 500)

    setTimeout(() => {
        console.log("🔧 Segundo intento de inicialización...")
        initializeDropdownMenu()
    }, 1500)

    setTimeout(() => {
        console.log("🔧 Tercer intento de inicialización...")
        initializeDropdownMenu()
    }, 3000)
    })

    // Hacer las funciones disponibles globalmente para debugging
    window.debugDropdownMenu = debugDropdownMenu
    window.forceOpenDropdown = forceOpenDropdown
    window.forceCloseDropdown = forceCloseDropdown
    window.reinitializeDropdown = reinitializeDropdown
    window.initializeDropdownMenu = initializeDropdownMenu

    console.log("userMenu.js v2.0 cargado completamente")
    console.log("Funciones disponibles:")
    console.log("   - debugDropdownMenu()")
    console.log("   - forceOpenDropdown()")
    console.log("   - forceCloseDropdown()")
    console.log("   - reinitializeDropdown()")
