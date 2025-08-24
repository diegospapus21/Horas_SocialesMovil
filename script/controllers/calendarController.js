import { getAllCalendario, crearCalendario } from '../services/CalendarioService.js';

let currentDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
});

async function initializeCalendar() {
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    await loadEvents(currentDate.getFullYear(), currentDate.getMonth() + 1);
}

async function loadEvents(year, month) {
    try {
        const events = await getAllCalendario(0, 100); // Obtener todos los eventos
        const monthEvents = events.content ? events.content.filter(event => {
            const eventDate = new Date(event.fecha);
            return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month;
        }) : [];
        
        markEventsOnCalendar(monthEvents);
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function markEventsOnCalendar(events) {
    events.forEach(event => {
        const eventDate = new Date(event.fecha);
        const dayElement = findDayElement(eventDate.getDate());
        
        if (dayElement) {
            dayElement.classList.add('day-event');
            dayElement.title = event.nombre || event.descripcion;
        }
    });
}
