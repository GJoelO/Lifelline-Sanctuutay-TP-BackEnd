    class AcercaDePage {
    constructor() {
        this.loadingElement = document.getElementById("loading")
        this.hospitalContainer = document.getElementById("hospital-container")
        this.init()
    }

    async init() {
        try {
        await this.loadHospitalInfo()
        } catch (error) {
        console.error("Error al cargar información del hospital:", error)
        this.showError()
        }
    }

    async loadHospitalInfo() {
        try {
        console.log("=== CARGANDO INFO HOSPITAL ===")
        console.log("Haciendo fetch a: /hospital/info")

        const response = await fetch("/hospital/info")
        console.log("Respuesta recibida:", response.status, response.statusText)

        if (!response.ok) {
            console.error("Error en la respuesta:", response.status, response.statusText)

            // Intentar obtener más detalles del error
            try {
            const errorData = await response.text()
            console.error("Detalles del error:", errorData)
            } catch (e) {
            console.error("No se pudo obtener detalles del error")
            }

            throw new Error(`Error HTTP: ${response.status}`)
        }

        const hospitalData = await response.json()
        console.log("Datos del hospital recibidos:", hospitalData)
        this.renderHospitalInfo(hospitalData)
        } catch (error) {
        console.error("Error completo:", error)
        throw error
        }
    }

    renderHospitalInfo(hospitalData) {
        this.loadingElement.style.display = "none"
        this.hospitalContainer.classList.add("loaded")

        const hospitalElement = this.createHospitalSection(hospitalData)
        this.hospitalContainer.appendChild(hospitalElement)
    }

    createHospitalSection(hospitalData) {
        const section = document.createElement("div")
        section.className = "hospital-section"

        console.log("=== DEBUG IMAGEN HOSPITAL ===")
        console.log("Datos del hospital:", hospitalData)
        console.log("Imagen en BD:", hospitalData.imagen_hospital)

        // Determinar la URL de la imagen basándose en tu estructura
        let imageUrl
        if (hospitalData.imagen_hospital) {
        // Si la imagen es exactamente "Foto-Hospital.jpg", usar la imagen local
        if (hospitalData.imagen_hospital === "Foto-Hospital.jpg") {
            imageUrl = "/img/Foto-Hospital.jpg"
            console.log("Usando imagen local:", imageUrl)
        } else {
            // Para imágenes subidas, usar la ruta de uploads (según tu controlador)
            imageUrl = `/js/node/uploads/hospital/${hospitalData.imagen_hospital}`
            console.log("Usando ruta de uploads:", imageUrl)
        }
        } else {
        imageUrl = `https://via.placeholder.com/600x500/65a2bc/ffffff?text=Hospital+Lifeline`
        console.log("Usando placeholder")
        }

        const descripcionFormateada = this.formatearDescripcion(hospitalData.descripcion || "Información no disponible")

        section.innerHTML = `
        <div class="hospital-content">
            <img src="${imageUrl}" alt="Hospital Lifeline" class="hospital-image" 
                onerror="this.handleImageError()" 
                onload="console.log('✅ Imagen cargada exitosamente:', this.src)">
            <div class="hospital-info">
            <h1>Hospital Lifeline</h1>
            <div class="hospital-description">
                ${descripcionFormateada}
            </div>
            </div>
        </div>
        `

        // Agregar función de manejo de errores de imagen
        const imgElement = section.querySelector(".hospital-image")
        const fallbackUrls = [
        "/img/Foto-Hospital.jpg", // Imagen local
        `https://via.placeholder.com/600x500/65a2bc/ffffff?text=Hospital+Lifeline`, // Placeholder final
        ]
        let currentFallbackIndex = 0

        imgElement.handleImageError = function () {
        console.error("❌ Error cargando imagen:", this.src)

        if (currentFallbackIndex < fallbackUrls.length) {
            console.log(`🔄 Intentando fallback ${currentFallbackIndex + 1}:`, fallbackUrls[currentFallbackIndex])
            this.src = fallbackUrls[currentFallbackIndex]
            currentFallbackIndex++
        } else {
            console.error("❌ Todos los fallbacks fallaron")
        }
        }

        return section
    }

    formatearDescripcion(descripcion) {
        const parrafos = descripcion.split("\r\n\r\n").filter((p) => p.trim() !== "")

        let html = ""

        parrafos.forEach((parrafo) => {
        const parrafoLimpio = parrafo.replace(/\r\n/g, " ").trim()

        if (parrafoLimpio.length < 50 && !parrafoLimpio.endsWith(".") && !parrafoLimpio.endsWith(",")) {
            html += `<h2>${parrafoLimpio}</h2>`
        } else {
            html += `<p>${parrafoLimpio}</p>`
        }
        })

        return html
    }

    showError() {
        this.loadingElement.style.display = "none"
        this.hospitalContainer.innerHTML = `
        <div class="error">
            <h3>Error al cargar la información</h3>
            <p>No se pudo cargar la información del hospital.</p>
            <p>Por favor, intente nuevamente más tarde.</p>
            <button onclick="location.reload()">
            Reintentar
            </button>
        </div>
        `
        this.hospitalContainer.classList.add("loaded")
    }
    }

    // Inicializar la página cuando el DOM esté listo
    document.addEventListener("DOMContentLoaded", () => {
    new AcercaDePage()
    })
