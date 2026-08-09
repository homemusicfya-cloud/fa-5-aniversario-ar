document.addEventListener("DOMContentLoaded", function () {

    const lista = document.getElementById("listaCanciones");

    /*
     * Por ahora estamos trabajando con NFC 01.
     */

    const carpeta = "experiencias/01/canciones/";

    const canciones = [];

    for (let i = 1; i <= 10; i++) {

        const numero = String(i).padStart(2, "0");

        canciones.push({
            nombre: "Canción " + numero,
            archivo: carpeta + numero + ".mp3"
        });

    }

    lista.innerHTML = "";

    canciones.forEach(function (cancion) {

        const contenedor = document.createElement("div");

        contenedor.className = "cancion";

        const nombre = document.createElement("div");

        nombre.className = "cancion-nombre";

        nombre.textContent = "🎵 " + cancion.nombre;

        const reproductor = document.createElement("audio");

        reproductor.controls = true;

        reproductor.preload = "none";

        reproductor.src = cancion.archivo;

        contenedor.appendChild(nombre);

        contenedor.appendChild(reproductor);

        lista.appendChild(contenedor);

    });

});
