document.addEventListener('DOMContentLoaded', function() {
    const recargarBtn = document.getElementById('recargarBtn');
    const carnet = localStorage.getItem('ultimoCarnetRegistrado');
    
    // Verificar estado de aprobación
    function verificarAprobacion() {
        const aceptados = JSON.parse(localStorage.getItem('estudiantesAceptados')) || [];
        const solicitudAceptada = aceptados.find(est => est.carnet === carnet);
        
        if (solicitudAceptada) {
            // Redirigir al dashboard si fue aceptado
            window.location.href = 'DashboardE.html';
        } else {
            alert('Tu solicitud aún no ha sido aprobada');
        }
    }
    
    recargarBtn.addEventListener('click', verificarAprobacion);
    
    // Verificar automáticamente al cargar la página
    verificarAprobacion();
});