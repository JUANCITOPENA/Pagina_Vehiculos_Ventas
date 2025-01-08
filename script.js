async function fetchVehicles() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/main/vehiculos.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
        return [];
    }
}

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
                   <!-- <p class="card-text"><strong>Precio Compra:</strong> $${vehicle.precio_compra}</p> -->

                    <p class="card-text"><strong>Precio Venta:</strong> $${vehicle.precio_venta}</p>
                    <p class="card-text"><strong>Existencias:</strong> ${vehicle.existencia}</p>
                    <button type='button' class='btn btn-info mt-2' onclick='openContactModal("${vehicle.modelo}")'>Contacto</button>
                </div>
                <!-- Modificado para llamar a openImageModal -->
                <img src="${vehicle.imagen}" alt="${vehicle.modelo}" class="img-fluid vehicle-image mb-3" style="object-fit: contain; max-width: 100%; max-height: 100%;" onclick="openImageModal('${vehicle.imagen}')">
            </div>
        </div>
    `;
}


function openImageModal(imageUrl) {
    const modalImage = document.getElementById('modalVehicleImage');
    modalImage.src = imageUrl;
    $('#vehicleImageModal').modal('show');
}


async function searchVehicles() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const vehicles = await fetchVehicles();
    const filteredVehicles = vehicles.filter(vehicle => 
        vehicle.marca.toLowerCase().includes(searchInput) || 
        vehicle.modelo.toLowerCase().includes(searchInput) ||
        vehicle.tipo.toLowerCase().includes(searchInput)
    );
    const vehicleCards = filteredVehicles.map(vehicle => createVehicleCard(vehicle)).join('');
    document.getElementById('vehicleCards').innerHTML = vehicleCards;
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadVehicles();
}

async function loadVehicles() {
    const vehicles = await fetchVehicles();
    const vehicleCards = vehicles.map(vehicle => createVehicleCard(vehicle)).join('');
    document.getElementById('vehicleCards').innerHTML = vehicleCards;
}

function openContactModal(vehicleModel) {
    document.getElementById('vehicleModel').value = vehicleModel;
    populateVehicleModels(); 
    $('#contactModal').modal('show');
}

async function populateVehicleModels() {
    const selectElement = document.getElementById('vehicleModel');
    selectElement.innerHTML = ''; 

    const vehicles = await fetchVehicles();
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.modelo;
        option.textContent = vehicle.modelo;
        selectElement.appendChild(option);
    });
}

function submitForm() {
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const model = document.getElementById('vehicleModel').value;
    const message = document.getElementById('message').value;

    alert(`Formulario enviado: \nNombre: ${name} \nEmail: ${email} \nModelo: ${model} \nMensaje: ${message}`);
    $('#contactModal').modal('hide');
}

loadVehicles();
