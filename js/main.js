let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let catalogo = [];

document.getElementById("verCatalogoBtn").addEventListener("click", () => {
    document.getElementById("catalogoDiv").classList.toggle("hidden");
});

document.getElementById("comprarProductoBtn").addEventListener("click", () => {
    document.getElementById("comprarDiv").classList.toggle("hidden");
});

document.getElementById("verCarritoBtn").addEventListener("click", verCarrito);
document.getElementById("filtrarBtn").addEventListener("click", filtrarCatalogo);
document.getElementById("comprarBtn").addEventListener("click", comprarProducto);

async function fetchCatalogo() {
    try {
        const response = await axios.get('../archivo.json'); 
        catalogo = response.data;
        console.log('Catálogo cargado:', catalogo);
        actualizarSelectorProductos();
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
    }
}

function filtrarCatalogo() {
    let categoriaSeleccionada = document.getElementById("categoriaSelect").value;
    console.log('Categoría seleccionada:', categoriaSeleccionada);
    
    let productosFiltrados = catalogo.filter(producto => producto.categoria === categoriaSeleccionada);
    console.log('Productos filtrados:', productosFiltrados);
    
    mostrarCatalogo(productosFiltrados);
}


function mostrarCatalogo() {
    let categoriaSeleccionada = document.getElementById("categoriaSelect").value;
    let productosFiltrados = catalogo.filter(producto => producto.categoria === categoriaSeleccionada);

    let productosDiv = document.getElementById("productosCatalogo");
    productosDiv.innerHTML = ""; 
    if (productosFiltrados.length > 0) {
        productosFiltrados.forEach(producto => {
            let productItem = document.createElement("div");
            productItem.className = "product-item";
            
            let img = document.createElement("img");
            img.src = producto.imagen;
            img.alt = producto.nombre;
            img.className = "product-image";

            let p = document.createElement("p");
            p.textContent = `${producto.nombre} - Precio: ${producto.precio}`;

            productItem.appendChild(img);
            productItem.appendChild(p);
            productosDiv.appendChild(productItem);
        });
    } else {
        let p = document.createElement("p");
        p.textContent = "No hay productos disponibles en esta categoría.";
        productosDiv.appendChild(p);
    }
}
function actualizarSelectorProductos() {
    let productoSelect = document.getElementById("productoSelect");
    productoSelect.innerHTML = ""; 

    catalogo.forEach(producto => {
        let option = document.createElement("option");
        option.value = producto.id;
        option.textContent = producto.nombre;
        productoSelect.appendChild(option);
    });
}

function comprarProducto() {
    let productoSeleccionado = parseInt(document.getElementById("productoSelect").value);
    console.log('Producto seleccionado:', productoSeleccionado);
    let productoAComprar = catalogo.find(producto => producto.id === productoSeleccionado);
    console.log('Producto a comprar:', productoAComprar);
    if (productoAComprar) {
        carrito.push(productoAComprar);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarEnDOM(`Usted ha comprado ${productoAComprar.nombre}.`);
    } else {
        mostrarEnDOM("Número de producto no válido. Por favor, ingrese un número válido.");
    }
}

function verCarrito() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    mostrarEnDOM("Productos en el carrito:");
    carrito.forEach(producto => {
        mostrarEnDOM(`${producto.nombre} - Precio: ${producto.precio}`);
    });
}

function mostrarEnDOM(mensaje) {
    let outputDiv = document.getElementById("output");
    let p = document.createElement("p");
    p.textContent = mensaje;
    outputDiv.appendChild(p);
}

document.getElementById("vaciarCarritoBtn").addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    carrito = []; 
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarEnDOM("Carrito vaciado correctamente.");
    
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
}
fetchCatalogo();
