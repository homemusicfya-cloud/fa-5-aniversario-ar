/* =========================================================
   SMART ALBUM - 5TO ANIVERSARIO F&A
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           ELEMENTOS
           ================================================= */

        const inicio =
            document.getElementById(
                "pantallaInicio"
            );


        const musica =
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


        const video =
            document.getElementById(
                "videoVinilo"
            );


        const canvas =
            document.getElementById(
                "canvasVinilo"
            );


        const portada =
            document.getElementById(
                "portadaAlbum"
            );


        /* =================================================
           NFC
           ================================================= */

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
                parseInt(
                    nfc,
                    10
                )
            ).padStart(
                2,
                "0"
            );


        numeroNfc.textContent =
            nfc;


        /* =================================================
           PORTADA
           ================================================= */

        cargarPortada();


        function cargarPortada() {

            const jpg =
                `portadas/${nfc}.jpg`;

            const png =
                `portadas/${nfc}.png`;

            const webp =
                `portadas/${nfc}.webp`;


            portada.src =
                jpg;


            portada.onerror =
                function () {

                    if (
                        portada.src.endsWith(
                            ".jpg"
                        )
                    ) {

                        portada.src =
                            png;

                        return;

                    }


                    if (
                        portada.src.endsWith(
                            ".png"
                        )
                    ) {

                        portada.src =
                            webp;

                        return;

                    }


                    console.warn(
                        "No se encontró portada para NFC",
                        nfc
                    );

                };

        }


        /* =================================================
           DESLIZAMIENTO
           ================================================= */

        let inicioY = 0;

        let finalY = 0;

        let tocando = false;


        inicio.addEventListener(
            "touchstart",
            function (event) {

                if (
                    event.touches.length !== 1
                ) {

                    return;

                }


                inicioY =
                    event.touches[0].clientY;

                finalY =
                    inicioY;

                tocando = true;

            },
            {
                passive: true
            }
        );


        inicio.addEventListener(
            "touchmove",
            function (event) {

                if (!tocando) {

                    return;

                }


                finalY =
                    event.touches[0].clientY;

            },
            {
                passive: true
            }
        );


        inicio.addEventListener(
            "touchend",
            function () {

                if (!tocando) {

                    return;

                }


                tocando = false;


                const distancia =
                    inicioY - finalY;


                if (
                    distancia > 40
                ) {

                    mostrarMusica();

                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           MOSTRAR MÚSICA
           ================================================= */

        function mostrarMusica() {

            inicio.classList.add(
                "salida"
            );


            musica.classList.add(
                "visible"
            );


            setTimeout(
                function () {

                    inicio.style.display =
                        "none";

                },
                900
            );

        }


        /* =================================================
           VIDEO / CANVAS
           ================================================= */

        iniciarVideo();


        function iniciarVideo() {

            if (
                !video ||
                !canvas
            ) {

                return;

            }


            const ctx =
                canvas.getContext(
                    "2d",
                    {
                        willReadFrequently:
                            true
                    }
                );


            function prepararCanvas() {

                if (
                    video.videoWidth === 0 ||
                    video.videoHeight === 0
                ) {

                    return;

                }


                canvas.width =
                    video.videoWidth;


                canvas.height =
                    video.videoHeight;

            }


            function procesarFrame() {

                if (
                    video.readyState < 2
                ) {

                    solicitarFrame();

                    return;

                }


                if (
                    canvas.width !==
                    video.videoWidth ||

                    canvas.height !==
                    video.videoHeight
                ) {

                    prepararCanvas();

                }


                ctx.drawImage(
                    video,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                let frame =
                    ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );


                let datos =
                    frame.data;


                /*
                   Eliminamos los colores
                   verde y azul del MP4.

                   La portada queda encima
                   del área correspondiente.
                */

                for (
                    let i = 0;
                    i < datos.length;
                    i += 4
                ) {


                    const r =
                        datos[i];


                    const g =
                        datos[i + 1];


                    const b =
                        datos[i + 2];


                    /* -------------------------------------
                       VERDE
                       ------------------------------------- */

                    const verde =
                        g > 130 &&
                        g > r * 1.25 &&
                        g > b * 1.20;


                    /* -------------------------------------
                       AZUL
                       ------------------------------------- */

                    const azul =
                        b > 100 &&
                        b > r * 1.20 &&
                        b > g * 1.05;


                    if (
                        verde ||
                        azul
                    ) {

                        datos[i + 3] =
                            0;

                    }

                }


                ctx.putImageData(
                    frame,
                    0,
                    0
                );


                solicitarFrame();

            }


            function solicitarFrame() {

                if (
                    "requestVideoFrameCallback"
                    in HTMLVideoElement.prototype
                ) {

                    video.requestVideoFrameCallback(
                        function () {

                            procesarFrame();

                        }
                    );

                } else {

                    requestAnimationFrame(
                        procesarFrame
                    );

                }

            }


            video.addEventListener(
                "loadedmetadata",
                function () {

                    prepararCanvas();

                }
            );


            video.addEventListener(
                "canplay",
                function () {

                    prepararCanvas();


                    video.play()
                        .catch(
                            function () {

                                console.log(
                                    "El video espera interacción."
                                );

                            }
                        );


                    solicitarFrame();

                },
                {
                    once: true
                }
            );


            video.play()
                .then(
                    function () {

                        prepararCanvas();

                        solicitarFrame();

                    }
                )
                .catch(
                    function () {

                        console.log(
                            "Autoplay bloqueado."
                        );

                    }
                );

        }


        /* =================================================
           GITHUB
           ================================================= */

        const repositorio =
            "homemusicfya-cloud/fa-5-aniversario-ar";


        const carpeta =
            `experiencias/${nfc}`;


        /* =================================================
           BUSCAR MP3
           ================================================= */

        async function buscarMp3(
            ruta
        ) {

            const url =
                `https://api.github.com/repos/${repositorio}/contents/${ruta}`;


            const respuesta =
                await fetch(url);


            if (!respuesta.ok) {

                throw new Error(
                    "No se pudo leer " + ruta
                );

            }


            const elementos =
                await respuesta.json();


            const lista =
                Array.isArray(
                    elementos
                )
                    ? elementos
                    : [elementos];


            let canciones = [];


            for (
                const elemento of lista
            ) {


                /* -----------------------------------------
                   MP3
                   ----------------------------------------- */

                if (
                    elemento.type === "file" &&

                    elemento.name
                        .toLowerCase()
                        .endsWith(".mp3")
                ) {

                    canciones.push(
                        elemento
                    );

                    continue;

                }


                /* -----------------------------------------
                   CARPETA
                   ----------------------------------------- */

                if (
                    elemento.type === "dir"
                ) {

                    try {

                        const dentro =
                            await buscarMp3(
                                elemento.path
                            );


                        canciones =
                            canciones.concat(
                                dentro
                            );

                    } catch (
                        error
                    ) {

                        console.warn(
                            elemento.path,
                            error
                        );

                    }

                }

            }


            return canciones;

        }


        /* =================================================
           CARGAR CANCIONES
           ================================================= */

        cargarCanciones();


        async function cargarCanciones() {

            try {


                listaCanciones.innerHTML = `

                    <div class="cargando">

                        Cargando canciones...

                    </div>

                `;


                let canciones =
                    await buscarMp3(
                        carpeta
                    );


                /* -----------------------------------------
                   ORDENAR
                   ----------------------------------------- */

                canciones.sort(
                    function (
                        a,
                        b
                    ) {

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

                    listaCanciones.innerHTML = `

                        <div class="cargando">

                            No encontramos canciones
                            para este NFC.

                        </div>

                    `;

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
                            indice
                        );

                    }
                );


            } catch (
                error
            ) {

                console.error(
                    error
                );


                listaCanciones.innerHTML = `

                    <div class="cargando">

                        No se pudieron cargar
                        las canciones.

                    </div>

                `;

            }

        }


        /* =================================================
           CREAR CANCIÓN
           ================================================= */

        function crearCancion(
            archivo,
            indice
        ) {


            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "cancion";


            /* ---------------------------------------------
               NOMBRE
               --------------------------------------------- */

            const nombre =
                document.createElement(
                    "div"
                );


            nombre.className =
                "cancion-nombre";


            const numero =
                document.createElement(
                    "span"
                );


            numero.className =
                "numero-cancion";


            numero.textContent =
                String(
                    indice + 1
                ).padStart(
                    2,
                    "0"
                );


            const titulo =
                document.createElement(
                    "span"
                );


            titulo.textContent =
                archivo.name.replace(
                    /\.mp3$/i,
                    ""
                );


            nombre.appendChild(
                numero
            );


            nombre.appendChild(
                titulo
            );


            /* ---------------------------------------------
               AUDIO
               --------------------------------------------- */

            const audio =
                document.createElement(
                    "audio"
                );


            audio.src =
                archivo.download_url;


            audio.preload =
                "metadata";


            audio.volume =
                0.8;


            audio.style.display =
                "none";


            /* ---------------------------------------------
               CONTROLES
               --------------------------------------------- */

            const controles =
                document.createElement(
                    "div"
                );


            controles.className =
                "controles";


            /* PLAY */

            const boton =
                document.createElement(
                    "button"
                );


            boton.className =
                "boton-play";


            boton.type =
                "button";


            boton.textContent =
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


            const actual =
                document.createElement(
                    "span"
                );


            actual.textContent =
                "0:00";


            const total =
                document.createElement(
                    "span"
                );


            total.textContent =
                "0:00";


            tiempos.appendChild(
                actual
            );


            tiempos.appendChild(
                total
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


            /* ---------------------------------------------
               ARMAR
               --------------------------------------------- */

            controles.appendChild(
                boton
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
               PLAY
               ================================================= */

            boton.addEventListener(
                "click",
                function () {

                    detenerOtras(
                        audio
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

                    boton.textContent =
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

                    boton.textContent =
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

                    total.textContent =
                        formatoTiempo(
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
                        isNaN(
                            audio.duration
                        )
                    ) {

                        return;

                    }


                    barra.value =
                        (
                            audio.currentTime /
                            audio.duration
                        ) * 100;


                    actual.textContent =
                        formatoTiempo(
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
                        !audio.duration
                    ) {

                        return;

                    }


                    audio.currentTime =
                        (
                            barra.value /
                            100
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
               TERMINÓ LA CANCIÓN
               ================================================= */

            audio.addEventListener(
                "ended",
                function () {

                    boton.textContent =
                        "▶";


                    tarjeta.classList.remove(
                        "reproduciendo"
                    );


                    barra.value =
                        "0";


                    reproducirSiguiente(
                        tarjeta
                    );

                }
            );

        }


        /* =================================================
           DETENER OTRAS CANCIONES
           ================================================= */

        function detenerOtras(
            audioActual
        ) {

            const audios =
                document.querySelectorAll(
                    ".cancion audio"
                );


            audios.forEach(
                function (
                    audio
                ) {

                    if (
                        audio !==
                        audioActual
                    ) {

                        audio.pause();

                        audio.currentTime =
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
                        tarjeta
                    ) {

                        tarjeta.classList.remove(
                            "reproduciendo"
                        );

                    }
                );

        }


        /* =================================================
           SIGUIENTE CANCIÓN
           ================================================= */

        function reproducirSiguiente(
            tarjetaActual
        ) {

            const tarjetas =
                Array.from(
                    document.querySelectorAll(
                        ".cancion"
                    )
                );


            if (
                tarjetas.length === 0
            ) {

                return;

            }


            const posicion =
                tarjetas.indexOf(
                    tarjetaActual
                );


            if (
                posicion === -1
            ) {

                return;

            }


            let siguiente =
                posicion + 1;


            /*
               Si terminó la última,
               regresamos a la primera.
            */

            if (
                siguiente >=
                tarjetas.length
            ) {

                siguiente = 0;

            }


            const siguienteTarjeta =
                tarjetas[siguiente];


            const siguienteAudio =
                siguienteTarjeta.querySelector(
                    "audio"
                );


            if (
                !siguienteAudio
            ) {

                return;

            }


            detenerOtras(
                siguienteAudio
            );


            siguienteAudio.currentTime =
                0;


            siguienteAudio.play()
                .catch(
                    function (
                        error
                    ) {

                        console.warn(
                            "No se pudo reproducir automáticamente:",
                            error
                        );

                    }
                );

        }


        /* =================================================
           FORMATO DE TIEMPO
           ================================================= */

        function formatoTiempo(
            segundos
        ) {

            if (
                !segundos ||
                isNaN(
                    segundos
                )
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
                ).padStart(
                    2,
                    "0"
                )
            );

        }


    }
);
