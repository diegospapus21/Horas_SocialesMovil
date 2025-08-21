// Agregar este script al final del body en inscripcion.html
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
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
    
    // Validación de campos
    function validateForm() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const carnet = document.getElementById('carnet').value.trim();
        const ano = document.getElementById('ano').value.trim();
        const especialidad = document.getElementById('especialidad').value.trim();
        const seccion = document.getElementById('seccion').value.trim();
        
        if (!nombre || !apellido || !carnet || !ano || !especialidad || !seccion) {
            showNotification('Todos los campos son requeridos', false);
            return false;
        }
        
        if (!/^\d+$/.test(carnet)) {
            showNotification('El carnet debe contener solo números', false);
            return false;
        }
        
        return true;
    }
    
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const carnet = document.getElementById('carnet').value.trim();
    const ano = document.getElementById('ano').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();
    const seccion = document.getElementById('seccion').value.trim();
    
    // Crear objeto con los datos
    const solicitud = {
        nombreCompleto: `${nombre} ${apellido}`,
        carnet: carnet,
        ano: ano,
        especialidad: especialidad,
        seccion: seccion,
        fechaSolicitud: new Date().toISOString(),
        estado: 'pendiente'
    };
    
    // Guardar en localStorage
    let solicitudes = JSON.parse(localStorage.getItem('solicitudesComision')) || [];
    
    // Verificar si el carnet ya existe
    if (solicitudes.some(s => s.carnet === carnet)) {
        showNotification('Ya existe una solicitud con este carnet', false);
        return;
    }
    
    solicitudes.push(solicitud);
    localStorage.setItem('solicitudesComision', JSON.stringify(solicitudes));
    localStorage.setItem('ultimoCarnetRegistrado', carnet);
    
    // Mostrar mensaje de éxito
    showNotification('Solicitud enviada correctamente', true);
    
    // Limpiar formulario
    form.reset();
    
    // Redirigir a la página de espera
    setTimeout(() => {
        window.location.href = 'Espera.html';
    }, 1500);
    });
});