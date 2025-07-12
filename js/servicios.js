    class ServiciosPage {
    constructor() {
        this.loadingElement = document.getElementById("loading")
        this.servicesContainer = document.getElementById("services-container")
        this.init()
    }

    async init() {
        try {
        await this.loadServices()
        this.createFloatingNav()
        this.setupRoomModals()
        } catch (error) {
        console.error("Error al cargar servicios:", error)
        this.showError()
        }
    }

    async loadServices() {
        try {
        const especialidadesResponse = await fetch("/especialidades")
        const medicosResponse = await fetch("/medicos")
        const habitacionesResponse = await fetch("/habitaciones")
        const usuariosResponse = await fetch("/usuarios")

        if (!especialidadesResponse.ok || !medicosResponse.ok || !habitacionesResponse.ok || !usuariosResponse.ok) {
            throw new Error("Error al obtener datos del servidor")
        }

        const especialidades = await especialidadesResponse.json()
        const medicos = await medicosResponse.json()
        const habitaciones = await habitacionesResponse.json()
        const usuarios = await usuariosResponse.json()

        const medicosReales = medicos.filter((medico) => {
            const usuario = usuarios.find((u) => u.id_usuario === medico.usuario_id)
            return usuario && usuario.rol_id === 2
        })

        this.renderServices(especialidades, medicosReales, habitaciones, usuarios)
        } catch (error) {
        console.error("Error:", error)
        throw error
        }
    }

    renderServices(especialidades, medicos, habitaciones, usuarios) {
        this.loadingElement.style.display = "none"
        this.servicesContainer.classList.add("loaded")

        const medicosPorEspecialidad = {}
        medicos.forEach((medico) => {
        if (!medicosPorEspecialidad[medico.especialidad_id]) {
            medicosPorEspecialidad[medico.especialidad_id] = []
        }
        medicosPorEspecialidad[medico.especialidad_id].push(medico)
        })

        especialidades.forEach((especialidad) => {
        const medicosDeEspecialidad = medicosPorEspecialidad[especialidad.id_especialidad] || []
        const especialidadElement = this.createSpecialtySection(
            especialidad,
            medicosDeEspecialidad,
            habitaciones,
            usuarios,
        )
        this.servicesContainer.appendChild(especialidadElement)
        })
    }

    createSpecialtySection(especialidad, medicos, habitaciones, usuarios) {
        const section = document.createElement("div")
        section.className = "specialty-section"
        section.id = `specialty-${especialidad.id_especialidad}`

        const imageUrl = especialidad.imagen_especialidad
        ? `/js/node/uploads/especialidades/${especialidad.imagen_especialidad}`
        : `https://via.placeholder.com/400x300/65a2bc/ffffff?text=Especialidad`

        section.innerHTML = `
                <div class="specialty-header">
                    <img src="${imageUrl}" alt="${especialidad.nombre}" class="specialty-image" 
                        onerror="this.src='https://via.placeholder.com/400x300/65a2bc/ffffff?text=Especialidad'">
                    <div class="specialty-info">
                        <h3>${especialidad.nombre}</h3>
                        <p>${especialidad.descripcion || "Descripción no disponible"}</p>
                    </div>
                </div>

                <div class="doctor-section">
                    <h4 class="doctor-title">Médico Especialista</h4>
                    ${this.renderDoctorCard(medicos[0], usuarios)}
                </div>

                <div class="rooms-section">
                    <h4 class="rooms-title">Tipos de Habitaciones</h4>
                    <div class="rooms-grid">
                        ${this.renderRooms(habitaciones)}
                    </div>
                </div>
            `

        return section
    }

    renderDoctorCard(medico, usuarios) {
        if (!medico) {
        return '<div class="no-doctor">No hay médico asignado a esta especialidad</div>'
        }

        const usuario = usuarios.find((u) => u.id_usuario === medico.usuario_id)

        if (!usuario) {
        return '<div class="no-doctor">Error: No se encontró información del médico</div>'
        }

        const fotoUrl = usuario.foto_perfil
        ? `/js/node/uploads/usuarios/${usuario.foto_perfil}`
        : "https://via.placeholder.com/100x100/65a2bc/ffffff?text=Dr"

        return `
        <div class="doctor-card">
            <img src="${fotoUrl}" alt="Dr. ${usuario.nombre} ${usuario.apellido}" class="doctor-image"
                onerror="this.src='https://via.placeholder.com/100x100/65a2bc/ffffff?text=Dr'; this.onerror=null;">
            <div class="doctor-info">
                <h4>Dr. ${usuario.nombre} ${usuario.apellido}</h4>
                <p class="doctor-specialty">${medico.especialidad || "Especialista"}</p>
            </div>
        </div>
    `
    }

    renderRooms(habitaciones) {
        if (!habitaciones || habitaciones.length === 0) {
        return '<div class="no-doctor">No hay habitaciones disponibles</div>'
        }

        return habitaciones
        .map((habitacion) => {
            const imageUrl = habitacion.imagen_habitacion
            ? `/js/node/uploads/habitaciones/${habitacion.imagen_habitacion}`
            : `https://via.placeholder.com/350x220/65a2bc/ffffff?text=Habitación`

            return `
                    <div class="room-card" data-room-id="${habitacion.id_habitacion}">
                        <img src="${imageUrl}" alt="Habitación ${habitacion.numero}" class="room-image"
                            onerror="this.src='https://via.placeholder.com/350x220/65a2bc/ffffff?text=Habitación'">
                        <div class="room-info">
                            <div class="room-number">Habitación ${habitacion.numero}</div>
                            <span class="room-type">${habitacion.tipo}</span>
                            <p class="room-description">${habitacion.descripcion || "Sin descripción disponible"}</p>
                        </div>
                    </div>
                `
        })
        .join("")
    }

    setupRoomModals() {
        // Crear el modal una sola vez
        const modal = document.createElement("div")
        modal.className = "room-modal"
        modal.innerHTML = `
                <div class="room-modal-content">
                    <div class="room-modal-header">
                        <img src="https://via.placeholder.com/800x400/65a2bc/ffffff?text=Habitación" alt="" class="room-modal-image">
                        <button class="room-modal-close">&times;</button>
                    </div>
                    <div class="room-modal-body">
                        <div class="room-modal-number"></div>
                        <span class="room-modal-type"></span>
                        <p class="room-modal-description"></p>
                    </div>
                </div>
            `
        document.body.appendChild(modal)

        // Event listeners para abrir modal
        document.addEventListener("click", (e) => {
        const roomCard = e.target.closest(".room-card")
        if (roomCard) {
            this.openRoomModal(roomCard, modal)
        }
        })

        // Event listeners para cerrar modal
        modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.classList.contains("room-modal-close")) {
            this.closeRoomModal(modal)
        }
        })

        // Cerrar con ESC
        document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            this.closeRoomModal(modal)
        }
        })
    }

    openRoomModal(roomCard, modal) {
        const roomImage = roomCard.querySelector(".room-image")
        const roomNumber = roomCard.querySelector(".room-number")
        const roomType = roomCard.querySelector(".room-type")
        const roomDescription = roomCard.querySelector(".room-description")

        // Llenar el modal con los datos
        modal.querySelector(".room-modal-image").src = roomImage.src
        modal.querySelector(".room-modal-image").alt = roomImage.alt
        modal.querySelector(".room-modal-number").textContent = roomNumber.textContent
        modal.querySelector(".room-modal-type").textContent = roomType.textContent
        modal.querySelector(".room-modal-description").textContent = roomDescription.textContent

        // Mostrar modal
        modal.classList.add("active")
        document.body.style.overflow = "hidden"
    }

    closeRoomModal(modal) {
        modal.classList.remove("active")
        document.body.style.overflow = "auto"
    }

    createFloatingNav() {
        const nav = document.createElement("div")
        nav.className = "services-nav"
        nav.innerHTML = `
            <h4>Especialidades</h4>
            <div class="nav-items">
                ${Array.from(document.querySelectorAll(".specialty-section"))
                .map((section, index) => {
                    const title = section.querySelector("h3").textContent
                    return `<a href="#${section.id}" class="nav-item" data-target="${section.id}">${title}</a>`
                })
                .join("")}
            </div>
        `

        document.body.appendChild(nav)

        // Agregar funcionalidad de scroll suave
        nav.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault()
            const targetId = item.getAttribute("data-target")
            const targetElement = document.getElementById(targetId)

            if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })

            // Actualizar item activo
            nav.querySelectorAll(".nav-item").forEach((navItem) => navItem.classList.remove("active"))
            item.classList.add("active")
            }
        })
        })

        // Función para actualizar el item activo
        const updateActiveNavItem = () => {
        const sections = document.querySelectorAll(".specialty-section")
        const scrollPosition = window.scrollY + 200 // Offset para el header

        let currentSection = null

        sections.forEach((section) => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.offsetHeight

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section
            }
        })

        if (currentSection) {
            const activeNavItem = nav.querySelector(`[data-target="${currentSection.id}"]`)
            if (activeNavItem) {
            // Remover clase active de todos los items
            nav.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"))
            // Agregar clase active al item correspondiente
            activeNavItem.classList.add("active")
            }
        }
        }

        // Escuchar el evento scroll
        let scrollTimeout
        window.addEventListener("scroll", () => {
        // Debounce para mejor rendimiento
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(updateActiveNavItem, 10)
        })

        // Activar el primer item por defecto
        const firstNavItem = nav.querySelector(".nav-item")
        if (firstNavItem) {
        firstNavItem.classList.add("active")
        }

        // Ejecutar una vez al cargar para establecer el estado inicial
        setTimeout(updateActiveNavItem, 100)
    }

    showError() {
        this.loadingElement.innerHTML = `
                <div style="text-align: center; color: #ef4444;">
                    <h3 style="font-size: 2.4rem; margin-bottom: 1rem;">Error al cargar los servicios</h3>
                    <p style="font-size: 1.8rem; margin-bottom: 2rem;">Por favor, intente nuevamente más tarde.</p>
                    <button onclick="location.reload()" style="padding: 1rem 2rem; background: var(--colorfond); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1.6rem;">
                        Reintentar
                    </button>
                </div>
            `
    }
    }

    // Inicializar la página cuando el DOM esté listo
    document.addEventListener("DOMContentLoaded", () => {
    new ServiciosPage()
    })
