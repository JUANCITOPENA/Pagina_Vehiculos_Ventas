let vehicles = []; // Guardar los vehículos globalmente
let imageModal = null; // Modal para mostrar imagen del vehículo
let contactModal = null; // Modal para mostrar formulario de contacto

// Función para obtener los vehículos desde un archivo JSON externo
async function fetchVehicles() {
    if (vehicles.length === 0) { // Solo obtener los datos si aún no están almacenados
        try {
            // Realizamos una solicitud fetch para obtener los vehículos
            const response = await fetch('https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/main/vehiculos.json');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Si hay error en la respuesta
            }
            vehicles = await response.json(); // Guardamos los vehículos en la variable global
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error); // Manejo de errores
            vehicles = []; // Asegurarse de que siempre haya algo que usar
        }
    }
    return vehicles; // Devuelve los vehículos cargados
}

// Función para crear una tarjeta de vehículo en formato HTML
function createVehicleCard(vehicle) {
    return `
        <div class="card vehicle-card">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mr-md-3" style="flex: 1;">
                    <img src="${vehicle.logo}" alt="${vehicle.marca} Logo" class="img-fluid logo-image mb-3" style="object-fit: contain; max-width: 100%; max-height: 100%;">
                    <h5 class="card-title">${vehicle.modelo} (${vehicle.marca})</h5>
                    <p class="card-text"><strong>Tipo:</strong> ${vehicle.tipo}</p>
                    <p class="card-text"><strong>Características:</strong> ${vehicle.caracteristicas}</p>
                    <p class="card-text"><strong>Motor:</strong> ${vehicle.motor}</p>
                    <p class="card-text"><strong>Combustible:</strong> ${vehicle.combustible}</p>
                    <p class="card-text"><strong>Precio Venta:</strong> $${vehicle.precio_venta}</p>
                    <p class="card-text"><strong>Existencias:</strong> ${vehicle.existencia}</p>
                    <button type='button' class='btn btn-info mt-2' onclick='openContactModal("${vehicle.modelo}")'>Contacto</button>
                </div>
                <img src="${vehicle.imagen}" alt="${vehicle.modelo}" class="img-fluid vehicle-image mb-3" style="object-fit: contain; max-width: 100%; max-height: 100%;" onclick="openImageModal('${vehicle.imagen}')">
            </div>
        </div>
    `;
}

// Inicializamos los modales una sola vez cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    imageModal = new bootstrap.Modal(document.getElementById('vehicleImageModal')); // Modal de imagen
    contactModal = new bootstrap.Modal(document.getElementById('contactModal')); // Modal de contacto

    // Configuramos los listeners de los modales
    setupModalListeners('vehicleImageModal', imageModal);
    setupModalListeners('contactModal', contactModal);

    loadVehicles(); // Cargar los vehículos al inicio
});

// Función para configurar los listeners de los botones de cierre en los modales
function setupModalListeners(modalId, modalInstance) {
    const modalElement = document.getElementById(modalId);

    // Listener para los botones de cerrar del modal
    modalElement.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
        button.addEventListener('click', () => modalInstance.hide());
    });

    // Cerrar el modal al hacer clic fuera de él
    modalElement.addEventListener('click', function(event) {
        if (event.target === modalElement) {
            modalInstance.hide();
        }
    });

    // Limpiar el contenido del modal al cerrarlo
    modalElement.addEventListener('hidden.bs.modal', function() {
        if (modalId === 'vehicleImageModal') {
            document.getElementById('modalVehicleImage').src = ''; // Limpiar imagen
        }
    });
}

// Función para abrir el modal de imagen con la imagen seleccionada
function openImageModal(imageUrl) {
    document.getElementById('modalVehicleImage').src = imageUrl; // Asignamos la imagen al modal
    imageModal.show(); // Mostramos el modal
}

// Función para abrir el modal de contacto y llenar el modelo del vehículo
function openContactModal(vehicleModel) {
    document.getElementById('vehicleModel').value = vehicleModel; // Rellenamos el campo del modelo del vehículo
    populateVehicleModels(); // Llenamos el selector de modelos
    contactModal.show(); // Mostramos el modal de contacto
}

// Función para realizar la búsqueda de vehículos basándose en el texto introducido
async function searchVehicles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredVehicles = vehicles.filter(vehicle => 
        vehicle.marca.toLowerCase().includes(searchInput) || 
        vehicle.modelo.toLowerCase().includes(searchInput) ||
        vehicle.tipo.toLowerCase().includes(searchInput)
    );
    
    const vehicleCards = filteredVehicles.map(createVehicleCard).join('');
    const vehicleCardsContainer = document.getElementById('vehicleCards');

    if (filteredVehicles.length === 0) {
        vehicleCardsContainer.innerHTML = '<p>No se encontraron vehículos que coincidan con tu búsqueda.</p>';
    } else {
        vehicleCardsContainer.innerHTML = vehicleCards;
    }
}


// Función para limpiar la búsqueda y recargar todos los vehículos
function clearSearch() {
    document.getElementById('searchInput').value = ''; // Limpiar el campo de búsqueda
    loadVehicles(); // Recargar todos los vehículos al borrar la búsqueda
}

// Función para cargar todos los vehículos al iniciar la página
async function loadVehicles() {
    const vehicles = await fetchVehicles(); // Obtener los vehículos
    const vehicleCards = vehicles.map(createVehicleCard).join(''); // Crear tarjetas de todos los vehículos
    document.getElementById('vehicleCards').innerHTML = vehicleCards; // Mostrar todas las tarjetas
}

// Función para llenar el selector de modelos de vehículos
async function populateVehicleModels() {
    const selectElement = document.getElementById('vehicleModel');
    selectElement.innerHTML = ''; // Limpiar el contenido del selector

    const vehicles = await fetchVehicles(); // Obtener los vehículos
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.modelo; // Asignamos el valor del modelo
        option.textContent = vehicle.modelo; // Asignamos el nombre del modelo
        selectElement.appendChild(option); // Agregamos la opción al selector
    });
}

// Función para enviar el formulario de contacto
function submitForm(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const name = document.getElementById('customerName').value; // Obtener el nombre del cliente
    const email = document.getElementById('customerEmail').value; // Obtener el email del cliente
    const model = document.getElementById('vehicleModel').value; // Obtener el modelo del vehículo
    const message = document.getElementById('message').value; // Obtener el mensaje

    alert(`Formulario enviado: \nNombre: ${name} \nEmail: ${email} \nModelo: ${model} \nMensaje: ${message}`); // Mostrar alerta con los datos del formulario
    
    if (contactModal) {
        contactModal.hide(); // Cerrar el modal de contacto
    }
}

// Agregar un manejador global para cerrar los modales cuando se presiona la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') { // Si se presiona ESC
        if (imageModal) imageModal.hide(); // Cerrar modal de imagen
        if (contactModal) contactModal.hide(); // Cerrar modal de contacto
    }
});
