import { obtenerEventos, agregarEvento, actualizarEvento, borrarUsuario } from '../services/EventosService.js';

document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    setupActivityForm();
});

async function loadActivities() {
    try {
        const eventos = await obtenerEventos(0, 50); // página 0, tamaño 50
        displayActivities(eventos.content || eventos);
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

function displayActivities(activities) {
    const container = document.getElementById('actividades-container');
    if (!container) return;

    container.innerHTML = '';

    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="sin-actividades">No hay actividades programadas</div>';
        return;
    }

    activities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'actividad-card';
        activityCard.innerHTML = `
            <div class="actividad-header" onclick="toggleActividad(this)">
                <div>
                    <div class="actividad-fecha">${formatDate(activity.fecha)}</div>
                    <h3 class="actividad-title">${activity.nombre || activity.titulo}</h3>
                </div>
                ${isCoordinator() ? `
                <button class="btn-expirar" onclick="event.stopPropagation(); expireActivity('${activity.id}')">
                    Expirar
                </button>
                ` : ''}
            </div>
            <div class="actividad-contenido">
                <div class="actividad-descripcion">
                    <p>${activity.descripcion}</p>
                    <p><strong>Lugar:</strong> ${activity.lugar || activity.ubicacion}</p>
                    <p><strong>Hora:</strong> ${activity.hora}</p>
                    <p><strong>Estado:</strong> ${activity.estado || 'activo'}</p>
                </div>
            </div>
        `;
        container.appendChild(activityCard);
    });
}

function setupActivityForm() {
    const form = document.getElementById('activityForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const eventData = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            lugar: formData.get('lugar'),
            estado: 'activo'
        };

        try {
            await agregarEvento(eventData);
            form.reset();
            await loadActivities();
            showNotification('Evento creado exitosamente', 'success');
        } catch (error) {
            showNotification('Error al crear evento', 'error');
        }
    });
}

window.expireActivity = async (eventId) => {
    if (confirm('¿Está seguro de que desea expirar este evento?')) {
        try {
            await actualizarEvento(eventId, { estado: 'expirado' });
            await loadActivities();
            showNotification('Evento expirado', 'success');
        } catch (error) {
            showNotification('Error al expirar evento', 'error');
        }
    }
};

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function isCoordinator() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.rol === 'coordinador';
}