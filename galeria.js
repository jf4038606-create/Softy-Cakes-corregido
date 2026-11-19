document.addEventListener("DOMContentLoaded", () => {

    /* 1. ELEMENTOS DEL CARRUSEL */

    const carrusel =
        document.querySelector("#carrusel-videos") ||
        document.querySelector(".videos-galeria") ||
        document.querySelector(".seccion-videos-galeria");

    const botonAnterior = document.querySelector(".anterior-carrusel");
    const botonSiguiente = document.querySelector(".siguiente-carrusel");

    const tarjetas = document.querySelectorAll(
        ".video-card, .tarjeta-video"
    );


    /* 2. ELEMENTOS DEL MODAL */

    const modal =
        document.getElementById("modal-video") ||
        document.querySelector(".modal-reproductor-galeria") ||
        document.querySelector(".modal-video");

    const reproductor =
        document.getElementById("video-reproductor") ||
        modal?.querySelector("video");

    const botonCerrar =
        document.getElementById("cerrar-modal") ||
        modal?.querySelector(
            ".cerrar-modal, .boton-cerrar-modal"
        );

    let ultimoBotonActivo = null;
    let overflowHtmlAnterior = "";
    let overflowBodyAnterior = "";


    /* 3. PREPARAR EL MODAL */

    // Colocar el modal directamente en body para evitar
    // que quede detrás del footer o dentro de otro contenedor.

    if (modal) {

        if (
            !modal.classList.contains("modal-video") &&
            !modal.classList.contains("modal-reproductor-galeria")
        ) {
            modal.classList.add("modal-reproductor-galeria");
        }

        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }

        if (!modal.classList.contains("activo")) {
            modal.setAttribute("aria-hidden", "true");
        }
    }


    /* 4. CALCULAR EL DESPLAZAMIENTO DEL CARRUSEL */

    function calcularDesplazamiento() {

        if (!carrusel) return 320;

        const tarjeta = carrusel.querySelector(
            ".video-card, .tarjeta-video"
        );

        if (!tarjeta) {
            return carrusel.clientWidth * 0.8;
        }

        const estilos = window.getComputedStyle(carrusel);

        const espacio =
            parseFloat(estilos.columnGap) ||
            parseFloat(estilos.gap) ||
            0;

        return tarjeta.getBoundingClientRect().width + espacio;
    }


    /* 5. ACTUALIZAR LAS FLECHAS */

    function actualizarControles() {

        if (!carrusel) return;

        const maximo = Math.max(
            0,
            carrusel.scrollWidth - carrusel.clientWidth
        );

        const posicion = Math.max(0, carrusel.scrollLeft);

        if (botonAnterior) {
            botonAnterior.disabled =
                maximo <= 2 || posicion <= 2;
        }

        if (botonSiguiente) {
            botonSiguiente.disabled =
                maximo <= 2 || posicion >= maximo - 2;
        }
    }


    /* 6. FLECHA ANTERIOR */

    botonAnterior?.addEventListener("click", () => {

        if (!carrusel) return;

        carrusel.scrollBy({
            left: -calcularDesplazamiento(),
            behavior: "smooth"
        });

    });


    /* 7. FLECHA SIGUIENTE */

    botonSiguiente?.addEventListener("click", () => {

        if (!carrusel) return;

        carrusel.scrollBy({
            left: calcularDesplazamiento(),
            behavior: "smooth"
        });

    });


    carrusel?.addEventListener(
        "scroll",
        actualizarControles,
        { passive: true }
    );

    window.addEventListener("resize", actualizarControles);
    window.addEventListener("load", actualizarControles);

    requestAnimationFrame(actualizarControles);


    /* 8. ANIMACIÓN DE APARICIÓN DE LAS TARJETAS */

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach((entrada) => {

                    if (entrada.isIntersecting) {

                        entrada.target.classList.add("visible");
                        observer.unobserve(entrada.target);
                    }

                });

            },
            { threshold: 0.08 }
        );

        tarjetas.forEach((tarjeta) => {
            observador.observe(tarjeta);
        });

    } else {

        tarjetas.forEach((tarjeta) => {
            tarjeta.classList.add("visible");
        });

    }


    /* 9. ABRIR EL VIDEO */

    function abrirVideo(boton) {

        if (!modal || !reproductor) {
            console.error(
                "No se encontró el modal o el reproductor. " +
                "Revisa los IDs modal-video y video-reproductor."
            );
            return;
        }

        const rutaVideo = boton.dataset.video;

        if (!rutaVideo) {
            console.error(
                "Falta la ruta del video en data-video.",
                boton
            );
            return;
        }

        ultimoBotonActivo = boton;

        // Guardar el estado anterior de desplazamiento.
        overflowHtmlAnterior =
            document.documentElement.style.overflow;

        overflowBodyAnterior =
            document.body.style.overflow;

        // Detener y limpiar el video anterior.
        reproductor.pause();
        reproductor.removeAttribute("src");
        reproductor.load();

        // Cargar el video seleccionado.
        reproductor.src = rutaVideo;
        reproductor.load();

        // Mostrar el modal por encima del contenido y del footer.
        modal.classList.add("activo");
        modal.setAttribute("aria-hidden", "false");

        document.documentElement.classList.add("modal-abierto");
        document.body.classList.add("modal-abierto");

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        botonCerrar?.focus({ preventScroll: true });

        // Intentar iniciar la reproducción.
        const intentoReproduccion = reproductor.play();

        if (
            intentoReproduccion &&
            typeof intentoReproduccion.catch === "function"
        ) {
            intentoReproduccion.catch(() => {
                // Si no empieza automáticamente, se puede pulsar
                // Play en los controles del reproductor.
            });
        }
    }


    /* 10. CERRAR EL VIDEO */

    function cerrarVideo() {

        if (!modal || !reproductor) return;

        reproductor.pause();
        reproductor.removeAttribute("src");
        reproductor.load();

        modal.classList.remove("activo");
        modal.setAttribute("aria-hidden", "true");

        document.documentElement.classList.remove("modal-abierto");
        document.body.classList.remove("modal-abierto");

        // Restaurar el desplazamiento anterior de la página.
        document.documentElement.style.overflow =
            overflowHtmlAnterior;

        document.body.style.overflow =
            overflowBodyAnterior;

        // Regresar el foco al botón que abrió el video.
        if (ultimoBotonActivo && ultimoBotonActivo.isConnected) {
            ultimoBotonActivo.focus({ preventScroll: true });
        }

        ultimoBotonActivo = null;
    }


    /* 11. CONECTAR LOS BOTONES CON SUS VIDEOS */

    const zonaVideos = carrusel || document;

    zonaVideos.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) return;

        const boton = evento.target.closest(
            ".video-trigger, .boton-video"
        );

        if (!boton || !zonaVideos.contains(boton)) return;

        if (boton.tagName === "A") {
            evento.preventDefault();
        }

        abrirVideo(boton);
    });


    /* 12. CERRAR CON LA X */

    botonCerrar?.addEventListener("click", cerrarVideo);


    /* 13. CERRAR AL PULSAR EL FONDO OSCURO */

    modal?.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            cerrarVideo();
        }

    });


    /* 14. CERRAR CON ESCAPE */

    document.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Escape" &&
            modal?.classList.contains("activo")
        ) {
            cerrarVideo();
        }

    });

});
