document.addEventListener('DOMContentLoaded', function() {
      const actividadesContainer = document.getElementById('actividades-container');
      const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
      
      if (eventos.length === 0) {
        actividadesContainer.innerHTML = '<p>No hay actividades programadas.</p>';
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
    });

    function toggleActividad(element) {
      const card = element.closest('.actividad-card');
      card.classList.toggle('abierta');
    }