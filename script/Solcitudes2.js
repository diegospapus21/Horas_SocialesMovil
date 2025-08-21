// Agregar este script al final del body en Solicitudes2.html
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    // Cargar solicitudes desde localStorage
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesComision')) || [];
    
    // Mostrar solicitudes en tarjetas
    function mostrarSolicitudes() {
        // Limpiar tarjetas existentes (excepto el footer)
        const cards = document.querySelectorAll('.applicant-card');
        cards.forEach(card => card.remove());
        
        // Crear tarjetas para cada solicitud
        solicitudes.forEach((solicitud, index) => {
            const card = document.createElement('div');
            card.className = 'applicant-card';
            card.innerHTML = `
                <div class="applicant-name text-center mb-3">${solicitud.nombreCompleto}</div>
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
        const nombre = solicitudes[index].nombreCompleto;
        alert(`Estudiante ${nombre} aceptado`);
        
        // Opcional: mover a lista de aceptados
        // let aceptados = JSON.parse(localStorage.getItem('aceptados')) || [];
        // aceptados.push(solicitudes[index]);
        // localStorage.setItem('aceptados', JSON.stringify(aceptados));
        
        // Eliminar de solicitudes
        solicitudes.splice(index, 1);
        localStorage.setItem('solicitudesComision', JSON.stringify(solicitudes));
        
        // Actualizar vista
        mostrarSolicitudes();
    }
    
    // Función para rechazar solicitud
    function rechazarSolicitud(index) {
        solicitudes.splice(index, 1);
        localStorage.setItem('solicitudesComision', JSON.stringify(solicitudes));
        mostrarSolicitudes();
    }
    
    // Mostrar solicitudes al cargar la página
    mostrarSolicitudes();
});