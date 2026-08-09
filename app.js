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

    let nfc =
        parametros.get("nfc");


    /*
     * Si no se especificó ningún NFC,
     * usamos el 01 como predeterminado.
     */

    if (!nfc) {

        nfc = "01";

    }


    /*
     * Aseguramos que tenga dos dígitos.
     *
     * 1  → 01
     * 2  → 02
     */

    nfc =
        String(parseInt(nfc, 10))
        .padStart(2, "0");


    numeroNfc.textContent =
        "NFC " + nfc;


    /* =====================================================
       TRANSICIÓN POR DESLIZAMIENTO
       ===================================================== */

    let inicioTouchY = 0;

    let finTouchY = 0;


    document.addEventListener(
        "touchstart",
        function (event) {

            inicioTouchY =
                event.changedTouches[0].screenY;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchend",
        function (event) {

            finTouchY =
                event.changedTouches[0].screenY;

            comprobarDeslizamiento();

        },
        { passive: true }
    );


    function comprobarDeslizamiento() {

        const diferencia =
            inicioTouchY - finTouchY;


        /*
         * Si desliza hacia arriba
         */

        if (diferencia > 70) {

            mostrarMusica();

        }


        /*
         * Si está en la música y desliza hacia abajo,
         * regresamos a la portada.
         */

        if (diferencia < -100 &&
            pantallaMusica.classList.contains("visible")) {

            mostrarInicio();

        }

    }


    /* =====================================================
       TRANSICIÓN
       ===================================================== */

    function mostrarMusica() {

        pantallaInicio.classList.add("salida");

        pantallaMusica.classList.add("visible");

        setTimeout(function () {

            pantallaInicio.style.display =
                "none";

        }, 900);

    }


    function mostrarInicio() {

        pantallaInicio.style.display =
            "flex";

        setTimeout(function () {

            pantallaInicio.classList.remove(
                "salida"
            );

            pantallaMusica.classList.remove(
                "visible"
            );

        }, 20);

    }


    /* =====================================================
       TAMBIÉN PERMITIMOS TOCAR LA FLECHA
       ===================================================== */

    document
        .querySelector(".desliza")
        .addEventListener(
            "click",
            mostrarMusica
        );


    /* =====================================================
       OBTENER CANCIONES DESDE GITHUB
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


        /*
         * Solo MP3
         */

        const canciones =
            archivos.filter(function (archivo) {

                return archivo.type === "file" &&
                       archivo.name
                           .toLowerCase()
                           .endsWith(".mp3");

            });


        /*
         * Orden alfabético
         */

        canciones.sort(function (a, b) {

            return a.name.localeCompare(
                b.name,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        });


        if (canciones.length === 0) {

            mostrarMensaje(
                "Todavía no hay canciones en este NFC."
            );

            return;

        }


        listaCanciones.innerHTML = "";


        canciones.forEach(
            function (cancion, indice) {

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


        /* ---------------------------------------------
           NOMBRE
           --------------------------------------------- */

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
         * Quitamos solamente ".mp3"
         * para mostrarlo.
         *
         * El archivo real NO se modifica.
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


        /* ---------------------------------------------
           AUDIO
           --------------------------------------------- */

        const audio =
            document.createElement("audio");


        /*
         * Usamos la URL proporcionada por GitHub.
         * Así no importa que el nombre tenga:
         *
         * espacios
         * &
         * +
         * !
         * paréntesis
         * etc.
         */

        audio.src =
            archivo.download_url;


        audio.preload =
            "metadata";


        /* ---------------------------------------------
           CONTROLES
           --------------------------------------------- */

        const controles =
            document.createElement("div");

        controles.className =
            "controles";


        /* BOTÓN PLAY */

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


        /* ---------------------------------------------
           ARMAR CONTROLES
           --------------------------------------------- */

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


        /*
         * Ocultamos el reproductor nativo.
         */

        audio.style.display =
            "none";


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
                        function (otroAudio) {

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
                        function (otraTarjeta) {

                            otraTarjeta
                                .classList
                                .remove(
                                    "reproduciendo"
                                );

                        }
                    );


                if (audio.paused) {

                    audio.play();

                } else {

                    audio.pause();

                }

            }
        );


        /* =================================================
           ESTADO PLAY / PAUSE
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
           CUANDO TERMINA
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
       MENSAJE DE ERROR / VACÍO
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
