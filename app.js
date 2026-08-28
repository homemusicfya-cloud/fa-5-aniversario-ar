document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const pantallaInicio =
        document.getElementById("pantallaInicio");

    const pantallaMusica =
        document.getElementById("pantallaMusica");

    const listaCanciones =
        document.getElementById("listaCanciones");

    const numeroNfc =
        document.getElementById("numeroNfc");


    /* =====================================================
       DETECTAR NFC
       ===================================================== */

    const parametros =
        new URLSearchParams(window.location.search);

    let nfc = parametros.get("nfc");

    if (!nfc) {
        nfc = "01";
    }

    nfc = String(parseInt(nfc, 10)).padStart(2, "0");

    numeroNfc.textContent = "NFC " + nfc;


    /* =====================================================
       DESLIZAMIENTO HACIA ARRIBA
       ===================================================== */

    let inicioTouchY = 0;
    let movimientoTouchY = 0;
    let tocando = false;


    pantallaInicio.addEventListener(
        "touchstart",
        function (event) {

            if (event.touches.length !== 1) {
                return;
            }

            inicioTouchY =
                event.touches[0].clientY;

            movimientoTouchY =
                inicioTouchY;

            tocando = true;

        },
        { passive: true }
    );


    pantallaInicio.addEventListener(
        "touchmove",
        function (event) {

            if (!tocando) {
                return;
            }

            movimientoTouchY =
                event.touches[0].clientY;

        },
        { passive: true }
    );


    pantallaInicio.addEventListener(
        "touchend",
        function () {

            if (!tocando) {
                return;
            }

            tocando = false;

            const distancia =
                inicioTouchY - movimientoTouchY;

            if (distancia > 40) {
                mostrarMusica();
            }

        },
        { passive: true }
    );


    /* =====================================================
       MOSTRAR REPRODUCTOR
       ===================================================== */

    function mostrarMusica() {

        if (
            pantallaMusica.classList.contains("visible")
        ) {
            return;
        }

        pantallaInicio.classList.add("salida");

        pantallaMusica.classList.add("visible");

        setTimeout(function () {

            pantallaInicio.style.display = "none";

        }, 900);
    }


    /* =====================================================
       BOTÓN DESLIZA
       ===================================================== */

    const botonDesliza =
        document.querySelector(".desliza");

    if (botonDesliza) {

        botonDesliza.addEventListener(
            "click",
            mostrarMusica
        );

    }


    /* =====================================================
       CONFIGURACIÓN GITHUB
       ===================================================== */

    const repositorio =
        "homemusicfya-cloud/fa-5-aniversario-ar";

    /*
       IMPORTANTE:

       NFC 01 -> experiencias/01
       NFC 02 -> experiencias/02
       NFC 03 -> experiencias/03
       NFC 04 -> experiencias/04
       etc.
    */

    const carpetaNfc =
        `experiencias/${nfc}`;


    /* =====================================================
       BUSCAR TODOS LOS MP3
       ===================================================== */

    async function buscarMp3(
        ruta
    ) {

        const apiURL =
            `https://api.github.com/repos/${repositorio}/contents/${ruta}`;

        const respuesta =
            await fetch(apiURL);

        if (!respuesta.ok) {

            throw new Error(
                `No se pudo acceder a: ${ruta}`
            );

        }

        const archivos =
            await respuesta.json();


        /*
           Si GitHub devuelve un solo archivo
           lo convertimos en arreglo.
        */

        const lista =
            Array.isArray(archivos)
                ? archivos
                : [archivos];


        let canciones = [];


        for (
            const archivo of lista
        ) {


            /* ---------------------------------------------
               SI ES MP3
               --------------------------------------------- */

            if (
                archivo.type === "file" &&
                archivo.name
                    .toLowerCase()
                    .endsWith(".mp3")
            ) {

                canciones.push(archivo);

                continue;

            }


            /* ---------------------------------------------
               SI ES CARPETA
               BUSCAR DENTRO
               --------------------------------------------- */

            if (
                archivo.type === "dir"
            ) {

                try {

                    const cancionesDentro =
                        await buscarMp3(
                            archivo.path
                        );

                    canciones =
                        canciones.concat(
                            cancionesDentro
                        );

                } catch (error) {

                    console.warn(
                        "No se pudo leer:",
                        archivo.path
                    );

                }

            }

        }


        return canciones;

    }


    /* =====================================================
       CARGAR CANCIONES DEL NFC
       ===================================================== */

    try {

        listaCanciones.innerHTML = `
            <div class="cargando">
                <div class="spinner"></div>
                <span>
                    Cargando canciones...
                </span>
            </div>
        `;


        /*
           AQUÍ está el cambio importante:

           Ya NO buscamos solamente:

           experiencias/02/canciones

           Ahora buscamos TODO dentro de:

           experiencias/02

           incluyendo subcarpetas.
        */

        let canciones =
            await buscarMp3(
                carpetaNfc
            );


        /* =================================================
           ORDENAR CANCIONES
           ================================================= */

        canciones.sort(
            function (a, b) {

                return a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );

            }
        );


        /* =================================================
           NO HAY CANCIONES
           ================================================= */

        if (
            canciones.length === 0
        ) {

            mostrarMensaje(
                `No encontramos canciones en NFC ${nfc}.`
            );

            return;

        }


        /* =================================================
           MOSTRAR CANCIONES
           ================================================= */

        listaCanciones.innerHTML = "";


        canciones.forEach(
            function (
                cancion,
                indice
            ) {

                crearCancion(
                    cancion,
                    indice + 1
                );

            }
        );


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudieron cargar las canciones."
        );

    }


    /* =====================================================
       CREAR TARJETA DE CANCIÓN
       ===================================================== */

    function crearCancion(
        archivo,
        numero
    ) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "cancion";


        /* =================================================
           NOMBRE
           ================================================= */

        const nombre =
            document.createElement("div");

        nombre.className =
            "cancion-nombre";


        const numeroElemento =
            document.createElement("span");

        numeroElemento.className =
            "numero-cancion";

        numeroElemento.textContent =
            String(numero).padStart(2, "0");


        const textoNombre =
            document.createElement("span");

        /*
           CONSERVAMOS EL NOMBRE ORIGINAL
           DEL MP3.
        */

        textoNombre.textContent =
            archivo.name.replace(
                /\.mp3$/i,
                ""
            );


        nombre.appendChild(
            numeroElemento
        );

        nombre.appendChild(
            textoNombre
        );


        /* =================================================
           AUDIO
           ================================================= */

        const audio =
            document.createElement("audio");

        audio.src =
            archivo.download_url;

        audio.preload =
            "metadata";

        audio.style.display =
            "none";


        /* =================================================
           CONTROLES
           ================================================= */

        const controles =
            document.createElement("div");

        controles.className =
            "controles";


        /* PLAY */

        const botonPlay =
            document.createElement("button");

        botonPlay.className =
            "boton-play";

        botonPlay.type =
            "button";

        botonPlay.textContent =
            "▶";


        /* BARRA */

        const barraContenedor =
            document.createElement("div");

        barraContenedor.className =
            "barra-contenedor";


        const barra =
            document.createElement("input");

        barra.type =
            "range";

        barra.className =
            "barra";

        barra.min =
            "0";

        barra.max =
            "100";

        barra.value =
            "0";

        barra.step =
            "0.1";


        /* TIEMPOS */

        const tiempos =
            document.createElement("div");

        tiempos.className =
            "tiempos";


        const tiempoActual =
            document.createElement("span");

        tiempoActual.textContent =
            "0:00";


        const tiempoTotal =
            document.createElement("span");

        tiempoTotal.textContent =
            "0:00";


        tiempos.appendChild(
            tiempoActual
        );

        tiempos.appendChild(
            tiempoTotal
        );


        barraContenedor.appendChild(
            barra
        );

        barraContenedor.appendChild(
            tiempos
        );


        /* VOLUMEN */

        const volumen =
            document.createElement("input");

        volumen.type =
            "range";

        volumen.className =
            "volumen";

        volumen.min =
            "0";

        volumen.max =
            "1";

        volumen.step =
            "0.01";

        volumen.value =
            "0.8";


        /* ARMAR TARJETA */

        controles.appendChild(
            botonPlay
        );

        controles.appendChild(
            barraContenedor
        );

        controles.appendChild(
            volumen
        );


        tarjeta.appendChild(
            nombre
        );

        tarjeta.appendChild(
            controles
        );

        tarjeta.appendChild(
            audio
        );


        listaCanciones.appendChild(
            tarjeta
        );


        /* =================================================
           PLAY / PAUSE
           ================================================= */

        botonPlay.addEventListener(
            "click",
            function () {


                /*
                   Detener todas las demás.
                */

                document
                    .querySelectorAll(
                        ".cancion audio"
                    )
                    .forEach(
                        function (
                            otroAudio
                        ) {

                            if (
                                otroAudio !== audio
                            ) {

                                otroAudio.pause();

                                otroAudio.currentTime =
                                    0;

                            }

                        }
                    );


                document
                    .querySelectorAll(
                        ".cancion"
                    )
                    .forEach(
                        function (
                            otraTarjeta
                        ) {

                            otraTarjeta
                                .classList
                                .remove(
                                    "reproduciendo"
                                );

                        }
                    );


                if (
                    audio.paused
                ) {

                    audio.play();

                } else {

                    audio.pause();

                }

            }
        );


        /* =================================================
           PLAY
           ================================================= */

        audio.addEventListener(
            "play",
            function () {

                botonPlay.textContent =
                    "❚❚";

                tarjeta.classList.add(
                    "reproduciendo"
                );

            }
        );


        /* =================================================
           PAUSA
           ================================================= */

        audio.addEventListener(
            "pause",
            function () {

                botonPlay.textContent =
                    "▶";

                tarjeta.classList.remove(
                    "reproduciendo"
                );

            }
        );


        /* =================================================
           DURACIÓN
           ================================================= */

        audio.addEventListener(
            "loadedmetadata",
            function () {

                tiempoTotal.textContent =
                    formatearTiempo(
                        audio.duration
                    );

            }
        );


        /* =================================================
           PROGRESO
           ================================================= */

        audio.addEventListener(
            "timeupdate",
            function () {

                if (
                    !audio.duration ||
                    isNaN(audio.duration)
                ) {

                    return;

                }


                const porcentaje =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;


                barra.value =
                    porcentaje;


                tiempoActual.textContent =
                    formatearTiempo(
                        audio.currentTime
                    );

            }
        );


        /* =================================================
           BARRA DE PROGRESO
           ================================================= */

        barra.addEventListener(
            "input",
            function () {

                if (
                    !audio.duration ||
                    isNaN(audio.duration)
                ) {

                    return;

                }


                audio.currentTime =
                    (
                        barra.value / 100
                    ) *
                    audio.duration;

            }
        );


        /* =================================================
           VOLUMEN
           ================================================= */

        volumen.addEventListener(
            "input",
            function () {

                audio.volume =
                    volumen.value;

            }
        );


        /* =================================================
           TERMINÓ
           ================================================= */

        audio.addEventListener(
    "ended",
    function () {

        botonPlay.textContent = "▶";

        tarjeta.classList.remove(
            "reproduciendo"
        );

        barra.value = "0";


        /* =================================================
           REPRODUCCIÓN AUTOMÁTICA DEL ÁLBUM
           ================================================= */

        const tarjetas =
            Array.from(
                listaCanciones.querySelectorAll(
                    ".cancion"
                )
            );


        const posicionActual =
            tarjetas.indexOf(tarjeta);


        if (posicionActual === -1) {
            return;
        }


        /*
           Si hay una siguiente canción,
           reproducirla.

           Si terminó la última,
           volver a la primera.
        */

        let siguientePosicion =
            posicionActual + 1;


        if (
            siguientePosicion >=
            tarjetas.length
        ) {

            siguientePosicion = 0;

        }


        const siguienteTarjeta =
            tarjetas[siguientePosicion];


        const siguienteAudio =
            siguienteTarjeta.querySelector(
                "audio"
            );


        const siguienteBoton =
            siguienteTarjeta.querySelector(
                ".boton-play"
            );


        if (
            siguienteAudio &&
            siguienteBoton
        ) {

            siguienteAudio.currentTime = 0;

            siguienteAudio.play();

        }

    }
);


    /* =====================================================
       FORMATO DEL TIEMPO
       ===================================================== */

    function formatearTiempo(
        segundos
    ) {

        if (
            !segundos ||
            isNaN(segundos)
        ) {

            return "0:00";

        }


        const minutos =
            Math.floor(
                segundos / 60
            );


        const segundosRestantes =
            Math.floor(
                segundos % 60
            );


        return (
            minutos +
            ":" +
            String(
                segundosRestantes
            ).padStart(2, "0")
        );

    }


    /* =====================================================
       MENSAJE
       ===================================================== */

    function mostrarMensaje(
        mensaje
    ) {

        listaCanciones.innerHTML = "";


        const elemento =
            document.createElement("div");

        elemento.className =
            "cargando";

        elemento.textContent =
            mensaje;


        listaCanciones.appendChild(
            elemento
        );

    }

});
