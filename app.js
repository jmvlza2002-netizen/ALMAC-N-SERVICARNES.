let productos = JSON.parse(localStorage.getItem("productos")) || [];

/* =========================
   GUARDAR EN LOCALSTORAGE
========================= */
function guardar() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

/* =========================
   MODAL IMAGEN
========================= */
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
        <img id="modalImg" style="
            max-width:90%;
            max-height:80%;
            border-radius:15px;
            box-shadow:0 0 20px black;
        ">
    `;

    modal.addEventListener("click", () => {
        modal.style.display = "none";
        document.getElementById("modalImg").src = "";
    });

    document.body.appendChild(modal);
}

/* =========================
   VER IMAGEN
========================= */
function verImagen(url) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");

    modalImg.src = url;
    modal.style.display = "flex";
}

/* =========================
   RENDER
========================= */
function render(lista = productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    lista.forEach((p, index) => {
        contenedor.innerHTML += `
        <div class="producto">

            <img src="${p.imagen || 'https://via.placeholder.com/600x300'}"
                 style="cursor:pointer"
                 onclick="verImagen('${p.imagen || 'https://via.placeholder.com/600x300'}')">

            <div class="info">
                <h2>${p.nombre}</h2>
                <div class="codigo">Código: ${p.codigo}</div>
                <div>Almacén: ${p.almacen}</div>

                <div class="estado ${p.existencia ? 'existencia' : 'agotado'}">
                    ${p.existencia ? "En existencia" : "Agotado"}
                </div>

                <button onclick="editar(${index})">✏️ Editar</button>
                <button onclick="eliminar(${index})">🗑 Eliminar</button>
            </div>

        </div>
        `;
    });

    actualizarEstadisticas(lista);
}

/* =========================
   ESTADÍSTICAS
========================= */
function actualizarEstadisticas(lista) {
    document.getElementById("total").textContent = lista.length;
    document.getElementById("existencia").textContent = lista.filter(p => p.existencia).length;
    document.getElementById("agotado").textContent = lista.filter(p => !p.existencia).length;
}

/* =========================
   AGREGAR
========================= */
window.addEventListener("DOMContentLoaded", () => {

    crearModal();

    const btn = document.getElementById("agregar");

    if (btn) {
        btn.addEventListener("click", () => {

            const nombre = prompt("Nombre del producto:");
            if (!nombre) return;

            const codigo = prompt("Código del producto:");
            const imagen = prompt("URL de imagen (opcional):");
            const almacen = prompt("Almacén (Almacén 1-4):");
            const existencia = confirm("OK = En existencia / Cancel = Agotado");

            productos.push({
                nombre,
                codigo,
                imagen,
                almacen,
                existencia
            });

            guardar();
            render();
        });
    }

});

/* =========================
   EDITAR PRODUCTO
========================= */
function editar(index) {
    const p = productos[index];

    const nombre = prompt("Editar nombre:", p.nombre);
    if (!nombre) return;

    const codigo = prompt("Editar código:", p.codigo);
    const imagen = prompt("Editar imagen URL:", p.imagen);
    const almacen = prompt("Editar almacén:", p.almacen);
    const existencia = confirm("OK = En existencia / Cancel = Agotado");

    productos[index] = {
        ...p,
        nombre,
        codigo,
        imagen,
        almacen,
        existencia
    };

    guardar();
    render();
}

/* =========================
   ELIMINAR (CON CONFIRMACIÓN)
========================= */
function eliminar(index) {
    const confirmar = confirm("¿Seguro que quieres eliminar este producto?");

    if (!confirmar) return;

    productos.splice(index, 1);
    guardar();
    render();
}

/* =========================
   BÚSQUEDA
========================= */
document.getElementById("buscar").addEventListener("input", (e) => {
    const valor = e.target.value.toLowerCase();

    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(valor) ||
        p.codigo.toLowerCase().includes(valor)
    );

    render(filtrados);
});

/* =========================
   FILTRO ALMACÉN
========================= */
document.getElementById("almacen").addEventListener("change", (e) => {
    const valor = e.target.value;

    if (valor === "Todos") {
        render();
    } else {
        const filtrados = productos.filter(p => p.almacen === valor);
        render(filtrados);
    }
});

/* =========================
   INICIO
========================= */
render();
