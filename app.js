let productos = JSON.parse(localStorage.getItem("productos")) || [];

function guardar() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

/* MODAL */
function crearModal() {
    if (document.getElementById("modal")) return;

    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.cssText = `
        display:none;
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.85);
        justify-content:center;
        align-items:center;
        z-index:999;
    `;

    modal.innerHTML = `
        <img id="modalImg" style="max-width:90%;max-height:80%;border-radius:15px;">
    `;

    modal.addEventListener("click", () => {
        modal.style.display = "none";
        document.getElementById("modalImg").src = "";
    });

    document.body.appendChild(modal);
}

function verImagen(url) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");

    modalImg.src = url;
    modal.style.display = "flex";
}

/* RENDER */
function render(lista = productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    lista.forEach((p, index) => {
        contenedor.innerHTML += `
        <div class="producto">

            <img src="${p.imagen || 'https://via.placeholder.com/600x300'}"
                 style="cursor:pointer"
                 onclick="verImagen('${p.imagen || ''}')">

            <div class="info">
                <h2>${p.nombre}</h2>
                <div class="codigo">${p.codigo}</div>
                <div>${p.almacen}</div>

                <div class="estado ${p.existencia ? 'existencia' : 'agotado'}">
                    ${p.existencia ? "En existencia" : "Agotado"}
                </div>

                <button onclick="editar(${index})">✏️</button>
                <button onclick="eliminar(${index})">🗑</button>
            </div>

        </div>
        `;
    });

    actualizarEstadisticas(lista);
}

function actualizarEstadisticas(lista) {
    document.getElementById("total").textContent = lista.length;
    document.getElementById("existencia").textContent = lista.filter(p => p.existencia).length;
    document.getElementById("agotado").textContent = lista.filter(p => !p.existencia).length;
}

/* AGREGAR */
window.addEventListener("DOMContentLoaded", () => {

    crearModal();

    document.getElementById("agregar").addEventListener("click", () => {

        const nombre = prompt("Nombre:");
        if (!nombre) return;

        productos.push({
            nombre,
            codigo: prompt("Código:"),
            imagen: prompt("Imagen URL:"),
            almacen: prompt("Almacén:"),
            existencia: confirm("OK = existe / Cancel = agotado")
        });

        guardar();
        render();
    });
});

/* EDITAR */
function editar(index) {
    const p = productos[index];

    productos[index] = {
        ...p,
        nombre: prompt("Nombre:", p.nombre),
        codigo: prompt("Código:", p.codigo),
        imagen: prompt("Imagen:", p.imagen),
        almacen: prompt("Almacén:", p.almacen),
        existencia: confirm("OK = existe / Cancel = agotado")
    };

    guardar();
    render();
}

/* ELIMINAR */
function eliminar(index) {
    if (!confirm("¿Eliminar producto?")) return;

    productos.splice(index, 1);
    guardar();
    render();
}

/* FILTROS */
document.getElementById("buscar").addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    render(productos.filter(p =>
        p.nombre.toLowerCase().includes(v) ||
        p.codigo.toLowerCase().includes(v)
    ));
});

document.getElementById("almacen").addEventListener("change", e => {
    if (e.target.value === "Todos") return render();
    render(productos.filter(p => p.almacen === e.target.value));
});

render();
