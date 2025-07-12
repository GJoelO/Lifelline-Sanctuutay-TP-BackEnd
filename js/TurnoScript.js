    // Script adaptado del admin que SÍ funciona
    document.addEventListener("DOMContentLoaded", () => {
    console.log("🏥 Iniciando formulario de turnos...")

    // Variables globales para almacenar datos
    let especialidadesData = []
    let medicosData = []
    let obrasSocialesData = []

    // Elementos del formulario
    const especialidadSelect = document.getElementById("especialidad")
    const medicoSelect = document.getElementById("medico")
    const medicoGroup = document.getElementById("medicoGroup")
    const provinciaSelect = document.getElementById("provincia")
    const obraSocialSelect = document.getElementById("obraSocial")
    const obraSocialGroup = document.getElementById("obraSocialGroup")
    const tieneObraSocialRadios = document.getElementsByName("tieneObraSocial")
    const disponibilidadInfo = document.getElementById("disponibilidadInfo")
    const turnosDisponibles = document.getElementById("turnosDisponibles")
    const fechaInput = document.getElementById("fecha")

    // Cargar datos iniciales
    init()

    async function init() {
        await cargarEspecialidades()
        await cargarTodosMedicos() // Cargar TODOS los médicos primero
        await cargarObrasSociales()
        cargarProvincias()
        configurarFechaMinima()
        setupEventListeners()
    }

    function setupEventListeners() {
        // Event listener para especialidad - IGUAL QUE EN EL ADMIN
        if (especialidadSelect) {
        especialidadSelect.addEventListener("change", (e) => {
            filterMedicosByEspecialidad("medico", e.target.value)
        })
        }

        if (fechaInput) {
        fechaInput.addEventListener("change", onFechaChange)
        }

        // Mostrar/ocultar obra social
        tieneObraSocialRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (this.value === "si") {
            obraSocialGroup.style.display = "block"
            obraSocialSelect.setAttribute("required", "required")
            } else {
            obraSocialGroup.style.display = "none"
            obraSocialSelect.removeAttribute("required")
            }
        })
        })
    }

    function configurarFechaMinima() {
        const mañana = new Date()
        mañana.setDate(mañana.getDate() + 1)
        const fechaMinima = mañana.toISOString().split("T")[0]
        if (fechaInput) {
        fechaInput.min = fechaMinima
        }
    }

    async function cargarEspecialidades() {
        try {
        console.log("📋 Cargando especialidades...")
        const response = await fetch("/especialidades")
        const data = await response.json()

        especialidadesData = Array.isArray(data) ? data : []
        console.log("✅ Especialidades cargadas:", especialidadesData)

        if (especialidadesData.length > 0) {
            especialidadSelect.innerHTML = '<option value="">Seleccione una especialidad</option>'
            especialidadesData.forEach((especialidad) => {
            const option = document.createElement("option")
            option.value = especialidad.id_especialidad
            option.textContent = especialidad.nombre
            especialidadSelect.appendChild(option)
            })
        }
        } catch (error) {
        console.error("❌ Error al cargar especialidades:", error)
        }
    }

    // CARGAR TODOS LOS MÉDICOS usando la nueva ruta
    async function cargarTodosMedicos() {
        try {
        console.log("👨‍⚕️ Cargando todos los médicos...")
        const response = await fetch("/turnos-comprobante/medicos?especialidad_id=all")
        const data = await response.json()

        medicosData = Array.isArray(data) ? data : []
        console.log("✅ Médicos cargados:", medicosData)
        } catch (error) {
        console.error("❌ Error al cargar médicos:", error)
        medicosData = []
        }
    }

    // FUNCIÓN EXACTA DEL ADMIN - Filtrar médicos por especialidad usando la nueva ruta
    async function filterMedicosByEspecialidad(medicoSelectId, especialidadId) {
        const medicoSelectElement = document.getElementById(medicoSelectId)
        if (!medicoSelectElement) return

        console.log(`🔍 Filtrando médicos para especialidad ${especialidadId}`)

        // Limpiar el select de médicos
        medicoSelectElement.innerHTML = '<option value="">Seleccione un médico</option>'

        if (!especialidadId) {
        console.log("❌ No hay especialidad seleccionada")
        medicoGroup.style.display = "none"
        return
        }

        try {
        // Usar la nueva ruta para obtener médicos por especialidad
        const response = await fetch(`/turnos-comprobante/medicos?especialidad_id=${especialidadId}`)
        const medicosFiltrados = await response.json()

        console.log(`✅ Médicos filtrados:`, medicosFiltrados)

        // Agregar médicos filtrados al select
        medicosFiltrados.forEach((medico) => {
            const option = document.createElement("option")
            option.value = medico.id_medico
            option.textContent = `Dr/a. ${medico.nombre} ${medico.apellido}`
            medicoSelectElement.appendChild(option)
        })

        // Mostrar el grupo de médicos
        medicoGroup.style.display = "flex"
        console.log(`✅ Select actualizado con ${medicosFiltrados.length} médicos`)

        // Verificar disponibilidad si hay fecha
        const fecha = fechaInput.value
        if (fecha) {
            verificarDisponibilidad(especialidadId, fecha)
        }
        } catch (error) {
        console.error("❌ Error al filtrar médicos:", error)
        }
    }

    async function cargarObrasSociales() {
        try {
        console.log("🏥 Cargando obras sociales...")
        const response = await fetch("/obrasocial")
        const data = await response.json()

        obrasSocialesData = Array.isArray(data) ? data : []
        console.log("✅ Obras sociales cargadas:", obrasSocialesData)

        if (obrasSocialesData.length > 0) {
            obraSocialSelect.innerHTML = '<option value="">Seleccione su obra social</option>'
            obrasSocialesData.forEach((obraSocial) => {
            const option = document.createElement("option")
            option.value = obraSocial.id_OS
            option.textContent = obraSocial.nombre
            obraSocialSelect.appendChild(option)
            })
        }
        } catch (error) {
        console.error("❌ Error al cargar obras sociales:", error)
        }
    }

    function cargarProvincias() {
        console.log("🗺️ Cargando provincias...")
        const provincias = [
        "Buenos Aires",
        "Ciudad Autónoma de Buenos Aires",
        "Catamarca",
        "Chaco",
        "Chubut",
        "Córdoba",
        "Corrientes",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tierra del Fuego",
        "Tucumán",
        ]

        provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>'
        provincias.forEach((provincia) => {
        const option = document.createElement("option")
        option.value = provincia
        option.textContent = provincia
        provinciaSelect.appendChild(option)
        })
    }

    async function verificarDisponibilidad(especialidadId, fecha) {
        try {
        console.log("🔍 Verificando disponibilidad:", { especialidadId, fecha })
        // CAMBIAR LA RUTA AQUÍ - usar la nueva ruta de comprobantes
        const response = await fetch(
            `/turnos-comprobante/disponibilidad?especialidad_id=${especialidadId}&fecha=${fecha}`,
        )

        if (response.ok) {
            const data = await response.json()
            console.log("✅ Disponibilidad:", data)

            if (data.success && turnosDisponibles) {
            turnosDisponibles.textContent = data.data.turnos_disponibles
            disponibilidadInfo.style.display = "block"
            }
        }
        } catch (error) {
        console.error("❌ Error al verificar disponibilidad:", error)
        }
    }

    function onFechaChange() {
        const especialidadId = especialidadSelect.value
        const fecha = fechaInput.value

        if (especialidadId && fecha) {
        verificarDisponibilidad(especialidadId, fecha)
        }
    }

    console.log("✅ Formulario de turnos inicializado correctamente")

    const form = document.getElementById("turnoForm")

    form.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(form)

        try {
        const response = await fetch("/turnos-comprobante/crear-con-comprobante", {
            method: "POST",
            body: formData,
        })

        if (response.ok) {
            const data = await response.json()
            if (data.success) {
            alert("Turno creado exitosamente!")
            window.location.href = "/turnos-comprobante/lista" // Redirect to the list page
            } else {
            alert("Error al crear el turno: " + data.message)
            }
        } else {
            alert("Error en la solicitud: " + response.status)
        }
        } catch (error) {
        console.error("Error:", error)
        alert("Ocurrió un error inesperado.")
        }
    })
    })
