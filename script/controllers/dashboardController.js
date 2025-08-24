import { buscarHoras } from '../services/HorasSocialesService.js';
import { obtenerEventos } from '../services/EventosService.js';

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        if (user.rol === 'estudiante') {
            await loadStudentProgress(user.codigo);
        }

        await loadUpcomingEvents();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadStudentProgress(studentCode) {
    try {
        const horasData = await buscarHoras(studentCode);
        
        const progressElement = document.querySelector('.progress-pie-fill');
        const percentageText = document.querySelector('.percentage-text');
        
        if (progressElement && percentageText && horasData) {
            const porcentaje = horasData.porcentajeCompletado || 
                             (horasData.horasCompletadas / horasData.horasRequeridas) * 100 || 0;
            
            percentageText.textContent = `${Math.round(porcentaje)}%`;
            const rotation = (porcentaje / 100) * 180;
            progressElement.style.transform = `rotate(${rotation}deg)`;
        }
    } catch (error) {
        console.error('Error loading student progress:', error);
    }
}

async function loadUpcomingEvents() {
    try {
        const eventos = await obtenerEventos(0, 5);
        const nextEvent = eventos.content && eventos.content.length > 0 ? eventos.content[0] : 
                         eventos.length > 0 ? eventos[0] : null;
        
        if (nextEvent) {
            const avisoElement = document.querySelector('.aviso-card');
            if (avisoElement) {
                avisoElement.innerHTML = `
                    <h5 class="aviso-title">Próxima Actividad</h5>
                    <p class="aviso-text">${nextEvent.nombre}<br>${nextEvent.lugar}</p>
                    <div class="aviso-hora">${formatTime(nextEvent.hora)}</div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading upcoming events:', error);
    }
}

function formatTime(timeString) {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}