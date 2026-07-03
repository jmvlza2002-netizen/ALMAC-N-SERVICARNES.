const firebaseConfig = {
  apiKey: "AIzaSyDw0LFKBiY6m1E7S4U-Dru0GOdI1icqPoM",
  authDomain: "servicarnes.firebaseapp.com",
  projectId: "servicarnes",
  storageBucket: "servicarnes.firebasestorage.app",
  messagingSenderId: "472598803018",
  appId: "1:472598803018:web:6cca7571b8b7624d0cacb3"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const productosRef = db.collection("productos");

/* =========================
   MODAL
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
        <img id="modalImg" style="max-width:90%;max-height:80%;border-radius:15px;">
    `;

    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.body.appendChild(modal);
}

function verImagen(url) {
    const modal = document.getElementById("modal");
    const img = document.getElementById("modalImg");
    img.src = url;
    modal.style.display = "flex";
}

/* =========================
   RENDER (FIREBASE REALTIME)
========================= */
function render() {
    productosRef.onSnapshot(snapshot => {
        const productos = [];

        snapshot.forEach(doc => {
            productos.push({ id: doc.id, ...doc.data() });
        });

        const contenedor = document.getElementById("productos");
        contenedor.innerHTML = "";

        productos.forEach(p => {
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

                    <button onclick="editar('${p.id}', '${p.nombre}', '${p.codigo}', '${p.imagen}', '${p.almacen}', ${p.existencia})">✏️</button>
                    <button onclick="eliminar('${p.id}')">🗑</button>
                </div>

            </div>
            `;
        });

        document.getElementById("total").textContent = productos.length;
        document.getElementById("existencia").textContent = productos.filter(p => p.existencia).length;
        document.getElementById("agotado").textContent = productos.filter(p => !p.existencia).length;
    });
}

/* =========================
   AGREGAR
========================= */
window.addEventListener("DOMContentLoaded", () => {

    crearModal();

    document.getElementById("agregar").addEventListener("click", async () => {

        const nombre = prompt("Nombre:");
        if (!nombre) return;

        await productosRef.add({
            nombre,
            codigo: prompt("Código:"),
            imagen: prompt("Imagen URL:"),
            almacen: prompt("Almacén:"),
            existencia: confirm("OK = existe / Cancel = agotado")
        });
    });

    render();
});

/* =========================
   EDITAR
========================= */
async function editar(id, nombre, codigo, imagen, almacen, existencia) {

    const nuevoNombre = prompt("Nombre:", nombre);
    if (!nuevoNombre) return;

    await productosRef.doc(id).update({
        nombre: nuevoNombre,
        codigo: prompt("Código:", codigo),
        imagen: prompt("Imagen:", imagen),
        almacen: prompt("Almacén:", almacen),
        existencia: confirm("OK = existe / Cancel = agotado")
    });
}

/* =========================
   ELIMINAR
========================= */
async function eliminar(id) {
    if (!confirm("¿Eliminar producto?")) return;
    await productosRef.doc(id).delete();
}
