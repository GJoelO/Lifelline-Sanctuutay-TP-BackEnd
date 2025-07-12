    // Variables globales
    let currentUser = null
    let editingContactId = null

    // Inicialización
    document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication()
    setupEventListeners()
    })

    // Verificar autenticación
    async function checkAuthentication() {
    try {
        // Usar el sistema de autenticación existente
        if (window.authSystem) {
        await window.authSystem.checkAuthStatus()

        if (window.authSystem.isAuth()) {
            currentUser = window.authSystem.getUser()
            await loadProfileData()

            // Actualizar también los elementos del header si existen
            updateHeaderUserInfo()
        } else {
            window.location.href = "/login-register"
        }
        } else {
        // Fallback al método original
        const response = await fetch("/auth/verify", {
            method: "GET",
            credentials: "include",
        })

        if (!response.ok) {
            window.location.href = "/login-register"
            return
        }

        const data = await response.json()
        if (data.auth) {
            currentUser = data.user
            await loadProfileData()
        } else {
            window.location.href = "/login-register"
        }
        }
    } catch (error) {
        console.error("Error verificando autenticación:", error)
        window.location.href = "/login-register"
    }
    }

    // Configurar event listeners
    function setupEventListeners() {
    // Datos personales
    document.getElementById("btnEditPersonal").addEventListener("click", () => toggleEdit("personal"))
    document.getElementById("btnCancelPersonal").addEventListener("click", () => cancelEdit("personal"))
    document.getElementById("formPersonal").addEventListener("submit", savePersonalData)
    document
        .getElementById("btnChangePhoto")
        .addEventListener("click", () => document.getElementById("inputPhoto").click())
    document.getElementById("inputPhoto").addEventListener("change", handlePhotoChange)

    // Domicilio
    document.getElementById("btnEditDomicilio").addEventListener("click", () => toggleEdit("domicilio"))
    document.getElementById("btnCancelDomicilio").addEventListener("click", () => cancelEdit("domicilio"))
    document.getElementById("formDomicilio").addEventListener("submit", saveDomicilioData)

    // Contactos
    document.getElementById("btnAddContacto").addEventListener("click", () => openContactModal())
    document.getElementById("formContacto").addEventListener("submit", saveContacto)

    // Modal
    document.querySelector(".close").addEventListener("click", closeModal)
    document.getElementById("modalContacto").addEventListener("click", function (e) {
        if (e.target === this) closeModal()
    })
    }

    // Cargar datos del perfil
    async function loadProfileData() {
    try {
        await Promise.all([
        loadPersonalData(),
        loadGeneros(),
        loadDomicilioData(),
        loadContactosData(),
        loadHistorialData(),
        ])
    } catch (error) {
        console.error("Error cargando datos del perfil:", error)
        showMessage("Error cargando los datos del perfil", "error")
    }
    }

    // Cargar datos personales
    async function loadPersonalData() {
    try {
        const response = await fetch("/usuario/perfil", {
        credentials: "include",
        })

        if (response.ok) {
        const data = await response.json()

        // Llenar campos básicos del usuario
        document.getElementById("nombre").value = currentUser.nombre || ""
        document.getElementById("apellido").value = currentUser.apellido || ""
        document.getElementById("dni").value = currentUser.dni || ""

        // Llenar datos del perfil
        if (data.perfil) {
            document.getElementById("genero").value = data.perfil.genero_id || ""
            document.getElementById("cuil").value = data.perfil.cuil || ""
        }

        // Cargar foto de perfil
        if (currentUser.foto_perfil) {
            document.getElementById("profilePhoto").src = `/js/node/uploads/usuarios/${currentUser.foto_perfil}`
        }
        }
    } catch (error) {
        console.error("Error cargando datos personales:", error)
    }
    }

    // Cargar géneros
    async function loadGeneros() {
    try {
        const response = await fetch("/generos")
        if (response.ok) {
        const generos = await response.json()
        const select = document.getElementById("genero")

        generos.forEach((genero) => {
            const option = document.createElement("option")
            option.value = genero.id_genero
            option.textContent = genero.descripcion
            select.appendChild(option)
        })
        }
    } catch (error) {
        console.error("Error cargando géneros:", error)
    }
    }

    // Cargar datos de domicilio
    async function loadDomicilioData() {
    try {
        const response = await fetch("/usuario/domicilio", {
        credentials: "include",
        })

        if (response.ok) {
        const data = await response.json()
        if (data.domicilio) {
            document.getElementById("calle").value = data.domicilio.calle || ""
            document.getElementById("numero").value = data.domicilio.numero || ""
            document.getElementById("localidad").value = data.domicilio.localidad || ""
            document.getElementById("barrio").value = data.domicilio.barrio || ""
        }
        }
    } catch (error) {
        console.error("Error cargando datos de domicilio:", error)
    }
    }

    // Cargar datos de contacto
    async function loadContactosData() {
    try {
        const response = await fetch("/usuario/contacto", {
        credentials: "include",
        })

        if (response.ok) {
        const contactos = await response.json()
        renderContactosTable(contactos)
        }
    } catch (error) {
        console.error("Error cargando contactos:", error)
    }
    }

    // Cargar historial médico
    async function loadHistorialData() {
    try {
        const response = await fetch("/usuario/historial", {
        credentials: "include",
        })

        if (response.ok) {
        const historial = await response.json()
        renderHistorialTable(historial)
        }
    } catch (error) {
        console.error("Error cargando historial médico:", error)
    }
    }

    // Renderizar tabla de contactos
    function renderContactosTable(contactos) {
    const tbody = document.getElementById("contactTableBody")
    const noContactsMessage = document.getElementById("noContactsMessage")

    tbody.innerHTML = ""

    if (contactos.length === 0) {
        noContactsMessage.style.display = "block"
        return
    }

    noContactsMessage.style.display = "none"

    contactos.forEach((contacto) => {
        const row = document.createElement("tr")
        row.innerHTML = `
        <td>${contacto.tipo}</td>
        <td>${contacto.contacto}</td>
        <td class="actions-column">
            <button class="action-btn edit" onclick="editContacto(${contacto.id_contacto})" title="Editar">
            <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteContacto(${contacto.id_contacto})" title="Eliminar">
            <i class="fas fa-times"></i>
            </button>
        </td>
        `
        tbody.appendChild(row)
    })
    }

    // Renderizar tabla de historial médico
    function renderHistorialTable(historial) {
    const tbody = document.getElementById("studiesTableBody")
    const noStudiesMessage = document.getElementById("noStudiesMessage")

    tbody.innerHTML = ""

    if (historial.length === 0) {
        noStudiesMessage.style.display = "block"
        return
    }

    noStudiesMessage.style.display = "none"

    historial.forEach((registro) => {
        const row = document.createElement("tr")
        const fecha = new Date(registro.fecha).toLocaleDateString("es-ES")
        row.innerHTML = `
        <td>${fecha}</td>
        <td>${registro.diagnostico || "-"}</td>
        <td>${registro.tratamiento || "-"}</td>
        <td>Dr. ${registro.medico_nombre} ${registro.medico_apellido}</td>
        <td>${registro.especialidad_nombre || "-"}</td>
        `
        tbody.appendChild(row)
    })
    }

    // Toggle edit mode
    function toggleEdit(section) {
    const form = document.getElementById(`form${section.charAt(0).toUpperCase() + section.slice(1)}`)
    const inputs = form.querySelectorAll("input:not([readonly]), select")
    const actions = form.querySelector(".form-actions")
    const editBtn = document.getElementById(`btnEdit${section.charAt(0).toUpperCase() + section.slice(1)}`)
    const editIcon = document.getElementById(`editIcon${section.charAt(0).toUpperCase() + section.slice(1)}`)

    inputs.forEach((input) => {
        input.disabled = false
    })

    if (section === "personal") {
        document.getElementById("btnChangePhoto").disabled = false
    }

    actions.style.display = "flex"
    editBtn.style.display = "none"
    if (editIcon) editIcon.style.display = "inline"
    }

    // Cancel edit
    function cancelEdit(section) {
    const form = document.getElementById(`form${section.charAt(0).toUpperCase() + section.slice(1)}`)
    const inputs = form.querySelectorAll("input:not([readonly]), select")
    const actions = form.querySelector(".form-actions")
    const editBtn = document.getElementById(`btnEdit${section.charAt(0).toUpperCase() + section.slice(1)}`)
    const editIcon = document.getElementById(`editIcon${section.charAt(0).toUpperCase() + section.slice(1)}`)

    inputs.forEach((input) => {
        input.disabled = true
    })

    if (section === "personal") {
        document.getElementById("btnChangePhoto").disabled = true
    }

    actions.style.display = "none"
    editBtn.style.display = "flex"
    if (editIcon) editIcon.style.display = "none"

    // Recargar datos originales
    if (section === "personal") {
        loadPersonalData()
    } else if (section === "domicilio") {
        loadDomicilioData()
    }
    }

    // Guardar datos personales
    async function savePersonalData(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append("nombre", document.getElementById("nombre").value)
    formData.append("apellido", document.getElementById("apellido").value)
    formData.append("genero_id", document.getElementById("genero").value)
    formData.append("cuil", document.getElementById("cuil").value)

    const photoInput = document.getElementById("inputPhoto")
    if (photoInput.files[0]) {
        formData.append("foto_perfil", photoInput.files[0])
    }

    try {
        const response = await fetch("/usuario/perfil", {
        method: "PUT",
        credentials: "include",
        body: formData,
        })

        const data = await response.json()

        if (response.ok) {
        showMessage("Datos personales actualizados correctamente", "success")
        cancelEdit("personal")
        // Actualizar foto si se cambió
        if (data.foto_perfil) {
            document.getElementById("profilePhoto").src = `/js/node/uploads/usuarios/${data.foto_perfil}`
        }
        } else {
        showMessage(data.error || "Error al actualizar los datos", "error")
        }
    } catch (error) {
        console.error("Error guardando datos personales:", error)
        showMessage("Error al guardar los datos", "error")
    }
    }

    // Guardar datos de domicilio
    async function saveDomicilioData(e) {
    e.preventDefault()

    const data = {
        calle: document.getElementById("calle").value,
        numero: document.getElementById("numero").value,
        localidad: document.getElementById("localidad").value,
        barrio: document.getElementById("barrio").value,
    }

    try {
        const response = await fetch("/usuario/domicilio/actualizar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
        })

        const result = await response.json()

        if (response.ok) {
        showMessage("Domicilio actualizado correctamente", "success")
        cancelEdit("domicilio")
        } else {
        showMessage(result.error || "Error al actualizar el domicilio", "error")
        }
    } catch (error) {
        console.error("Error guardando domicilio:", error)
        showMessage("Error al guardar el domicilio", "error")
    }
    }

    // Manejar cambio de foto
    function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
        document.getElementById("profilePhoto").src = e.target.result
        }
        reader.readAsDataURL(file)
    }
    }

    // Abrir modal de contacto
    function openContactModal(contacto = null) {
    const modal = document.getElementById("modalContacto")
    const title = document.getElementById("modalTitle")
    const form = document.getElementById("formContacto")

    if (contacto) {
        title.textContent = "Editar Contacto"
        document.getElementById("tipoContacto").value = contacto.tipo
        document.getElementById("valorContacto").value = contacto.contacto
        editingContactId = contacto.id_contacto
    } else {
        title.textContent = "Agregar Contacto"
        form.reset()
        editingContactId = null
    }

    modal.style.display = "block"
    }

    // Cerrar modal
    function closeModal() {
    document.getElementById("modalContacto").style.display = "none"
    document.getElementById("formContacto").reset()
    editingContactId = null
    }

    // Guardar contacto
    async function saveContacto(e) {
    e.preventDefault()

    const data = {
        tipo: document.getElementById("tipoContacto").value,
        contacto: document.getElementById("valorContacto").value,
    }

    try {
        const url = editingContactId ? `/usuario/contacto/${editingContactId}` : "/usuario/contacto"
        const method = editingContactId ? "PUT" : "POST"

        const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
        })

        const result = await response.json()

        if (response.ok) {
        showMessage(
            editingContactId ? "Contacto actualizado correctamente" : "Contacto agregado correctamente",
            "success",
        )
        closeModal()
        loadContactosData()
        } else {
        showMessage(result.error || "Error al guardar el contacto", "error")
        }
    } catch (error) {
        console.error("Error guardando contacto:", error)
        showMessage("Error al guardar el contacto", "error")
    }
    }

    // Editar contacto
    async function editContacto(id) {
    try {
        const response = await fetch(`/usuario/contacto/${id}`, {
        credentials: "include",
        })

        if (response.ok) {
        const contacto = await response.json()
        openContactModal(contacto)
        }
    } catch (error) {
        console.error("Error cargando contacto:", error)
        showMessage("Error al cargar el contacto", "error")
    }
    }

    // Eliminar contacto
    async function deleteContacto(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
        return
    }

    try {
        const response = await fetch(`/usuario/contacto/${id}`, {
        method: "DELETE",
        credentials: "include",
        })

        const result = await response.json()

        if (response.ok) {
        showMessage("Contacto eliminado correctamente", "success")
        loadContactosData()
        } else {
        showMessage(result.error || "Error al eliminar el contacto", "error")
        }
    } catch (error) {
        console.error("Error eliminando contacto:", error)
        showMessage("Error al eliminar el contacto", "error")
    }
    }

    // Mostrar mensajes
    function showMessage(message, type) {
    // Remover mensajes existentes
    const existingMessages = document.querySelectorAll(".error-message, .success-message")
    existingMessages.forEach((msg) => msg.remove())

    const messageDiv = document.createElement("div")
    messageDiv.className = type === "error" ? "error-message" : "success-message"
    messageDiv.textContent = message

    document.querySelector(".profile-container").insertBefore(messageDiv, document.querySelector(".profile-section"))

    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.remove()
    }, 5000)
    }

    // Actualizar información del usuario en el header
    function updateHeaderUserInfo() {
    if (currentUser) {
        const userNameHeader = document.getElementById("userNameHeader")
        const profileImageHeader = document.getElementById("profileImageHeader")

        if (userNameHeader) {
        userNameHeader.textContent = `${currentUser.nombre} ${currentUser.apellido}`
        }

        if (profileImageHeader && currentUser.foto_perfil) {
        profileImageHeader.src = `/js/node/uploads/usuarios/${currentUser.foto_perfil}`
        }
    }
    }
