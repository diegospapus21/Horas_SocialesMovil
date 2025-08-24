import { createSolicitud, getByCodigoEstudiante } from '../services/SolicitudService.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCommissionButtons();
});

function setupCommissionButtons() {
    window.joinCommission = async (commissionId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'Inscripcion.html';
            return;
        }

        try {
            // Verificar si ya tiene una solicitud
            const existingRequests = await getByCodigoEstudiante(user.codigo);
            
            if (existingRequests && existingRequests.length > 0) {
                const pendingRequest = existingRequests.find(req => req.estado === 'pendiente');
                if (pendingRequest) {
                    showNotification('Ya tienes una solicitud pendiente', 'warning');
                    window.location.href = 'Espera.html';
                    return;
                }
            }

            // Crear nueva solicitud
            const solicitudData = {
                codigoEstudiante: user.codigo,
                nombreEstudiante: user.nombre,
                especialidad: user.especialidad,
                comisionId: commissionId,
                estado: 'pendiente',
                fechaSolicitud: new Date().toISOString()
            };

            await createSolicitud(solicitudData);
            showNotification('Solicitud enviada exitosamente', 'success');
            window.location.href = 'Espera.html';
            
        } catch (error) {
            showNotification('Error al enviar solicitud', 'error');
        }
    };
}