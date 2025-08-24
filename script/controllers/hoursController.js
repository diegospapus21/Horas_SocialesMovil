import { buscarHoras, modificarHorasSociales } from '../services/HorasSocialesService.js';

document.addEventListener('DOMContentLoaded', () => {
    loadHoursData();
});

async function loadHoursData() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol !== 'estudiante') return;

        const horasData = await buscarHoras(user.codigo);
        displayHoursData(horasData);
    } catch (error) {
        console.error('Error loading hours data:', error);
    }
}

function displayHoursData(horasData) {
    if (!horasData) return;

    // Actualizar el dashboard
    const progressElement = document.querySelector('.progress-pie-fill');
    const percentageText = document.querySelector('.percentage-text');
    
    if (progressElement && percentageText) {
        const porcentaje = horasData.porcentajeCompletado || 
                         (horasData.horasCompletadas / horasData.horasRequeridas) * 100 || 0;
        
        percentageText.textContent = `${Math.round(porcentaje)}%`;
        const rotation = (porcentaje / 100) * 180;
        progressElement.style.transform = `rotate(${rotation}deg)`;
    }

    // Mostrar detalles de horas
    const hoursDetailElement = document.getElementById('hours-detail');
    if (hoursDetailElement) {
        hoursDetailElement.innerHTML = `
            <div class="hours-info">
                <p><strong>Horas Completadas:</strong> ${horasData.horasCompletadas || 0}</p>
                <p><strong>Horas Requeridas:</strong> ${horasData.horasRequeridas || 0}</p>
                <p><strong>Porcentaje:</strong> ${Math.round(porcentaje)}%</p>
                <p><strong>Estado:</strong> ${horasData.estado || 'En progreso'}</p>
            </div>
        `;
    }
}

// Para coordinadores - actualizar horas de estudiantes
window.updateStudentHours = async (studentCode, hours) => {
    try {
        // Primero obtener los datos actuales
        const currentData = await buscarHoras(studentCode);
        
        // Actualizar horas
        await modificarHorasSociales(currentData.id, {
            horasCompletadas: hours,
            horasRequeridas: currentData.horasRequeridas,
            estado: hours >= currentData.horasRequeridas ? 'completado' : 'en progreso'
        });
        
        showNotification('Horas actualizadas correctamente', 'success');
    } catch (error) {
        showNotification('Error al actualizar horas', 'error');
    }
};