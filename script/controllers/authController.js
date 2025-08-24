import { LoginCoordinadores, LoginAdministradores, LogInEstudiantes } from '../services/UsuariosService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    checkAuthStatus();
});

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        let user;
        
        // Intentar login según el tipo de usuario
        try {
            user = await LogInEstudiantes(credentials.email);
            if (!user) user = await LoginCoordinadores(credentials.email);
            if (!user) user = await LoginAdministradores(credentials.email);
        } catch (error) {
            // Si el endpoint espera parámetros diferentes
            user = await handleAlternativeLogin(credentials);
        }

        if (user && user.correo === credentials.email) {
            localStorage.setItem('token', 'generar-token-jwt-aqui'); // Tu API debe generar tokens
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirigir según el rol
            if (user.rol === 'coordinador') {
                window.location.href = 'DashboardC.html';
            } else if (user.rol === 'administrador') {
                window.location.href = 'DashboardA.html';
            } else {
                window.location.href = 'DashboardE.html';
            }
        } else {
            showNotification('Credenciales incorrectas', 'error');
        }
    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
    }
}

async function handleAlternativeLogin(credentials) {
    // Implementar lógica alternativa de login si es necesario
    const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    });
    return res.json();
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
        if (window.location.pathname.includes('index.html')) {
            window.location.href = user.rol === 'coordinador' ? 'DashboardC.html' : 
                                 user.rol === 'administrador' ? 'DashboardA.html' : 'DashboardE.html';
        }
    }
}

function showNotification(message, type) {
    alert(`${type.toUpperCase()}: ${message}`);
}