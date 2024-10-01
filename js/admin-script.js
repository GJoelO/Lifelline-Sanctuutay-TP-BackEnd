document.addEventListener('DOMContentLoaded', function() {
    const turnosBody = document.getElementById('turnos-body');
    const porAtenderElement = document.getElementById('porAtender');
    const enAtencionElement = document.getElementById('enAtencion');
    const atendidosElement = document.getElementById('atendidos');

    function actualizarTablaEstado(turnos) {
        let porAtender = 0;
        let enAtencion = 0;
        let atendidos = 0;

        turnos.forEach(turno => {
            switch(turno.estado) {
                case 'pendiente':
                    porAtender++;
                    break;
                case 'en_atencion':
                    enAtencion++;
                    break;
                case 'atendido':
                    atendidos++;
                    break;
            }
        });

        porAtenderElement.textContent = porAtender;
        enAtencionElement.textContent = enAtencion;
        atendidosElement.textContent = atendidos;
    }

    function cargarTurnos() {
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        
        console.log('Cargando turnos:', turnos);
    
        turnosBody.innerHTML = '';
    
        if (turnos.length === 0) {
            console.log('No hay turnos para mostrar');
            turnosBody.innerHTML = '<tr><td colspan="8">No hay turnos registrados</td></tr>';
            actualizarTablaEstado([]);
            return;
        }
    
        turnos.forEach((turno, index) => {
            const row = turnosBody.insertRow();
            row.innerHTML = `
                <td>${turno.especialidad}</td>
                <td>${turno.nombre}</td>
                <td>${turno.apellido}</td>
                <td>${turno.dni}</td>
                <td>${turno.email}</td>
                <td>${turno.telefono}</td>
                <td>
                    <select class="estado-select" data-index="${index}">
                        <option value="pendiente" ${turno.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="en_atencion" ${turno.estado === 'en_atencion' ? 'selected' : ''}>En Atención</option>
                        <option value="atendido" ${turno.estado === 'atendido' ? 'selected' : ''}>Atendido</option>
                    </select>
                </td>
                <td>
                    <button class="editar-btn" data-index="${index}">Editar</button>
                    <button class="eliminar-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
        });
    
        console.log('Turnos cargados en la tabla');
        
        actualizarTablaEstado(turnos);
    
        // Agregar event listeners para los botones y selects
        document.querySelectorAll('.estado-select').forEach(select => {
            select.addEventListener('change', cambiarEstado);
        });
    
        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', editarTurno);
        });
    
        document.querySelectorAll('.eliminar-btn').forEach(btn => {
            btn.addEventListener('click', eliminarTurno);
        });
    }

    function cambiarEstado(e) {
        const index = e.target.dataset.index;
        const nuevoEstado = e.target.value;
        const turnos = JSON.parse(localStorage.getItem('turnos'));
        turnos[index].estado = nuevoEstado;
        localStorage.setItem('turnos', JSON.stringify(turnos));
        console.log('Estado cambiado:', index, nuevoEstado);
        cargarTurnos();
    }
    
    function editarTurno(e) {
        const index = e.target.dataset.index;
        const turnos = JSON.parse(localStorage.getItem('turnos'));
        const turno = turnos[index];
        console.log('Editando turno:', turno);
        
        const nuevoNombre = prompt('Nuevo nombre:', turno.nombre);
        const nuevoApellido = prompt('Nuevo apellido:', turno.apellido);
        const nuevoDNI = prompt('Nuevo DNI:', turno.dni);
        const nuevoEmail = prompt('Nuevo email:', turno.email);
        const nuevoTelefono = prompt('Nuevo teléfono:', turno.telefono);

        if (nuevoNombre && nuevoApellido && nuevoDNI && nuevoEmail && nuevoTelefono) {
            turnos[index] = {
                ...turno,
                nombre: nuevoNombre,
                apellido: nuevoApellido,
                dni: nuevoDNI,
                email: nuevoEmail,
                telefono: nuevoTelefono
            };
            localStorage.setItem('turnos', JSON.stringify(turnos));
            cargarTurnos();
        }
    }
    
    function eliminarTurno(e) {
        if (confirm('¿Está seguro de que desea eliminar este turno?')) {
            const index = e.target.dataset.index;
            const turnos = JSON.parse(localStorage.getItem('turnos'));
            turnos.splice(index, 1);
            localStorage.setItem('turnos', JSON.stringify(turnos));
            console.log('Turno eliminado:', index);
            cargarTurnos();
        }
    }

    // Cargar turnos al iniciar la página
    cargarTurnos();

    // Actualizar la tabla cada 30 segundos
    setInterval(cargarTurnos, 30000);

    // Escuchar el evento personalizado 'nuevoTurno'
    window.addEventListener('nuevoTurno', cargarTurnos);

    // Agregar evento al botón de actualizar
    document.getElementById('refresh-btn').addEventListener('click', cargarTurnos);
});