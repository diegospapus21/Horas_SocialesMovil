import { getAllPendient, updateSolicitud } from '../services/SolicitudService.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPendingRequests();
});

async function loadPendingRequests() {
    try {
        const solicitudes = await getAllPendient(0, 50);
        displayRequests(solicitudes.content || solicitudes);
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

function displayRequests(requests) {
    const container = document.getElementById('solicitudes-container');
    if (!container) return;

    container.innerHTML = '';

    if (!requests || requests.length === 0) {
        container.innerHTML = '<div class="empty-message">No hay solicitudes pendientes</div>';
        return;
    }

    requests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'applicant-card';
        requestElement.innerHTML = `
            <div class="applicant-info">
                <h5 class="applicant-name">${request.nombreEstudiante}</h5>
                <div class="applicant-details">
                    <span>Código: ${request.codigoEstudiante}</span>
                    <span>Especialidad: ${request.especialidad}</span>
                    <span>Comisión: ${getCommissionName(request.comisionId)}</span>
                </div>
                <p class="applicant-date">Solicitado: ${formatDate(request.fechaSolicitud)}</p>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-success btn-action" onclick="handleRequest('${request.id}', 'aprobada')">
                    Aprobar
                </button>
                <button class="btn btn-danger btn-action" onclick="handleRequest('${request.id}', 'rechazada')">
                    Rechazar
                </button>
            </div>
        `;
        container.appendChild(requestElement);
    });
}

window.handleRequest = async (requestId, status) => {
    const action = status === 'aprobada' ? 'aprobar' : 'rechazar';
    if (confirm(`¿Está seguro de ${action} esta solicitud?`)) {
        try {
            await updateSolicitud(requestId, { estado: status });
            showNotification(`Solicitud ${action}da`, 'success');
            await loadPendingRequests();
        } catch (error) {
            showNotification(`Error al ${action} solicitud`, 'error');
        }
    }
};

function getCommissionName(commissionId) {
    const commissions = {
        1: 'Seguridad y Emergencia',
        2: 'Medio Ambiente',
        3: 'Evangelización',
        4: 'Teatro',
        5: 'Comunicaciones',
        6: 'Expo Técnico Científico'
    };
    return commissions[commissionId] || `Comisión ${commissionId}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}