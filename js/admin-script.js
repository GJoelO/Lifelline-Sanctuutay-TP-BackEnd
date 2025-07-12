    // Sistema CRUD completo para Hospital Lifeline - Conectado al Backend
    class HospitalCRUD {
    constructor() {
        this.baseURL = window.location.origin // URL base del servidor
        this.endpoints = {
        usuarios: "/usuarios",
        usuariosMedicos: "/usuarios/medicos", // NUEVO endpoint
        especialidades: "/especialidades",
        habitaciones: "/habitaciones",
        historiales: "/historialesmedicos",
        medicos: "/medicos",
        obrasSociales: "/obrasocial",
        roles: "/roles",
        turnos: "/turnos",
        hospital: "/hospital", // NUEVO endpoint para hospital
        }

        this.data = {
        usuarios: [],
        usuariosMedicos: [], // NUEVO array para usuarios médicos
        especialidades: [],
        habitaciones: [],
        historiales: [],
        medicos: [],
        obrasSociales: [],
        roles: [],
        turnos: [],
        hospital: [], // NUEVO array para hospital
        }

        this.currentEditingId = null
        this.currentTable = null

        this.init()
    }

    async init() {
        this.initializeTabs()
        this.initializeForms()
        await this.loadAllData()
        this.loadAllTables()
        this.updateDashboard()
    }

    // Métodos HTTP para comunicación con el backend
    async apiRequest(url, options = {}) {
        try {
        const response = await fetch(`${this.baseURL}${url}`, {
            headers: {
            "Content-Type": "application/json",
            ...options.headers,
            },
            ...options,
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
        } catch (error) {
        console.error("API Request Error:", error)
        this.showMessage("error", `Error de conexión: ${error.message}`)
        throw error
        }
    }

    async get(endpoint) {
        return await this.apiRequest(endpoint, { method: "GET" })
    }

    async post(endpoint, data) {
        return await this.apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        })
    }

    async put(endpoint, data) {
        return await this.apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
        })
    }

    async delete(endpoint) {
        return await this.apiRequest(endpoint, { method: "DELETE" })
    }

    // Cargar todos los datos desde el backend
    async loadAllData() {
        try {
        this.showMessage("info", "Cargando datos...")

        const promises = Object.keys(this.endpoints).map(async (key) => {
            try {
            const data = await this.get(this.endpoints[key])
            this.data[key] = Array.isArray(data) ? data : []
            console.log(`Datos cargados para ${key}:`, this.data[key]) // Debug
            return { key, success: true }
            } catch (error) {
            console.error(`Error loading ${key}:`, error)
            this.data[key] = []
            return { key, success: false, error }
            }
        })

        const results = await Promise.all(promises)
        const failedLoads = results.filter((r) => !r.success)

        if (failedLoads.length > 0) {
            this.showMessage("warning", `Algunos datos no se pudieron cargar: ${failedLoads.map((f) => f.key).join(", ")}`)
        } else {
            this.showMessage("success", "Datos cargados correctamente")
        }

        // Cargar opciones de select después de cargar todos los datos
        this.loadSelectOptions()
        } catch (error) {
        this.showMessage("error", "Error al cargar los datos del servidor")
        console.error("Load all data error:", error)
        }
    }

    // Inicializar navegación por tabs
    initializeTabs() {
        const tabButtons = document.querySelectorAll(".tab-button")
        const tabContents = document.querySelectorAll(".tab-content")

        tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tabId = button.getAttribute("data-tab")

            tabButtons.forEach((btn) => btn.classList.remove("active"))
            tabContents.forEach((content) => content.classList.remove("active"))

            button.classList.add("active")
            document.getElementById(tabId).classList.add("active")

            this.loadTableData(tabId)
        })
        })
    }

    // Inicializar formularios
    initializeForms() {
        const tables = [
        "usuarios",
        "especialidades",
        "habitaciones",
        "historiales",
        "medicos",
        "obras-sociales",
        "roles",
        "turnos",
        "hospital", // NUEVO
        ]

        tables.forEach((table) => {
        const form = document.getElementById(`${table}-form`)
        if (form) {
            form.addEventListener("submit", (e) => {
            e.preventDefault()
            this.handleFormSubmit(table)
            })
        }
        })

        // Inicializar el input de foto de perfil para usuarios
        const fotoInput = document.getElementById("usuarios-foto-input")
        if (fotoInput) {
        fotoInput.addEventListener("change", (e) => {
            const fileLabel = document.getElementById("usuarios-foto-label")
            if (fileLabel) {
            fileLabel.textContent = e.target.files[0] ? e.target.files[0].name : "Seleccionar archivo"
            }

            // Mostrar vista previa de la imagen
            const file = e.target.files[0]
            const preview = document.getElementById("foto-preview")
            if (file && preview) {
            const reader = new FileReader()
            reader.onload = (e) => {
                preview.src = e.target.result
                preview.style.display = "block"
            }
            reader.readAsDataURL(file)
            }
        })
        }

        // Inicializar el input de imagen para especialidades
        const especialidadesImagenInput = document.getElementById("especialidades-imagen-input")
        if (especialidadesImagenInput) {
        especialidadesImagenInput.addEventListener("change", (e) => {
            const fileLabel = document.getElementById("especialidades-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = e.target.files[0] ? e.target.files[0].name : "Seleccionar imagen"
            }

            // Mostrar vista previa de la imagen
            const file = e.target.files[0]
            const preview = document.getElementById("especialidades-imagen-preview")
            if (file && preview) {
            const reader = new FileReader()
            reader.onload = (e) => {
                preview.src = e.target.result
                preview.style.display = "block"
            }
            reader.readAsDataURL(file)
            }
        })
        }

        // Inicializar el input de imagen para habitaciones
        const habitacionesImagenInput = document.getElementById("habitaciones-imagen-input")
        if (habitacionesImagenInput) {
        habitacionesImagenInput.addEventListener("change", (e) => {
            const fileLabel = document.getElementById("habitaciones-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = e.target.files[0] ? e.target.files[0].name : "Seleccionar imagen"
            }

            // Mostrar vista previa de la imagen
            const file = e.target.files[0]
            const preview = document.getElementById("habitaciones-imagen-preview")
            if (file && preview) {
            const reader = new FileReader()
            reader.onload = (e) => {
                preview.src = e.target.result
                preview.style.display = "block"
            }
            reader.readAsDataURL(file)
            }
        })
        }

        // NUEVO: Inicializar el input de imagen para hospital
        const hospitalImagenInput = document.getElementById("hospital-imagen-input")
        if (hospitalImagenInput) {
        hospitalImagenInput.addEventListener("change", (e) => {
            const fileLabel = document.getElementById("hospital-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = e.target.files[0] ? e.target.files[0].name : "Seleccionar imagen del hospital"
            }

            // Mostrar vista previa de la imagen
            const file = e.target.files[0]
            const preview = document.getElementById("hospital-imagen-preview")
            if (file && preview) {
            const reader = new FileReader()
            reader.onload = (e) => {
                preview.src = e.target.result
                preview.style.display = "block"
            }
            reader.readAsDataURL(file)
            }
        })
        }

        // Inicializar dependencias de especialidad -> médicos
        this.initializeEspecialidadMedicoFilters()
    }

    // Inicializar filtros de especialidad -> médicos
    initializeEspecialidadMedicoFilters() {
        // Para historiales médicos
        const historialesEspecialidadSelect = document.getElementById("historiales-especialidad_id")
        if (historialesEspecialidadSelect) {
        historialesEspecialidadSelect.addEventListener("change", (e) => {
            this.filterMedicosByEspecialidad("historiales-medico_id", e.target.value)
        })
        }

        // Para turnos
        const turnosEspecialidadSelect = document.getElementById("turnos-especialidad_id")
        if (turnosEspecialidadSelect) {
        turnosEspecialidadSelect.addEventListener("change", (e) => {
            this.filterMedicosByEspecialidad("turnos-medico_id", e.target.value)
        })
        }
    }

    // Filtrar médicos por especialidad
    filterMedicosByEspecialidad(medicoSelectId, especialidadId) {
        const medicoSelect = document.getElementById(medicoSelectId)
        if (!medicoSelect) return

        console.log(`Filtrando médicos para especialidad ${especialidadId}`)

        // Limpiar el select de médicos
        medicoSelect.innerHTML = '<option value="">Seleccionar Médico</option>'

        if (!especialidadId) {
        console.log("No hay especialidad seleccionada")
        return
        }

        // Filtrar médicos por especialidad
        const medicosFiltrados = this.data.medicos.filter((medico) => medico.especialidad_id == especialidadId)

        console.log(`Médicos filtrados:`, medicosFiltrados)

        // Agregar médicos filtrados al select
        medicosFiltrados.forEach((medico) => {
        const option = document.createElement("option")
        option.value = medico.id_medico

        // Buscar el nombre del usuario asociado al médico
        const usuario = this.data.usuarios.find((u) => (u.id_usuario || u.id) == medico.usuario_id)
        option.textContent = usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ID: ${medico.usuario_id}`

        medicoSelect.appendChild(option)
        })

        console.log(`Select ${medicoSelectId} actualizado con ${medicosFiltrados.length} médicos`)
    }

    // Manejar envío de formularios
    async handleFormSubmit(table) {
        try {
        // Si es el formulario de usuarios, especialidades, habitaciones o hospital, usamos FormData para manejar la subida de archivos
        if (table === "usuarios" || table === "especialidades" || table === "habitaciones" || table === "hospital") {
            const id = document.getElementById(`${table}-id`).value
            const formElement = document.getElementById(`${table}-form`)
            const formData = new FormData(formElement)

            if (id) {
            await this.updateRecordWithFile(table, id, formData)
            } else {
            await this.createRecordWithFile(table, formData)
            }
        } else {
            const formData = this.getFormData(table)
            const id = document.getElementById(`${table}-id`).value

            if (id) {
            await this.updateRecord(table, id, formData)
            } else {
            await this.createRecord(table, formData)
            }
        }

        this.clearForm(table)
        await this.loadTableData(table)
        this.updateDashboard()
        } catch (error) {
        console.error("Form submit error:", error)
        }
    }

    // Obtener datos del formulario
    getFormData(table) {
        const data = {}
        const form = document.getElementById(`${table}-form`)
        const inputs = form.querySelectorAll("input, select, textarea")

        inputs.forEach((input) => {
        if (input.type !== "hidden" && input.id && input.type !== "file") {
            const fieldName = input.id.replace(`${table}-`, "")
            data[fieldName] = input.value
        }
        })

        return data
    }

    // Crear nuevo registro
    async createRecord(table, data) {
        try {
        const tableKey = this.getTableKey(table)
        const endpoint = this.endpoints[tableKey]

        const result = await this.post(endpoint, data)

        this.showMessage("success", "Registro creado exitosamente")

        // Recargar datos de la tabla específica
        await this.loadSingleTableData(tableKey)
        // Recargar todos los datos relacionados para actualizar las referencias
        await this.loadAllData()
        } catch (error) {
        this.showMessage("error", "Error al crear el registro")
        console.error("Create record error:", error)
        }
    }

    // Crear nuevo registro con archivo (para usuarios, especialidades, habitaciones y hospital)
    async createRecordWithFile(table, formData) {
        try {
        const tableKey = this.getTableKey(table)
        const endpoint = this.endpoints[tableKey]

        // Depuración para ver qué se está enviando
        console.log(`Enviando datos a ${endpoint} (CREAR):`, {
            method: "POST",
            formData: Array.from(formData.entries()),
        })

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
            console.error("Error en la respuesta:", errorData)
            throw new Error(`HTTP error! status: ${response.status}, mensaje: ${errorData.error || "Error desconocido"}`)
        }

        const result = await response.json()
        console.log(`Respuesta del servidor (CREAR ${table}):`, result)
        this.showMessage("success", "Registro creado exitosamente")

        // Recargar datos de la tabla específica
        await this.loadSingleTableData(tableKey)
        // Recargar todos los datos relacionados para actualizar las referencias
        await this.loadAllData()
        } catch (error) {
        this.showMessage("error", `Error al crear el registro: ${error.message}`)
        console.error("Create record with file error:", error)
        }
    }

    // Actualizar registro existente
    async updateRecord(table, id, data) {
        try {
        const tableKey = this.getTableKey(table)
        const endpoint = `${this.endpoints[tableKey]}/${id}`

        const result = await this.put(endpoint, data)

        this.showMessage("success", "Registro actualizado exitosamente")

        // Recargar datos de la tabla específica
        await this.loadSingleTableData(tableKey)
        // Recargar todos los datos relacionados para actualizar las referencias
        await this.loadAllData()
        } catch (error) {
        this.showMessage("error", "Error al actualizar el registro")
        console.error("Update record error:", error)
        }
    }

    // Actualizar registro con archivo (para usuarios, especialidades, habitaciones y hospital)
    async updateRecordWithFile(table, id, formData) {
        try {
        const tableKey = this.getTableKey(table)
        const endpoint = `${this.endpoints[tableKey]}/${id}`

        // Depuración para ver qué se está enviando
        console.log(`Enviando datos a ${endpoint}:`, {
            method: "PUT",
            formData: Array.from(formData.entries()),
        })

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            body: formData,
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Error en la respuesta:", errorData)
            throw new Error(`HTTP error! status: ${response.status}, mensaje: ${errorData.error || "Error desconocido"}`)
        }

        const result = await response.json()
        this.showMessage("success", "Registro actualizado exitosamente")

        // Recargar datos de la tabla específica
        await this.loadSingleTableData(tableKey)
        // Recargar todos los datos relacionados para actualizar las referencias
        await this.loadAllData()
        } catch (error) {
        this.showMessage("error", `Error al actualizar el registro: ${error.message}`)
        console.error("Update record with file error:", error)
        }
    }

    // Eliminar registro
    async deleteRecord(table, id) {
        if (!confirm("¿Está seguro de que desea eliminar este registro?")) {
        return
        }

        try {
        const tableKey = this.getTableKey(table)
        const endpoint = `${this.endpoints[tableKey]}/${id}`

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
        })

        const data = await response.json()

        if (!response.ok) {
            // Si hay un error de dependencias, mostrar un mensaje detallado
            if (response.status === 400 && data.dependencies) {
            this.showMessage("error", data.error, data.dependencies)
            } else {
            this.showMessage("error", data.error || "Error al eliminar el registro")
            }
            return
        }

        this.showMessage("success", "Registro eliminado exitosamente")

        // Recargar datos de la tabla específica
        await this.loadSingleTableData(tableKey)
        this.loadTable(table)
        this.updateDashboard()
        } catch (error) {
        this.showMessage("error", "Error al eliminar el registro")
        console.error("Delete record error:", error)
        }
    }

    // Cargar datos de una tabla específica desde el backend
    async loadSingleTableData(tableKey) {
        try {
        const data = await this.get(this.endpoints[tableKey])
        this.data[tableKey] = Array.isArray(data) ? data : []
        } catch (error) {
        console.error(`Error loading ${tableKey}:`, error)
        this.data[tableKey] = []
        }
    }

    // Editar registro
    editRecord(table, id) {
        const tableKey = this.getTableKey(table)
        const record = this.data[tableKey].find((item) => {
        // Identificar el campo ID correcto según la tabla
        const itemId =
            item.id_usuario ||
            item.id_especialidad ||
            item.id_habitacion ||
            item.id_HistMedic ||
            item.id_medico ||
            item.id_OS ||
            item.id_rol ||
            item.id_turno ||
            item.id_hospital || // NUEVO
            item.id
        return itemId == id
        })

        if (record) {
        this.populateForm(table, record)

        // Desplazar la vista al formulario
        const formElement = document.getElementById(`${table}-form`)
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" })
        }
        } else {
        this.showMessage("error", `No se encontró el registro con ID ${id}`)
        }
    }

    // Poblar formulario con datos
    populateForm(table, data) {
        console.log(`=== POBLANDO FORMULARIO ${table.toUpperCase()} ===`)
        console.log("Datos recibidos:", data)

        document.getElementById(`${table}-id`).value =
        data.id_usuario ||
        data.id_especialidad ||
        data.id_habitacion ||
        data.id_HistMedic ||
        data.id_medico ||
        data.id_OS ||
        data.id_rol ||
        data.id_turno ||
        data.id_hospital || // NUEVO
        data.id

        // Mapeo especial para turnos (usar los IDs originales, no los nombres)
        if (table === "turnos") {
        // Usar los IDs originales que vienen del backend
        const fieldsToPopulate = {
            "turnos-usuario_id": data.usuario_id,
            "turnos-medico_id": data.medico_id,
            "turnos-especialidad_id": data.especialidad_id,
            "turnos-obra_social_id": data.obra_social_id,
            "turnos-habitacion_id": data.habitacion_id,
            "turnos-fecha_turno": data.fecha_turno,
        }

        Object.keys(fieldsToPopulate).forEach((fieldId) => {
            const input = document.getElementById(fieldId)
            if (input) {
            input.value = fieldsToPopulate[fieldId] || ""
            console.log(`Campo ${fieldId} poblado con:`, fieldsToPopulate[fieldId])
            }
        })
        } else {
        // Para otras tablas, usar el método original
        Object.keys(data).forEach((key) => {
            const input = document.getElementById(`${table}-${key}`)
            if (input && input.type !== "file") {
            input.value = data[key] || ""
            }
        })
        }

        // Si hay una foto de perfil y estamos en la tabla de usuarios, mostrar la miniatura
        if (table === "usuarios" && data.foto_perfil) {
        const fotoPreview = document.getElementById("foto-preview")
        if (fotoPreview) {
            fotoPreview.src = `/js/node/uploads/usuarios/${data.foto_perfil}`
            fotoPreview.style.display = "block"
        }
        }

        // Si hay una imagen y estamos en especialidades o habitaciones, mostrar la miniatura
        if (table === "especialidades" && data.imagen_especialidad) {
        const imagenPreview = document.getElementById("especialidades-imagen-preview")
        if (imagenPreview) {
            imagenPreview.src = `/js/node/uploads/especialidades/${data.imagen_especialidad}`
            imagenPreview.style.display = "block"
        }
        }

        if (table === "habitaciones" && data.imagen_habitacion) {
        const imagenPreview = document.getElementById("habitaciones-imagen-preview")
        if (imagenPreview) {
            imagenPreview.src = `/js/node/uploads/habitaciones/${data.imagen_habitacion}`
            imagenPreview.style.display = "block"
        }
        }

        // NUEVO: Si hay una imagen y estamos en hospital, mostrar la miniatura
        if (table === "hospital" && data.imagen_hospital) {
        const imagenPreview = document.getElementById("hospital-imagen-preview")
        if (imagenPreview) {
            imagenPreview.src = `/js/node/uploads/hospital/${data.imagen_hospital}`
            imagenPreview.style.display = "block"
        }
        }

        // Si estamos editando un historial o turno, actualizar el filtro de médicos
        if (table === "historiales" && data.especialidad_id) {
        setTimeout(() => {
            this.filterMedicosByEspecialidad("historiales-medico_id", data.especialidad_id)
            // Después de filtrar, seleccionar el médico correcto
            setTimeout(() => {
            const medicoSelect = document.getElementById("historiales-medico_id")
            if (medicoSelect && data.medico_id) {
                medicoSelect.value = data.medico_id
            }
            }, 100)
        }, 100)
        }

        if (table === "turnos" && data.especialidad_id) {
        setTimeout(() => {
            this.filterMedicosByEspecialidad("turnos-medico_id", data.especialidad_id)
            // Después de filtrar, seleccionar el médico correcto
            setTimeout(() => {
            const medicoSelect = document.getElementById("turnos-medico_id")
            if (medicoSelect && data.medico_id) {
                medicoSelect.value = data.medico_id
                console.log(`Médico seleccionado: ${data.medico_id}`)
            }
            }, 100)
        }, 100)
        }
    }

    // Limpiar formulario
    clearForm(table) {
        const form = document.getElementById(`${table}-form`)
        if (form) {
        form.reset()
        document.getElementById(`${table}-id`).value = ""

        // Limpiar la vista previa de la foto si existe
        if (table === "usuarios") {
            const fotoPreview = document.getElementById("foto-preview")
            if (fotoPreview) {
            fotoPreview.src = ""
            fotoPreview.style.display = "none"
            }

            const fileLabel = document.getElementById("usuarios-foto-label")
            if (fileLabel) {
            fileLabel.textContent = "Seleccionar archivo"
            }
        }

        // Limpiar la vista previa de la imagen si existe
        if (table === "especialidades") {
            const imagenPreview = document.getElementById("especialidades-imagen-preview")
            if (imagenPreview) {
            imagenPreview.src = ""
            imagenPreview.style.display = "none"
            }

            const fileLabel = document.getElementById("especialidades-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = "Seleccionar imagen"
            }
        }

        if (table === "habitaciones") {
            const imagenPreview = document.getElementById("habitaciones-imagen-preview")
            if (imagenPreview) {
            imagenPreview.src = ""
            imagenPreview.style.display = "none"
            }

            const fileLabel = document.getElementById("habitaciones-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = "Seleccionar imagen"
            }
        }

        // NUEVO: Limpiar la vista previa de la imagen del hospital
        if (table === "hospital") {
            const imagenPreview = document.getElementById("hospital-imagen-preview")
            if (imagenPreview) {
            imagenPreview.src = ""
            imagenPreview.style.display = "none"
            }

            const fileLabel = document.getElementById("hospital-imagen-label")
            if (fileLabel) {
            fileLabel.textContent = "Seleccionar imagen del hospital"
            }
        }
        }

        // Limpiar filtros de médicos cuando se limpia el formulario
        if (table === "historiales") {
        const medicoSelect = document.getElementById("historiales-medico_id")
        if (medicoSelect) {
            medicoSelect.innerHTML = '<option value="">Primero seleccione una especialidad</option>'
        }
        }

        if (table === "turnos") {
        const medicoSelect = document.getElementById("turnos-medico_id")
        if (medicoSelect) {
            medicoSelect.innerHTML = '<option value="">Primero seleccione una especialidad</option>'
        }
        }
    }

    // Cargar todas las tablas
    loadAllTables() {
        const tables = [
        "usuarios",
        "especialidades",
        "habitaciones",
        "historiales",
        "medicos",
        "obras-sociales",
        "roles",
        "turnos",
        "hospital", // NUEVO
        ]
        tables.forEach((table) => this.loadTable(table))
        this.loadSelectOptions()
    }

    // Cargar datos específicos de tabla
    async loadTableData(tabId) {
        if (tabId !== "dashboard") {
        const tableKey = this.getTableKey(tabId)
        await this.loadSingleTableData(tableKey)
        this.loadTable(tabId)
        this.loadSelectOptions()
        }
    }

    // Cargar tabla específica
    loadTable(table) {
        const tableKey = this.getTableKey(table)
        const tbody = document.getElementById(`${table}-tbody`) || document.getElementById(`${table}-tbody-new`)

        if (!tbody) return

        tbody.innerHTML = ""

        if (this.data[tableKey].length === 0) {
        tbody.innerHTML = `<tr><td colspan="100%" class="empty-state">No hay registros disponibles</td></tr>`
        return
        }

        this.data[tableKey].forEach((item) => {
        const row = this.createTableRow(table, item)
        tbody.appendChild(row)
        })
    }

    // Crear fila de tabla
    createTableRow(table, item) {
        const row = document.createElement("tr")

        switch (table) {
        case "usuarios":
            row.innerHTML = `
                        <td>${item.id_usuario || item.id}</td>
                        <td>${item.nombre || ""}</td>
                        <td>${item.apellido || ""}</td>
                        <td>${item.dni || ""}</td>
                        <td>${item.email || ""}</td>
                        <td>${item.telefono || ""}</td>
                        <td>${this.getRoleName(item.rol_id) || ""}</td>
                        <td>${item.foto_perfil ? `<img src="/js/node/uploads/usuarios/${item.foto_perfil}" alt="Foto de perfil" class="profile-thumbnail">` : ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('usuarios', ${item.id_usuario || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('usuarios', ${item.id_usuario || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "especialidades":
            row.innerHTML = `
                        <td>${item.id_especialidad || item.id}</td>
                        <td>${item.nombre || ""}</td>
                        <td>${item.imagen_especialidad ? `<img src="/js/node/uploads/especialidades/${item.imagen_especialidad}" alt="Imagen especialidad" class="profile-thumbnail">` : ""}</td>
                        <td>${item.descripcion || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('especialidades', ${item.id_especialidad || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('especialidades', ${item.id_especialidad || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "habitaciones":
            row.innerHTML = `
                        <td>${item.id_habitacion || item.id}</td>
                        <td>${item.numero || ""}</td>
                        <td>${item.tipo || ""}</td>
                        <td>${item.piso || ""}</td>
                        <td>${item.estado || ""}</td>
                        <td>${item.imagen_habitacion ? `<img src="/js/node/uploads/habitaciones/${item.imagen_habitacion}" alt="Imagen habitación" class="profile-thumbnail">` : ""}</td>
                        <td>${item.descripcion || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('habitaciones', ${item.id_habitacion || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('habitaciones', ${item.id_habitacion || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "historiales":
            row.innerHTML = `
                        <td>${item.id_HistMedic || item.id}</td>
                        <td>${item.nombre_paciente || this.getUserName(item.usuario_id)}</td>
                        <td>${item.fecha || ""}</td>
                        <td>${item.nombre_especialidad || this.getEspecialidadName(item.especialidad_id)}</td>
                        <td>${item.nombre_medico || this.getMedicoName(item.medico_id)}</td>
                        <td>${item.numero_habitacion || this.getHabitacionNumber(item.habitacion_id)}</td>
                        <td>${item.diagnostico || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('historiales', ${item.id_HistMedic || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('historiales', ${item.id_HistMedic || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "medicos":
            row.innerHTML = `
                        <td>${item.id_medico || item.id}</td>
                        <td>${this.getUserName(item.usuario_id) || ""}</td>
                        <td>${item.estado || ""}</td>
                        <td>${this.getEspecialidadName(item.especialidad_id) || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('medicos', ${item.id_medico || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('medicos', ${item.id_medico || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "obras-sociales":
            row.innerHTML = `
                        <td>${item.id_OS || item.id}</td>
                        <td>${item.nombre || ""}</td>
                        <td>${item.codigo || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('obras-sociales', ${item.id_OS || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('obras-sociales', ${item.id_OS || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "roles":
            row.innerHTML = `
                        <td>${item.id_rol || item.id}</td>
                        <td>${item.nombre || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('roles', ${item.id_rol || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('roles', ${item.id_rol || item.id})">Eliminar</button>
                        </td>
                        `
            break
        case "turnos":
            row.innerHTML = `
                        <td>${item.id_turno || item.id}</td>
                        <td>${item.nombre_paciente && item.apellido_paciente ? `${item.nombre_paciente} ${item.apellido_paciente}` : this.getUserName(item.usuario_id)}</td>
                        <td>${item.nombre_medico && item.apellido_medico ? `${item.nombre_medico} ${item.apellido_medico}` : this.getMedicoName(item.medico_id)}</td>
                        <td>${item.especialidad || this.getEspecialidadName(item.especialidad_id)}</td>
                        <td>${item.obra_social || this.getObraSocialName(item.obra_social_id)}</td>
                        <td>${item.habitacion || this.getHabitacionNumber(item.habitacion_id)}</td>
                        <td>${item.fecha_turno || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('turnos', ${item.id_turno || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('turnos', ${item.id_turno || item.id})">Eliminar</button>
                        </td>
                        `
            break
        // NUEVO: Caso para hospital
        case "hospital":
            row.innerHTML = `
                        <td>${item.id_hospital || item.id}</td>
                        <td>${item.imagen_hospital ? `<img src="/js/node/uploads/hospital/${item.imagen_hospital}" alt="Imagen hospital" class="profile-thumbnail">` : ""}</td>
                        <td>${item.descripcion || ""}</td>
                        <td class="action-buttons">
                            <button class="btn-edit" onclick="hospitalCRUD.editRecord('hospital', ${item.id_hospital || item.id})">Editar</button>
                            <button class="btn-delete" onclick="hospitalCRUD.deleteRecord('hospital', ${item.id_hospital || item.id})">Eliminar</button>
                        </td>
                        `
            break
        }

        return row
    }

    // Cargar opciones de select
    loadSelectOptions() {
        console.log("Cargando opciones de select...") // Debug
        console.log("Roles disponibles:", this.data.roles) // Debug

        // Cargar roles en usuarios
        this.loadSelectData("usuarios-rol_id", this.data.roles, "id_rol", "nombre")

        // Cargar USUARIOS MÉDICOS en médicos (en lugar de todos los usuarios)
        this.loadSelectData("medicos-usuario_id", this.data.usuariosMedicos, "id_usuario", "nombre", "apellido")

        // Cargar todos los usuarios en historiales y turnos
        this.loadSelectData("historiales-usuario_id", this.data.usuarios, "id_usuario", "nombre", "apellido")
        this.loadSelectData("turnos-usuario_id", this.data.usuarios, "id_usuario", "nombre", "apellido")

        // Cargar especialidades
        this.loadSelectData("historiales-especialidad_id", this.data.especialidades, "id_especialidad", "nombre")
        this.loadSelectData("medicos-especialidad_id", this.data.especialidades, "id_especialidad", "nombre")
        this.loadSelectData("turnos-especialidad_id", this.data.especialidades, "id_especialidad", "nombre")

        // Cargar médicos - INICIALMENTE VACÍO para historiales y turnos
        const historialesMedicoSelect = document.getElementById("historiales-medico_id")
        if (historialesMedicoSelect) {
        historialesMedicoSelect.innerHTML = '<option value="">Primero seleccione una especialidad</option>'
        }

        const turnosMedicoSelect = document.getElementById("turnos-medico_id")
        if (turnosMedicoSelect) {
        turnosMedicoSelect.innerHTML = '<option value="">Primero seleccione una especialidad</option>'
        }

        // Cargar habitaciones
        this.loadSelectData("historiales-habitacion_id", this.data.habitaciones, "id_habitacion", "numero")
        this.loadSelectData("turnos-habitacion_id", this.data.habitaciones, "id_habitacion", "numero")

        // Cargar obras sociales
        this.loadSelectData("turnos-obra_social_id", this.data.obrasSociales, "id_OS", "nombre")
    }

    // Cargar datos en select
    loadSelectData(selectId, data, valueField, textField, textField2 = null) {
        const select = document.getElementById(selectId)
        if (!select) {
        console.log(`Select con ID ${selectId} no encontrado`) // Debug
        return
        }

        console.log(`Cargando datos en select ${selectId}:`, data) // Debug

        const firstOption = select.querySelector('option[value=""]')
        select.innerHTML = ""
        if (firstOption) {
        select.appendChild(firstOption)
        }

        if (!data || data.length === 0) {
        console.log(`No hay datos para cargar en ${selectId}`) // Debug
        return
        }

        data.forEach((item) => {
        const option = document.createElement("option")
        option.value = item[valueField]

        if (textField2) {
            option.textContent = `${item[textField]} ${item[textField2]}`
        } else if (textField === "usuario_id") {
            const usuario = this.data.usuarios.find((u) => (u.id_usuario || u.id) == item.usuario_id)
            option.textContent = usuario ? `${usuario.nombre} ${usuario.apellido}` : "Usuario no encontrado"
        } else {
            option.textContent = item[textField]
        }

        select.appendChild(option)
        })

        console.log(`Select ${selectId} cargado con ${data.length} opciones`) // Debug
    }

    // Métodos auxiliares para obtener nombres - MEJORADOS
    getRoleName(rolId) {
        if (!rolId) return ""
        const rol = this.data.roles.find((r) => (r.id_rol || r.id) == rolId)
        return rol ? rol.nombre : `Rol ID: ${rolId}`
    }

    getUserName(userId) {
        if (!userId) return ""
        const usuario = this.data.usuarios.find((u) => (u.id_usuario || u.id) == userId)
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ID: ${userId}`
    }

    getEspecialidadName(especialidadId) {
        if (!especialidadId) return ""
        const especialidad = this.data.especialidades.find((e) => (e.id_especialidad || e.id) == especialidadId)
        return especialidad ? especialidad.nombre : `Especialidad ID: ${especialidadId}`
    }

    getMedicoName(medicoId) {
        if (!medicoId) return ""
        const medico = this.data.medicos.find((m) => (m.id_medico || m.id) == medicoId)
        if (medico) {
        const usuario = this.data.usuarios.find((u) => (u.id_usuario || u.id) == medico.usuario_id)
        return usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ID: ${medico.usuario_id}`
        }
        return `Médico ID: ${medicoId}`
    }

    getHabitacionNumber(habitacionId) {
        if (!habitacionId) return ""
        const habitacion = this.data.habitaciones.find((h) => (h.id_habitacion || h.id) == habitacionId)
        return habitacion ? habitacion.numero : `Habitación ID: ${habitacionId}`
    }

    getObraSocialName(obraSocialId) {
        if (!obraSocialId) return ""
        const obraSocial = this.data.obrasSociales.find((os) => (os.id_OS || os.id) == obraSocialId)
        return obraSocial ? obraSocial.nombre : `Obra Social ID: ${obraSocialId}`
    }

    // Actualizar dashboard - CORREGIDO PARA EVITAR ERRORES
    updateDashboard() {
        // Verificar que los elementos existan antes de actualizar
        const totalUsuariosEl = document.getElementById("total-usuarios")
        const totalMedicosEl = document.getElementById("total-medicos")
        const totalTurnosPendientesEl = document.getElementById("total-turnos-pendientes")
        const totalHabitacionesDisponiblesEl = document.getElementById("total-habitaciones-disponibles")

        if (totalUsuariosEl) {
        totalUsuariosEl.textContent = this.data.usuarios.length
        }

        if (totalMedicosEl) {
        totalMedicosEl.textContent = this.data.medicos.length
        }

        if (totalTurnosPendientesEl) {
        totalTurnosPendientesEl.textContent = this.data.turnos.length
        }

        if (totalHabitacionesDisponiblesEl) {
        // Como ya no existe el campo disponibilidad, mostrar total de habitaciones
        const totalHabitaciones = this.data.habitaciones.length
        totalHabitacionesDisponiblesEl.textContent = totalHabitaciones
        }

        this.updateTurnosStatus()
    }

    // Actualizar estado de turnos (funcionalidad existente) - CORREGIDO
    updateTurnosStatus() {
        // Mantener compatibilidad con el sistema existente de turnos
        const turnosLegacy = JSON.parse(localStorage.getItem("turnos")) || []

        let porAtender = 0
        let enAtencion = 0
        let atendidos = 0

        turnosLegacy.forEach((turno) => {
        switch (turno.estado) {
            case "pendiente":
            porAtender++
            break
            case "en_atencion":
            enAtencion++
            break
            case "atendido":
            atendidos++
            break
        }
        })

        // Verificar que los elementos existan antes de actualizar
        const porAtenderEl = document.getElementById("porAtender")
        const enAtencionEl = document.getElementById("enAtencion")
        const atendidosEl = document.getElementById("atendidos")

        if (porAtenderEl) {
        porAtenderEl.textContent = porAtender
        }

        if (enAtencionEl) {
        enAtencionEl.textContent = enAtencion
        }

        if (atendidosEl) {
        atendidosEl.textContent = atendidos
        }
    }

    // Utilidades
    getTableKey(table) {
        const keyMap = {
        usuarios: "usuarios",
        especialidades: "especialidades",
        habitaciones: "habitaciones",
        historiales: "historiales",
        medicos: "medicos",
        "obras-sociales": "obrasSociales",
        roles: "roles",
        turnos: "turnos",
        hospital: "hospital", // NUEVO
        }
        return keyMap[table] || table
    }

    showMessage(type, text, details = null) {
        // Remover mensajes existentes
        const existingMessages = document.querySelectorAll(".message")
        existingMessages.forEach((msg) => msg.remove())

        // Crear elemento de mensaje
        const message = document.createElement("div")
        message.className = `message ${type}`

        // Si hay detalles, mostrarlos con formato
        if (details) {
        const mainText = document.createElement("p")
        mainText.textContent = text
        mainText.style.fontWeight = "bold"
        mainText.style.marginBottom = "8px"

        message.appendChild(mainText)

        if (typeof details === "string") {
            const detailsText = document.createElement("p")
            detailsText.textContent = details
            message.appendChild(detailsText)
        } else if (typeof details === "object") {
            const detailsList = document.createElement("ul")
            detailsList.style.marginLeft = "20px"
            detailsList.style.fontSize = "0.9em"

            for (const key in details) {
            if (details[key] > 0) {
                const item = document.createElement("li")
                item.textContent = `${key}: ${details[key]}`
                detailsList.appendChild(item)
            }
            }

            message.appendChild(detailsList)
        }
        } else {
        message.textContent = text
        }

        // Insertar al inicio del panel
        const panel = document.getElementById("admin-panel")
        if (panel) {
        panel.insertBefore(message, panel.firstChild)
        }

        // Remover después de 8 segundos (más tiempo para leer los detalles)
        setTimeout(() => {
        if (message.parentNode) {
            message.remove()
        }
        }, 8000)
    }
    }

    // Función global para limpiar formularios
    function clearForm(table) {
    if (typeof hospitalCRUD !== "undefined" && hospitalCRUD) {
        hospitalCRUD.clearForm(table)
    }
    }

    // Inicializar el sistema cuando se carga la página
    let hospitalCRUD

    document.addEventListener("DOMContentLoaded", async () => {
    hospitalCRUD = new HospitalCRUD()

    // Actualizar dashboard cada 30 segundos
    setInterval(() => {
        if (hospitalCRUD) {
        hospitalCRUD.updateDashboard()
        }
    }, 30000)
    })
