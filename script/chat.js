document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const contactsList = document.getElementById('contactsList');
    const chatHeader = document.getElementById('chatHeader');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    // Datos de ejemplo (en un sistema real, estos vendrían de una base de datos)
    let contacts = [];
    let currentUser = {};
    let selectedContact = null;
    
    // Determinar si es coordinador o estudiante
    const isCoordinator = document.body.classList.contains('chat-coordinador');
    
    // Inicializar datos
    if (isCoordinator) {
        currentUser = { id: 'coord-1', name: 'Coordinador', type: 'coordinator' };
        contacts = [
            { id: 'est-1', name: 'Diego Hernandez', comision: 'Seguridad' },
            { id: 'est-2', name: 'Camila Rugamas', comision: 'Medio Ambiente' },
            { id: 'est-3', name: 'Angel Calderon', comision: 'Evangelización' }
        ];
    } else {
        currentUser = { id: 'est-1', name: 'Estudiante', type: 'student' };
        contacts = [
            { id: 'coord-1', name: 'Coordinador Principal', comision: 'General' },
            { id: 'coord-2', name: 'Coordinador de Seguridad', comision: 'Seguridad' }
        ];
    }
    
    // Cargar contactos
    function loadContacts() {
        contactsList.innerHTML = '';
        contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <h5>${contact.name}</h5>
                <small class="text-muted">${contact.comision}</small>
            `;
            contactItem.addEventListener('click', () => selectContact(contact));
            contactsList.appendChild(contactItem);
        });
    }
    
    // Seleccionar contacto
    function selectContact(contact) {
        selectedContact = contact;
        
        // Resaltar contacto seleccionado
        document.querySelectorAll('.contact-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Actualizar header del chat
        chatHeader.innerHTML = `<h3>${contact.name} <small class="text-muted">${contact.comision}</small></h3>`;
        
        // Cargar mensajes
        loadMessages();
    }
    
    // Cargar mensajes (simulado)
    function loadMessages() {
        if (!selectedContact) return;
        
        // Mensajes de ejemplo (en un sistema real, estos vendrían de una base de datos)
        const messages = [
            { 
                id: 1, 
                sender: selectedContact.id, 
                text: 'Hola, ¿cómo estás?', 
                time: '10:30 AM' 
            },
            { 
                id: 2, 
                sender: currentUser.id, 
                text: 'Bien, gracias. ¿Y tú?', 
                time: '10:32 AM' 
            },
            { 
                id: 3, 
                sender: selectedContact.id, 
                text: 'Muy bien también. ¿Listo para la actividad de mañana?', 
                time: '10:33 AM' 
            }
        ];
        
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            const isSent = message.sender === currentUser.id;
            const messageElement = document.createElement('div');
            messageElement.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
            messageElement.innerHTML = `
                <div>${message.text}</div>
                <div class="message-time">${message.time}</div>
            `;
            chatMessages.appendChild(messageElement);
        });
        
        // Scroll al final de los mensajes
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Enviar mensaje
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text || !selectedContact) return;
        
        // Crear nuevo mensaje
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-sent';
        messageElement.innerHTML = `
            <div>${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        chatMessages.appendChild(messageElement);
        
        // Limpiar input
        messageInput.value = '';
        
        // Scroll al final
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // En un sistema real, aquí enviarías el mensaje al servidor
        console.log('Mensaje enviado:', {
            to: selectedContact.id,
            text: text,
            time: new Date()
        });
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Inicializar
    loadContacts();
});