document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const confirmacion = document.getElementById('confirmacion');
    const solicitudForm = document.getElementById('solicitudForm');
    const emailConfirmacion = document.getElementById('emailConfirmacion');
    const solicitarOtro = document.getElementById('solicitarOtro');

    function showError(inputId, message) {
        const errorElement = document.getElementById(inputId + 'Error');
        errorElement.textContent = message;
    }

    function clearError(inputId) {
        const errorElement = document.getElementById(inputId + 'Error');
        errorElement.textContent = '';
    }

    function validateForm() {
        let isValid = true;

        const especialidad = document.getElementById('especialidad');
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const dni = document.getElementById('dni');
        const provincia = document.getElementById('provincia');
        const localidad = document.getElementById('localidad');
        const email = document.getElementById('email');
        const telefono = document.getElementById('telefono');

        // Validación de Especialidad
        if (especialidad.value === "") {
            showError('especialidad', 'Seleccione una especialidad');
            isValid = false;
        } else {
            clearError('especialidad');
        }

        // Validación de Nombre
        if (nombre.value.trim() === '') {
            showError('nombre', 'El nombre es requerido');
            isValid = false;
        } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{1,25}$/.test(nombre.value)) {
            showError('nombre', 'Ingrese un nombre válido (solo letras, máximo 25 caracteres)');
            isValid = false;
        } else {
            clearError('nombre');
        }

        // Validación de Apellido
        if (apellido.value.trim() === '') {
            showError('apellido', 'El apellido es requerido');
            isValid = false;
        } else if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]{1,25}$/.test(apellido.value)) {
            showError('apellido', 'Ingrese un apellido válido (solo letras, máximo 25 caracteres)');
            isValid = false;
        } else {
            clearError('apellido');
        }

        // Validación de DNI
        if (dni.value.trim() === '') {
            showError('dni', 'El DNI es requerido');
            isValid = false;
        } else if (!/^\d{8}$/.test(dni.value)) {
            showError('dni', 'Ingrese un DNI válido (8 números)');
            isValid = false;
        } else {
            clearError('dni');
        }

        // Validación de Provincia
        if (provincia.value === "") {
            showError('provincia', 'Seleccione una provincia');
            isValid = false;
        } else {
            clearError('provincia');
        }

        // Validación de Localidad
        if (localidad.value.trim() === '') {
            showError('localidad', 'La localidad es requerida');
            isValid = false;
        } else if (!/^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]{1,30}$/.test(localidad.value)) {
            showError('localidad', 'Ingrese una localidad válida (letras y números, máximo 30 caracteres)');
            isValid = false;
        } else {
            clearError('localidad');
        }

        // Validación de Email
        if (email.value.trim() === '') {
            showError('email', 'El correo electrónico es requerido');
            isValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value) || email.value.length > 30) {
            showError('email', 'Ingrese un correo electrónico válido (debe contener @, máximo 30 caracteres)');
            isValid = false;
        } else {
            clearError('email');
        }

        // Validación de Teléfono
        if (telefono.value.trim() === '') {
            showError('telefono', 'El número de teléfono es requerido');
            isValid = false;
        } else if (!/^\d{1,15}$/.test(telefono.value)) {
            showError('telefono', 'Ingrese un número de teléfono válido (solo números, máximo 15 dígitos)');
            isValid = false;
        } else {
            clearError('telefono');
        }

        return isValid;
    }

    solicitudForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData(solicitudForm);
            const formDataObj = Object.fromEntries(formData.entries());

            // Crear el objeto turno
            const turno = {
                ...formDataObj,
                estado: 'pendiente',
                fecha: new Date().toISOString()
            };

            // Guardar el turno en localStorage
            const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
            turnos.push(turno);
            localStorage.setItem('turnos', JSON.stringify(turnos));

            // Disparar un evento personalizado para notificar que se ha agregado un nuevo turno
            window.dispatchEvent(new CustomEvent('nuevoTurno'));

            // Mostrar confirmación
            formulario.style.display = 'none';
            confirmacion.style.display = 'block';
            emailConfirmacion.textContent = turno.email;
        }
    });

    solicitarOtro.addEventListener('click', function() {
        // Volver al formulario
        confirmacion.style.display = 'none';
        formulario.style.display = 'block';
        solicitudForm.reset();
        // Limpiar todos los mensajes de error
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
    });
});