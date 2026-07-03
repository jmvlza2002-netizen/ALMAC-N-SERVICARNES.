let productos = JSON.parse(localStorage.getItem("productos")) || [];

/* =========================
   GUARDAR EN LOCALSTORAGE
========================= */
function guardar() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

/* =========================
   RENDER DE PRODUCTOS
========================= */
function render(lista = productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    lista.forEach((p, index) => {
        contenedor.innerHTML += `
        <div class="producto">
            <img src="${p.imagen || 'https://via.placeholder.com/600x300'}">

            <div class="info">
                <h2>${p.nombre}</h2>
                <div class="codigo">Código: ${p.codigo}</div>
                <div>Almacén: ${p.almacen}</div>

                <div class="estado ${p.existencia ? 'existencia' : 'agotado'}">
                    ${p.existencia ? "En existencia" : "Agotado"}
                </div>

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
   AGREGAR PRODUCTO (SEGURO)
========================= */
window.addEventListener("DOMContentLoaded", () => {

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
   ELIMINAR PRODUCTO
========================= */
function eliminar(index) {
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
   FILTRO POR ALMACÉN
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
