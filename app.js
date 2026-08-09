document.addEventListener(
    "DOMContentLoaded",
    async function () {


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const pantallaInicio =
        document.getElementById(
            "pantallaInicio"
        );


    const pantallaMusica =
        document.getElementById(
            "pantallaMusica"
        );


    const listaCanciones =
        document.getElementById(
            "listaCanciones"
        );


    const numeroNfc =
        document.getElementById(
            "numeroNfc"
        );


    /* =====================================================
       DETECTAR NFC
       ===================================================== */

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    let nfc =
        parametros.get("nfc");


    if (!nfc) {

        nfc = "01";

    }


    nfc =
        String(
            parseInt(nfc, 10)
        ).padStart(2, "0");


    numeroNfc.textContent =
        "NFC " + nfc;


    /* =====================================================
       TRANSICIÓN POR DESLIZAMIENTO
       ===================================================== */

    let inicioTouchY = 0;

    let movimientoTouchY = 0;

    let tocando = false;


    pantallaInicio.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            inicioTouchY =
                event.touches[0].clientY;


            movimientoTouchY =
                inicioTouchY;


            tocando = true;

        },
        {
            passive: true
        }
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
        {
            passive: true
        }
    );


    pantallaInicio.addEventListener(
        "touchend",
        function () {

            if (!tocando) {
                return;
            }


            tocando = false;


            const distancia =
                inicioTouchY -
                movimientoTouchY;


            if (distancia > 40) {

                mostrarMusica();

            }

        },
        {
            passive: true
        }
    );


    pantallaInicio.addEventListener(
        "touchcancel",
        function () {

            tocando = false;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TRANSICIÓN A MÚSICA
       ===================================================== */

    function mostrarMusica() {


        if (
            pantallaMusica.classList
                .contains("visible")
        ) {

            return;

        }


        pantallaInicio.classList.add(
            "salida"
        );


        pantallaMusica.classList.add(
            "visible"
        );


        setTimeout(
            function () {

                pantallaInicio.style.display =
                    "none";

            },
            900
        );

    }


    /* =====================================================
       REGRESAR A PORTADA
       ===================================================== */

    function mostrarInicio() {


        pantallaInicio.style.display =
            "flex";


        pantallaMusica.classList.remove(
            "visible"
        );


        setTimeout(
            function () {

                pantallaInicio.classList.remove(
                    "salida"
                );

            },
            20
        );

    }


    /* =====================================================
       BOTÓN DESLIZA
       ===================================================== */

    const botonDesliza =
        document.querySelector(
            ".desliza"
        );


    if (botonDesliza) {

        botonDesliza.addEventListener(
            "click",
            mostrarMusica
        );

    }


    /* =====================================================
       GITHUB
       ===================================================== */

    const repositorio =
        "homemusicfya-cloud/fa-5-aniversario-ar";


    const ruta =
        `experiencias/${nfc}/canciones`;


    const apiURL =
        `https://api.github.com/repos/${repositorio}/contents/${ruta}`;


    try {


        const respuesta =
            await fetch(apiURL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las canciones."
            );

        }


        const archivos =
            await respuesta.json();


        /* SOLO MP3 */

        const canciones =
            archivos.filter(
                function (archivo) {

                    return (
                        archivo.type === "file" &&
                        archivo.name
                            .toLowerCase()
                            .endsWith(".mp3")
                    );

                }
            );


        /* ORDEN */

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


        if (
            canciones.length === 0
        ) {

            mostrarMensaje(
                "Todavía no hay canciones en este NFC."
            );

            return;

        }


        listaCanciones.innerHTML =
            "";


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
       CREAR CANCIÓN
       ===================================================== */

    function crearCancion(
        archivo,
        numero
    ) {


        const tarjeta =
            document.createElement(
                "div"
            );


        tarjeta.className =
            "cancion";


        /* =================================================
           NOMBRE
           ================================================= */

        const nombre =
            document.createElement(
                "div"
            );


        nombre.className =
            "cancion-nombre";


        const numeroElemento =
            document.createElement(
                "span"
            );


        numeroElemento.className =
            "numero-cancion";


        numeroElemento.textContent =
            String(numero)
                .padStart(2, "0");


        const textoNombre =
            document.createElement(
                "span"
            );


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
            document.createElement(
                "audio"
            );


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
            document.createElement(
                "div"
            );


        controles.className =
            "controles";


        /* PLAY */

        const botonPlay =
            document.createElement(
                "button"
            );


        botonPlay.className =
            "boton-play";


        botonPlay.type =
            "button";


        botonPlay.textContent =
            "▶";


        /* BARRA */

        const barraContenedor =
            document.createElement(
                "div"
            );


        barraContenedor.className =
            "barra-contenedor";


        const barra =
            document.createElement(
                "input"
            );


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
            document.createElement(
                "div"
            );


        tiempos.className =
            "tiempos";


        const tiempoActual =
            document.createElement(
                "span"
            );


        tiempoActual.textContent =
            "0:00";


        const tiempoTotal =
            document.createElement(
                "span"
            );


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
            document.createElement(
                "input"
            );


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


        /* ARMAR */

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
                 * Detener las demás canciones.
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
                                otroAudio !==
                                audio
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
           BARRA
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

                botonPlay.textContent =
                    "▶";


                tarjeta.classList.remove(
                    "reproduciendo"
                );


                barra.value =
                    "0";

            }
        );

    }


    /* =====================================================
       FORMATEAR TIEMPO
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


        listaCanciones.innerHTML =
            "";


        const elemento =
            document.createElement(
                "div"
            );


        elemento.className =
            "cargando";


        elemento.textContent =
            mensaje;


        listaCanciones.appendChild(
            elemento
        );

    }


});
