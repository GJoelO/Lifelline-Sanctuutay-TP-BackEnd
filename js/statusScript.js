document.addEventListener('DOMContentLoaded', function() {
    function actualizarTablaEstado() {
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        
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

        document.getElementById('porAtender').textContent = porAtender;
        document.getElementById('enAtencion').textContent = enAtencion;
        document.getElementById('atendidos').textContent = atendidos;
    }

    // Actualizar la tabla inmediatamente
    actualizarTablaEstado();

    // Escuchar el evento personalizado 'nuevoTurno'
    window.addEventListener('nuevoTurno', actualizarTablaEstado);

    // Actualizar la tabla cada 5 segundos
    setInterval(actualizarTablaEstado, 5000);

    // Escuchar cambios en localStorage (útil si se modifican los turnos desde otra pestaña)
    window.addEventListener('storage', function(e) {
        if (e.key === 'turnos') {
            actualizarTablaEstado();
        }
    });
});