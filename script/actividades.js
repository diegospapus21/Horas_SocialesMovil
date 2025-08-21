  document.addEventListener('DOMContentLoaded', function() {
      cargarActividades();
    });

    function cargarActividades() {
      const actividadesContainer = document.getElementById('actividades-container');
      const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
      
      actividadesContainer.innerHTML = '';
      
      if (eventos.length === 0) {
        actividadesContainer.innerHTML = '<div class="sin-actividades"><p>No hay actividades programadas</p></div>';
        return;
      }
      
      // Ordenar eventos por fecha (más cercana primero)
      eventos.sort((a, b) => new Date(a.fechaCompleta) - new Date(b.fechaCompleta));
      
      eventos.forEach(evento => {
        const actividadHTML = `
          <div class="actividad-card">
            <div class="actividad-header" onclick="toggleActividad(this)">
              <div>
                <p class="actividad-fecha">${evento.fecha}</p>
                <h3 class="actividad-title">${evento.nombre}</h3>
              </div>
              <button class="btn-expirar" onclick="expirarActividad(event, '${evento.nombre}', '${evento.fechaCompleta}')">Expirar</button>
            </div>
            <div class="actividad-contenido">
              <div class="actividad-descripcion">
                ${evento.descripcion}
              </div>
            </div>
          </div>
        `;
        actividadesContainer.insertAdjacentHTML('beforeend', actividadHTML);
      });
    }

    function toggleActividad(element) {
      const card = element.closest('.actividad-card');
      card.classList.toggle('abierta');
    }

    function expirarActividad(event, nombreActividad, fechaCompleta) {
      event.stopPropagation();
      
      if (!confirm(`¿Estás seguro de marcar "${nombreActividad}" como expirada? Se asignarán 20 horas sociales a los participantes.`)) {
        return;
      }
      
      // Obtener eventos actuales
      let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
      
      // Buscar el evento a expirar
      const eventoIndex = eventos.findIndex(evento => 
        evento.nombre === nombreActividad && evento.fechaCompleta === fechaCompleta
      );
      
      if (eventoIndex === -1) return;
      
      const evento = eventos[eventoIndex];
      
      // Obtener actividades expiradas existentes o inicializar array
      let actividadesExpiradas = JSON.parse(localStorage.getItem('actividadesExpiradas')) || [];
      
      // Crear objeto de actividad expirada
      const actividadExpirada = {
        nombre: evento.nombre,
        fecha: evento.fecha,
        fechaExpiracion: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        horas: 20,
        descripcion: evento.descripcion,
        fechaCompleta: new Date().toISOString().split('T')[0] // Fecha de expiración completa
      };
      
      // Agregar nueva actividad expirada
      actividadesExpiradas.push(actividadExpirada);
      
      // Eliminar el evento de la lista actual
      eventos.splice(eventoIndex, 1);
      
      // Guardar en localStorage
      localStorage.setItem('eventos', JSON.stringify(eventos));
      localStorage.setItem('actividadesExpiradas', JSON.stringify(actividadesExpiradas));
      
      // Recargar las actividades
      cargarActividades();
      
      // Mostrar mensaje de éxito
      alert('Actividad marcada como expirada. Se han asignado 20 horas sociales a los estudiantes.');
    }