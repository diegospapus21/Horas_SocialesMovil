    document.addEventListener('DOMContentLoaded', function() {
      // Obtener actividades expiradas del localStorage
      const actividadesExpiradas = JSON.parse(localStorage.getItem('actividadesExpiradas')) || [];
      
      // Calcular total de horas
      const totalHoras = actividadesExpiradas.reduce((total, actividad) => total + actividad.horas, 0);
      const horasFaltantes = 150 - totalHoras;
      const porcentajeCompletado = Math.min(Math.round((totalHoras / 150) * 100), 100);
      
      // Actualizar el resumen
      document.getElementById('total-horas').textContent = `${totalHoras} horas completadas`;
      document.getElementById('horas-faltantes').textContent = `${horasFaltantes > 0 ? horasFaltantes + ' horas faltantes' : '¡Meta alcanzada!'}`;
      document.getElementById('barra-progreso').style.width = `${porcentajeCompletado}%`;
      document.getElementById('barra-progreso').textContent = `${porcentajeCompletado}%`;
      
      // Mostrar actividades expiradas
      const listaActividades = document.getElementById('lista-actividades');
      
      if (actividadesExpiradas.length === 0) {
        listaActividades.innerHTML = '<p>No hay actividades completadas aún.</p>';
        return;
      }
      
      // Mostrar cada actividad expirada
      actividadesExpiradas.forEach(actividad => {
        const actividadHTML = `
          <div class="actividad-expirada">
            <div class="actividad-header">${actividad.nombre}</div>
            <div class="actividad-detalle">
              <span>Completada: ${actividad.fechaExpiracion}</span>
              <span>${actividad.horas} horas</span>
            </div>
          </div>
        `;
        listaActividades.insertAdjacentHTML('beforeend', actividadHTML);
      });
    });