// Función para obtener datos de vehículos desde un archivo JSON alojado en un repositorio remoto
async function fetchVehicles() {
    try {
        // Realiza una solicitud HTTP para obtener los datos del archivo JSON
        const response = await fetch('https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/main/vehiculos.json');
        if (!response.ok) {
            // Verifica si la respuesta de la red es válida, si no, lanza un error
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Convierte la respuesta en formato JSON
        const data = await response.json();
        return data; // Devuelve los datos en formato JSON
    } catch (error) {
        // Captura y muestra cualquier error que ocurra durante la solicitud
        console.error('Hubo un problema con la solicitud fetch:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
}

// Función para crear una tarjeta HTML para cada vehículo
function createVehicleCard(vehicle) {
    return `
        <div class="card vehicle-card">
            <div class="card-body d-flex flex-column flex-md-row">
                <div class="mr-md-3" style="flex: 1;">
                    <!-- Imagen del logo del vehículo -->
                    <img src="${vehicle.logo}" alt="${vehicle.marca} Logo" class="img-fluid logo-image mb-3" style="object-fit: contain; max-width: 100%; max-height: 100%;">
                    <!-- Información principal del vehículo -->
                    <h5 class="card-title">${vehicle.modelo} (${vehicle.marca})</h5>
                    <p class="card-text"><strong>Tipo:</strong> ${vehicle.tipo}</p>
                    <p class="card-text"><strong>Características:</strong> ${vehicle.caracteristicas}</p>
                    <p class="card-text"><strong>Motor:</strong> ${vehicle.motor}</p>
                    <p class="card-text"><strong>Combustible:</strong> ${vehicle.combustible}</p>
                    <p class="card-text"><strong>Precio Venta:</strong> $${vehicle.precio_venta}</p>
                    <p class="card-text"><strong>Existencias:</strong> ${vehicle.existencia}</p>
                    <!-- Botón para abrir el modal de contacto -->
                    <button type='button' class='btn btn-info mt-2' onclick='openContactModal("${vehicle.modelo}")'>Contacto</button>
                </div>
                <!-- Imagen del vehículo con opción para abrir en un modal -->
                <img src="${vehicle.imagen}" alt="${vehicle.modelo}" class="img-fluid vehicle-image mb-3" style="object-fit: contain; max-width: 100%; max-height: 100%;" onclick="openImageModal('${vehicle.imagen}')">
            </div>
        </div>
    `;
}

// Función para mostrar la imagen en un modal emergente
function openImageModal(imageUrl) {
    const modalImage = document.getElementById('modalVehicleImage');
    modalImage.src = imageUrl; // Establece la URL de la imagen en el modal
    $('#vehicleImageModal').modal('show'); // Muestra el modal
}

// Función para buscar vehículos según un término ingresado en el campo de búsqueda
async function searchVehicles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtiene y normaliza el texto ingresado
    const vehicles = await fetchVehicles(); // Obtiene la lista de vehículos
    // Filtra los vehículos que coinciden con la búsqueda en marca, modelo o tipo
    const filteredVehicles = vehicles.filter(vehicle => 
        vehicle.marca.toLowerCase().includes(searchInput) || 
        vehicle.modelo.toLowerCase().includes(searchInput) ||
        vehicle.tipo.toLowerCase().includes(searchInput)
    );
    // Genera las tarjetas para los vehículos filtrados
    const vehicleCards = filteredVehicles.map(vehicle => createVehicleCard(vehicle)).join('');
    document.getElementById('vehicleCards').innerHTML = vehicleCards; // Muestra las tarjetas en el DOM
}

// Función para limpiar el campo de búsqueda y recargar todos los vehículos
function clearSearch() {
    document.getElementById('searchInput').value = ''; // Limpia el campo de búsqueda
    loadVehicles(); // Carga nuevamente todos los vehículos
}

// Función para cargar y mostrar todos los vehículos al iniciar la aplicación
async function loadVehicles() {
    const vehicles = await fetchVehicles(); // Obtiene la lista de vehículos
    const vehicleCards = vehicles.map(vehicle => createVehicleCard(vehicle)).join(''); // Genera las tarjetas de vehículos
    document.getElementById('vehicleCards').innerHTML = vehicleCards; // Inserta las tarjetas en el DOM
}

// Función para abrir el modal de contacto y configurar el modelo del vehículo seleccionado
function openContactModal(vehicleModel) {
    document.getElementById('vehicleModel').value = vehicleModel; // Asigna el modelo al campo del formulario
    populateVehicleModels(); // Rellena la lista desplegable con todos los modelos
    $('#contactModal').modal('show'); // Muestra el modal
}

// Función para rellenar el selector de modelos en el formulario de contacto
async function populateVehicleModels() {
    const selectElement = document.getElementById('vehicleModel');
    selectElement.innerHTML = ''; // Limpia las opciones actuales del selector

    const vehicles = await fetchVehicles(); // Obtiene la lista de vehículos
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.modelo; // Asigna el valor al modelo
        option.textContent = vehicle.modelo; // Asigna el texto visible al modelo
        selectElement.appendChild(option); // Agrega la opción al selector
    });
}

// Función para manejar el envío del formulario de contacto
function submitForm() {
    const name = document.getElementById('customerName').value; // Obtiene el nombre del cliente
    const email = document.getElementById('customerEmail').value; // Obtiene el correo electrónico
    const model = document.getElementById('vehicleModel').value; // Obtiene el modelo seleccionado
    const message = document.getElementById('message').value; // Obtiene el mensaje del cliente

    // Muestra una alerta con los datos del formulario
    alert(`Formulario enviado: \nNombre: ${name} \nEmail: ${email} \nModelo: ${model} \nMensaje: ${message}`);
    $('#contactModal').modal('hide'); // Cierra el modal
}

// Llama a la función para cargar los vehículos al inicio de la aplicación
loadVehicles();
