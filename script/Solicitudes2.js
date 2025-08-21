// Agregar este script al final del body en Solicitudes2.html
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    // Crear elementos para notificaciones
    const notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Función para mostrar notificación
    function showNotification(message, isSuccess) {
        notification.textContent = message;
        notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    // Cargar solicitudes desde localStorage
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesComision')) || [];
    let aceptados = JSON.parse(localStorage.getItem('estudiantesAceptados')) || [];
    
    // Mostrar solicitudes en tarjetas
    function mostrarSolicitudes() {
        // Limpiar tarjetas existentes (excepto el footer)
        const cards = document.querySelectorAll('.applicant-card');
        cards.forEach(card => card.remove());
        
        if (solicitudes.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'No hay solicitudes pendientes';
            const footer = document.querySelector('.footer');
            container.insertBefore(emptyMessage, footer);
            return;
        }
        
        // Crear tarjetas para cada solicitud
        solicitudes.forEach((solicitud, index) => {
            const card = document.createElement('div');
            card.className = 'applicant-card';
            
            // Formatear fecha
            const fecha = new Date(solicitud.fechaSolicitud);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            card.innerHTML = `
                <div class="applicant-info">
                    <div class="applicant-name">${solicitud.nombreCompleto}</div>
                    <div class="applicant-details">
                        <span>Carnet: ${solicitud.carnet}</span>
                        <span>Año: ${solicitud.ano}</span>
                        <span>Sección: ${solicitud.seccion}</span>
                    </div>
                    <div class="applicant-date">Solicitado: ${fechaFormateada}</div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-action me-2 aceptar-btn" data-index="${index}">Aceptar</button>
                    <button class="btn btn-action rechazar-btn" data-index="${index}">Rechazar</button>
                </div>
            `;
            
            // Insertar antes del footer
            const footer = document.querySelector('.footer');
            container.insertBefore(card, footer);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.aceptar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                aceptarSolicitud(index);
            });
        });
        
        document.querySelectorAll('.rechazar-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                rechazarSolicitud(index);
            });
        });
    }
    
    // Función para aceptar solicitud
function aceptarSolicitud(index) {
    if (confirm(`¿Está seguro que desea aceptar a ${solicitudes[index].nombreCompleto}?`)) {
        const estudianteAceptado = solicitudes[index];
        estudianteAceptado.fechaAceptacion = new Date().toISOString();
        estudianteAceptado.estado = 'aceptado';
        
        // Agregar a aceptados
        aceptados.push(estudianteAceptado);
        localStorage.setItem('estudiantesAceptados', JSON.stringify(aceptados));
        
        // Eliminar de solicitudes
        solicitudes.splice(index, 1);
        localStorage.setItem('solicitudesComision', JSON.stringify(solicitudes));
        
        // Mostrar notificación
        showNotification(`Estudiante ${estudianteAceptado.nombreCompleto} aceptado`, true);
        
        // Actualizar vista
        mostrarSolicitudes();
    }
}
    
    // Función para rechazar solicitud
    function rechazarSolicitud(index) {
        if (confirm(`¿Está seguro que desea rechazar a ${solicitudes[index].nombreCompleto}?`)) {
            const nombreRechazado = solicitudes[index].nombreCompleto;
            
            // Eliminar de solicitudes
            solicitudes.splice(index, 1);
            localStorage.setItem('solicitudesComision', JSON.stringify(solicitudes));
            
            // Mostrar notificación
            showNotification(`Solicitud de ${nombreRechazado} rechazada`, false);
            
            // Actualizar vista
            mostrarSolicitudes();
        }
    }
    
    // Mostrar solicitudes al cargar la página
    mostrarSolicitudes();
});