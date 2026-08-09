document.addEventListener("DOMContentLoaded", function () {

    const lista = document.getElementById("listaCanciones");

    const carpeta = "experiencias/01/canciones/";

    const canciones = [
        "Megadeth - Killing ls My Business... and Business Is Good! - 01 - Last Rites + Loved to Death.mp3"
    ];

    lista.innerHTML = "";

    canciones.forEach(function (archivo) {

        const contenedor = document.createElement("div");

        contenedor.className = "cancion";

        const nombre = document.createElement("div");

        nombre.className = "cancion-nombre";

        // Quitamos .mp3 solamente para mostrarlo
        const nombreMostrar = archivo.replace(/\.mp3$/i, "");

        nombre.textContent = "🎵 " + nombreMostrar;

        const reproductor = document.createElement("audio");

        reproductor.controls = true;

        reproductor.preload = "none";

        reproductor.src = carpeta + encodeURIComponent(archivo);

        contenedor.appendChild(nombre);

        contenedor.appendChild(reproductor);

        lista.appendChild(contenedor);

    });

});
