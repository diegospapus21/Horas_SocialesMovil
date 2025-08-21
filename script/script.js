const API = "https://686c3a7714219674dcc79348.mockapi.io/api/U1/HorasSociales"
const NEWAPI = "https://686c3a7714219674dcc79348.mockapi.io/api/U1/HorasSociales/1/NewUser"

function Login() {
    // Prevenir el envío del formulario por defecto
    event.preventDefault();
 
    // Obtener valores de los campos
    let email = document.getElementById("Correo").value;
    let password = document.getElementById("Contraseña").value;
 
    // Validación básica de campos vacíos
    if (!email || !password) {
        alert("Por favor, complete todos los campos");
        return;
    }
 
    // Definir usuarios válidos con sus roles
    const usuariosValidos = [
        // Credenciales de coordinadores
        { 
            email: "admin@institucion.edu", 
            password: "admin123",
            rol: "coordinador",
            dashboard: "DashboardC.html"
        },
        { 
            email: "coordinador1@institucion.edu", 
            password: "coor123",
            rol: "coordinador",
            dashboard: "DashboardC.html"
        },
        { 
            email: "coordinador2@institucion.edu", 
            password: "coor456",
            rol: "coordinador",
            dashboard: "DashboardC.html"
        }, 

        { 
            email: "coordinador3@institucion.edu", 
            password: "coor567",
            rol: "coordinador",
            dashboard: "DashboardC.html"
        },
        
        // Credenciales de estudiantes
        { 
            email: "estudiante@institucion.edu", 
            password: "estudiante123",
            rol: "estudiante",
            dashboard: "DashboardE.html"
        },
        { 
            email: "alumno1@institucion.edu", 
            password: "alumno123",
            rol: "estudiante",
            dashboard: "DashboardE.html"
        },
        { 
            email: "alumno2@institucion.edu", 
            password: "alumno456",
            rol: "estudiante",
            dashboard: "DashboardE.html"
        },
        { 
            email: "alumno3@institucion.edu", 
            password: "alumno789",
            rol: "estudiante",
            dashboard: "DashboardE.html"
        }
    ];
 
    // Verificar si las credenciales coinciden con algún usuario válido
    const usuarioValido = usuariosValidos.find(user => 
        user.email === email && user.password === password
    );
 
    if (usuarioValido) {
        // Redirigir directamente al dashboard correspondiente
        if (usuarioValido.rol === "coordinador") {
            window.location.href = "DashboardC.html";
        } else {
            // Para estudiantes, mantener la lógica de primera vez
            const firstLoginKey = `firstLogin_${email}`;
            const isFirstLogin = localStorage.getItem(firstLoginKey) === null;
            
            if (isFirstLogin) {
                localStorage.setItem(firstLoginKey, 'false');
                window.location.href = "Comisiones.html";
            } else {
                window.location.href = usuarioValido.dashboard;
            }
        }
        
        // Guardar datos del usuario si marcó "Recordarme"
        if (document.querySelector('input[type="checkbox"]').checked) {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('rol', usuarioValido.rol);
        }
    } else {
        alert("Credenciales incorrectas. Por favor, intente nuevamente.");
    }
}
 
// Cargar el email guardado cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    const savedEmail = sessionStorage.getItem('email');
    if (savedEmail) {
        document.getElementById('Correo').value = savedEmail;
        document.querySelector('input[type="checkbox"]').checked = true;
    }
});