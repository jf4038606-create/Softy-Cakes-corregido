//SI LE SOY SINCERO MASTER LA MAYORIA DE ESTE CODIGO ES HECHO CON IA, ALGUNAS PARTES SI LAS HICE YO PORQUE LA IA NO ENTENDIO. SI SE HACER ESTO EN UN 70%.
//POR SI INSPECCIONA EL CODIGO
document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    const $ = (selector, contexto = document) =>
        contexto.querySelector(selector);

    const $$ = (selector, contexto = document) =>
        [...contexto.querySelectorAll(selector)];

    const botonBusqueda = $("#boton-busqueda");
    const seccionBusqueda = $("#buscador-tienda");
    const formularioBusqueda = $("#formulario-busqueda");
    const campoBusqueda = $("#buscador-productos");
    const botonLimpiar = $("#limpiar-busqueda");
    const resultadoBusqueda = $("#resultado-busqueda");

    const botonCarrito = $("#boton-carrito");
    const panelCarrito = $("#panel-carrito");
    const fondoCarrito = $("#fondo-carrito");
    const botonCerrarCarrito = $("#cerrar-carrito");
    const botonSeguirComprando = $("#seguir-comprando");

    const listaCarrito = $("#lista-carrito");
    const mensajeCarritoVacio = $("#mensaje-carrito-vacio");
    const contadorCarrito = $("#contador-carrito");
    const subtotalProductos = $("#subtotal-productos");
    const totalCarrito = $("#total-carrito");
    const notaTotal = $(".nota-total-carrito");
    const botonFinalizar = $("#finalizar-pedido");

    const productos = $$(".producto-tienda");
    const mensajeSinResultados = $("#mensaje-sin-resultados");

    const CLAVE_CARRITO = "softyCakesCarrito";

    const formatoDinero = new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    });


    const estilosExtra = document.createElement("style");

    estilosExtra.textContent = `
        .notificacion-softy {
            position: fixed;
            z-index: 5000;
            right: 24px;
            bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            width: min(390px, calc(100vw - 32px));
            padding: 16px 19px;
            color: #68463f;
            border: 1px solid rgba(255,255,255,.95);
            border-radius: 18px;
            background:
                radial-gradient(ellipse at 0% 0%, #fff 0%, transparent 65%),
                linear-gradient(135deg, #fffaf7, #f9e7ea);
            box-shadow:
                0 15px 45px rgba(117,61,72,.18),
                0 0 0 1px rgba(225,155,172,.18),
                0 0 32px rgba(230,151,173,.25);
            font-size: .88rem;
            line-height: 1.5;
            animation: softyToastEntrada .45s cubic-bezier(.2,.75,.25,1) both;
            backdrop-filter: blur(16px);
        }

        .notificacion-softy i {
            display: grid;
            place-items: center;
            width: 37px;
            height: 37px;
            flex: 0 0 37px;
            color: #fff;
            border-radius: 13px;
            background: linear-gradient(140deg,#e2a0af,#bd6b80);
            box-shadow: 0 0 20px rgba(220,127,150,.30);
        }

        .notificacion-softy strong {
            color: #a94f65;
        }

        .notificacion-softy.saliendo {
            animation: softyToastSalida .28s ease forwards;
        }

        .contador-carrito.softy-pulso {
            animation: softyContador .48s cubic-bezier(.2,.8,.3,1);
        }

        .boton-icono-tienda.softy-pulso {
            animation: softyBotonPulso .48s ease;
        }

        .buscador-tienda.softy-buscador-visible {
            animation: softyBuscadorEntrada .48s cubic-bezier(.2,.75,.25,1) both;
        }

        .campo-busqueda.softy-enfoque {
            animation: softyBrilloCampo 1.2s ease;
        }

        .producto-tienda.softy-producto-agregado {
            animation: softyProductoAgregado .75s ease;
        }

        .softy-ripple {
            position: absolute;
            z-index: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(
                circle,
                rgba(255,255,255,.85),
                rgba(255,255,255,.22) 52%,
                transparent 73%
            );
            transform: translate(-50%,-50%) scale(0);
            animation: softyOndaLuz .7s ease-out forwards;
        }

        .softy-revelar {
            opacity: 0;
            transform: translateY(22px);
            transition:
                opacity .7s ease,
                transform .7s cubic-bezier(.2,.75,.25,1);
        }

        .softy-revelar.softy-visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Tarjetas del carrito */

        .item-carrito {
            display: grid;
            gap: 13px;
            animation: softyItemEntrada .3s ease both;
        }

        .item-carrito-superior {
            display: flex;
            align-items: center;
            gap: 13px;
        }

        .item-carrito-imagen {
            width: 76px;
            height: 84px;
            flex: 0 0 76px;
            border: 1px solid rgba(220,160,168,.30);
            border-radius: 13px;
            overflow: hidden;
            background: #fff0f1;
        }

        .item-carrito-imagen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .item-carrito-info {
            min-width: 0;
            flex: 1;
        }

        .item-carrito-info h3 {
            margin: 0 0 5px;
            color: #49302d;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 1rem;
            line-height: 1.35;
        }

        .item-carrito-info p {
            margin: 3px 0;
            color: #987b74;
            font-size: .78rem;
            line-height: 1.5;
        }

        .item-carrito-precio {
            color: #a94f65 !important;
            font-weight: 800;
        }

        .item-carrito-inferior {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(213,155,161,.19);
        }

        .controles-cantidad-carrito {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .cantidad-carrito {
            min-width: 18px;
            color: #68463f;
            font-weight: 800;
            text-align: center;
        }

        .boton-cantidad-carrito,
        .boton-eliminar-carrito {
            display: grid;
            place-items: center;
            width: 32px;
            height: 32px;
            padding: 0;
            color: #a94f65;
            border: 1px solid rgba(213,139,153,.28);
            border-radius: 10px;
            background: #fff8f6;
            cursor: pointer;
            transition:
                transform .25s ease,
                color .25s ease,
                background .25s ease,
                box-shadow .25s ease;
        }

        .boton-cantidad-carrito:hover,
        .boton-eliminar-carrito:hover {
            color: #fff;
            background: #c87587;
            box-shadow: 0 0 17px rgba(220,127,150,.25);
            transform: translateY(-2px);
        }

        .boton-eliminar-carrito {
            color: #b55c70;
        }

        .boton-agregar-carrito:disabled {
            opacity: .55;
            cursor: not-allowed;
            transform: none;
        }

        @keyframes softyToastEntrada {
            from { opacity: 0; transform: translateY(20px) scale(.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes softyToastSalida {
            to { opacity: 0; transform: translateY(12px) scale(.97); }
        }

        @keyframes softyContador {
            0% { transform: scale(1); }
            35% { transform: scale(1.42) rotate(-8deg); }
            70% { transform: scale(.9) rotate(5deg); }
            100% { transform: scale(1); }
        }

        @keyframes softyBotonPulso {
            0%,100% { box-shadow: 0 5px 15px rgba(172,99,112,.09); }
            50% {
                box-shadow:
                    0 0 0 6px rgba(232,169,182,.2),
                    0 0 30px rgba(220,129,151,.55);
            }
        }

        @keyframes softyBuscadorEntrada {
            from { opacity: 0; transform: translateY(-13px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes softyBrilloCampo {
            0%,100% { box-shadow: 0 0 0 0 rgba(225,157,170,0); }
            50% {
                box-shadow:
                    0 0 0 5px rgba(225,157,170,.17),
                    0 0 30px rgba(225,157,170,.30);
            }
        }

        @keyframes softyProductoAgregado {
            0%,100% { box-shadow: 0 20px 52px rgba(120,69,68,.09); }
            35% {
                box-shadow:
                    0 0 0 3px rgba(232,165,179,.25),
                    0 0 30px rgba(229,148,170,.48),
                    0 20px 52px rgba(120,69,68,.12);
            }
        }

        @keyframes softyOndaLuz {
            to {
                opacity: 0;
                transform: translate(-50%,-50%) scale(17);
            }
        }

        @keyframes softyItemEntrada {
            from { opacity: 0; transform: translateY(7px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .item-carrito,
        .notificacion-softy,
        .softy-ripple {
            will-change: transform, opacity;
        }

        @media (max-width: 700px) {
            .notificacion-softy {
                right: 12px;
                bottom: 12px;
                width: calc(100vw - 24px);
                padding: 13px 15px;
                font-size: .82rem;
            }
        }
    `;

    document.head.appendChild(estilosExtra);


    let temporizadorNotificacion;

    function notificar(mensaje, tipo = "correcto") {
        const anterior = $(".notificacion-softy");

        if (anterior) {
            anterior.remove();
            clearTimeout(temporizadorNotificacion);
        }

        const notificacion = document.createElement("div");
        notificacion.className = "notificacion-softy";
        notificacion.setAttribute("role", "status");
        notificacion.setAttribute("aria-live", "polite");

        const icono = document.createElement("i");

        icono.className = tipo === "error"
            ? "fa-solid fa-circle-exclamation"
            : "fa-solid fa-heart";

        icono.setAttribute("aria-hidden", "true");

        const texto = document.createElement("span");
        texto.textContent = mensaje;

        notificacion.append(icono, texto);
        document.body.appendChild(notificacion);

        temporizadorNotificacion = setTimeout(() => {
            if (!notificacion.isConnected) return;

            notificacion.classList.add("saliendo");

            setTimeout(() => notificacion.remove(), 300);
        }, 3000);
    }



    function normalizarTexto(texto) {
        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    /*
      Acepta precios como:
      3.50
      3,50
      $3.50
      $3,50

      No inventa un precio si el atributo HTML está vacío.
    */
    function convertirPrecio(valor) {
        if (valor === null || valor === undefined) {
            return null;
        }

        let texto = String(valor).trim();

        if (!texto) return null;

        texto = texto.replace(/[^\d,.-]/g, "");

        if (!texto || !/\d/.test(texto)) {
            return null;
        }

        const ultimaComa = texto.lastIndexOf(",");
        const ultimoPunto = texto.lastIndexOf(".");

        if (ultimaComa !== -1 && ultimoPunto !== -1) {
            if (ultimaComa > ultimoPunto) {
                texto = texto.replace(/\./g, "").replace(",", ".");
            } else {
                texto = texto.replace(/,/g, "");
            }
        } else if (ultimaComa !== -1) {
            texto = texto.replace(",", ".");
        }

        const numero = Number(texto);

        return Number.isFinite(numero) && numero >= 0
            ? numero
            : null;
    }

    function dinero(valor) {
        return formatoDinero.format(valor);
    }

    function obtenerPrecio(tarjeta, tamano) {
        const atributo = tamano === "grande"
            ? tarjeta.dataset.precioGrande
            : tarjeta.dataset.precioPequeno;

        return convertirPrecio(atributo);
    }

    function obtenerNombre(tarjeta) {
        return $(".nombre-producto-tienda", tarjeta)
            ?.textContent.trim() || "Cheesecake";
    }

    function obtenerTarjeta(id) {
        return productos.find(
            tarjeta => tarjeta.dataset.id === id
        );
    }

    function obtenerTamano(tarjeta) {
        return $(".select-tamano-producto", tarjeta)?.value || "pequeno";
    }

    function etiquetaTamano(tamano) {
        return tamano === "grande"
            ? "Envase grande"
            : "Envase pequeño";
    }

    function obtenerImagen(tarjeta) {
        return $(".foto-producto-tienda", tarjeta)
            ?.getAttribute("src") || "cheesecake.jpg";
    }


    
    /*
      Recupera los productos guardados en el navegador.

      Solo restaura productos que existan en el catálogo actual,
      con un tamaño permitido y una cantidad válida.

      Los precios se consultan otra vez en el HTML para evitar
      conservar precios antiguos si cambias los atributos.
    */

    function cargarCarritoGuardado() {
        const carritoRecuperado = new Map();

        try {
            const contenidoGuardado =
                localStorage.getItem(CLAVE_CARRITO);

            if (!contenidoGuardado) {
                return carritoRecuperado;
            }

            const datos = JSON.parse(contenidoGuardado);

            if (!Array.isArray(datos)) {
                return carritoRecuperado;
            }

            datos.forEach(item => {
                if (!item || typeof item !== "object") {
                    return;
                }

                const id = String(item.id || "");
                const tamano = item.tamano;

                if (!["pequeno", "grande"].includes(tamano)) {
                    return;
                }

                const tarjeta = obtenerTarjeta(id);

                if (!tarjeta) {
                    return;
                }

                const cantidad = Number(item.cantidad);

                if (
                    !Number.isSafeInteger(cantidad) ||
                    cantidad < 1
                ) {
                    return;
                }

                const clave = `${id}-${tamano}`;

                carritoRecuperado.set(clave, {
                    clave,
                    id,
                    nombre: obtenerNombre(tarjeta),
                    tamano,
                    precio: obtenerPrecio(tarjeta, tamano),
                    imagen: obtenerImagen(tarjeta),
                    cantidad
                });
            });

        } catch (error) {
            console.warn(
                "No se pudo recuperar el carrito guardado.",
                error
            );
        }

        return carritoRecuperado;
    }

    /*
      Guarda los datos necesarios para reconstruir el carrito.
      Los precios no se guardan como fuente definitiva:
      se vuelven a consultar desde los atributos del HTML.
    */

    function guardarCarrito() {
        try {
            const datos = [...carrito.values()].map(producto => ({
                id: producto.id,
                tamano: producto.tamano,
                cantidad: producto.cantidad,
                clave: producto.clave,
                nombre: producto.nombre,
                imagen: producto.imagen
            }));

            localStorage.setItem(
                CLAVE_CARRITO,
                JSON.stringify(datos)
            );

            return true;

        } catch (error) {
            console.warn(
                "No se pudo guardar el carrito. Comprueba la configuración de almacenamiento del navegador.",
                error
            );

            return false;
        }
    }

    // La información persistida se carga antes de inicializar
    // los controles y mostrar los precios.
    const carrito = cargarCarritoGuardado();


    function abrirBusqueda() {
        if (!seccionBusqueda) return;

        seccionBusqueda.hidden = false;
        seccionBusqueda.classList.remove("softy-buscador-visible");

        void seccionBusqueda.offsetWidth;

        seccionBusqueda.classList.add("softy-buscador-visible");
        botonBusqueda?.setAttribute("aria-expanded", "true");

        setTimeout(() => campoBusqueda?.focus(), 100);
    }

    function cerrarBusqueda() {
        if (!seccionBusqueda) return;

        seccionBusqueda.hidden = true;
        seccionBusqueda.classList.remove("softy-buscador-visible");

        botonBusqueda?.setAttribute("aria-expanded", "false");
    }

    function buscarProductos() {
        if (!campoBusqueda || !productos.length) return;

        const consulta = normalizarTexto(campoBusqueda.value);
        let encontrados = 0;

        productos.forEach(tarjeta => {
            const contenido = normalizarTexto([
                tarjeta.dataset.producto,
                obtenerNombre(tarjeta),
                $(".descripcion-producto-tienda", tarjeta)?.textContent,
                $(".categoria-producto-tienda", tarjeta)?.textContent,
                $(".etiqueta-sabor-tienda", tarjeta)?.textContent
            ].join(" "));

            const coincide = !consulta || contenido.includes(consulta);

            tarjeta.hidden = !coincide;

            if (coincide) encontrados++;
        });

        if (mensajeSinResultados) {
            mensajeSinResultados.hidden = encontrados !== 0;
        }

        if (resultadoBusqueda) {
            if (!consulta) {
                resultadoBusqueda.textContent = "";
            } else if (encontrados === 0) {
                resultadoBusqueda.textContent =
                    "No encontramos resultados. Prueba con otro sabor.";
            } else {
                resultadoBusqueda.textContent = encontrados === 1
                    ? "Encontramos 1 sabor para ti."
                    : `Encontramos ${encontrados} sabores para ti.`;
            }
        }
    }

    botonBusqueda?.addEventListener("click", () => {
        const estaAbierto = seccionBusqueda &&
            !seccionBusqueda.hidden;

        if (estaAbierto) {
            cerrarBusqueda();
        } else {
            abrirBusqueda();
        }
    });

    campoBusqueda?.addEventListener("input", buscarProductos);

    formularioBusqueda?.addEventListener("submit", evento => {
        evento.preventDefault();
        buscarProductos();
    });

    botonLimpiar?.addEventListener("click", () => {
        if (!campoBusqueda) return;

        campoBusqueda.value = "";
        buscarProductos();
        campoBusqueda.focus();
    });

    document.addEventListener("click", evento => {
        if (!seccionBusqueda || seccionBusqueda.hidden) return;

        const dentroBuscador = evento.target.closest(".buscador-tienda");
        const dentroAcciones = evento.target.closest(".acciones-tienda");

        if (!dentroBuscador && !dentroAcciones) {
            cerrarBusqueda();
        }
    });



    function actualizarPrecioProducto(tarjeta) {
        const id = tarjeta.dataset.id;
        const tamano = obtenerTamano(tarjeta);
        const precio = obtenerPrecio(tarjeta, tamano);
        const destino = document.getElementById(`precio-${id}`);

        if (destino) {
            destino.textContent = precio === null
                ? "Por definir"
                : dinero(precio);

            destino.classList.remove("softy-brillo-precio");

            void destino.offsetWidth;

            destino.classList.add("softy-brillo-precio");
        }

        // El carrito también se actualiza si cambia el precio.
        actualizarCarrito();
    }

    productos.forEach(tarjeta => {
        const selector = $(".select-tamano-producto", tarjeta);

        selector?.addEventListener("change", () => {
            actualizarPrecioProducto(tarjeta);

            notificar(
                `Presentación seleccionada: ${etiquetaTamano(selector.value)}.`
            );
        });

        actualizarPrecioProducto(tarjeta);
    });


    let desbordamientoAnterior = "";

    function abrirCarrito() {
        if (!panelCarrito || !fondoCarrito) return;

        cerrarBusqueda();

        panelCarrito.hidden = false;
        fondoCarrito.hidden = false;

        panelCarrito.setAttribute("aria-hidden", "false");
        document.body.classList.add("carrito-abierto");

        desbordamientoAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        panelCarrito.classList.remove("softy-carrito-entrada");

        void panelCarrito.offsetWidth;

        panelCarrito.classList.add("softy-carrito-entrada");

        botonCarrito?.setAttribute("aria-expanded", "true");

        setTimeout(() => botonCerrarCarrito?.focus(), 100);
    }

    function cerrarCarrito() {
        if (!panelCarrito || !fondoCarrito) return;

        panelCarrito.hidden = true;
        fondoCarrito.hidden = true;

        panelCarrito.setAttribute("aria-hidden", "true");
        panelCarrito.classList.remove("softy-carrito-entrada");

        document.body.classList.remove("carrito-abierto");
        document.body.style.overflow = desbordamientoAnterior;

        botonCarrito?.setAttribute("aria-expanded", "false");
        botonCarrito?.focus();
    }

    botonCarrito?.addEventListener("click", abrirCarrito);
    botonCerrarCarrito?.addEventListener("click", cerrarCarrito);
    fondoCarrito?.addEventListener("click", cerrarCarrito);

    botonSeguirComprando?.addEventListener("click", () => {
        cerrarCarrito();

        $("#catalogo-cheesecakes")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });


    function agregarProducto(tarjeta) {
        const id = tarjeta.dataset.id;
        const tamano = obtenerTamano(tarjeta);
        const clave = `${id}-${tamano}`;

        const nombre = obtenerNombre(tarjeta);
        const precio = obtenerPrecio(tarjeta, tamano);
        const imagen = obtenerImagen(tarjeta);

        if (carrito.has(clave)) {
            const productoExistente = carrito.get(clave);

            productoExistente.cantidad++;
            productoExistente.precio = precio;
            productoExistente.imagen = imagen;
            productoExistente.nombre = nombre;

        } else {
            carrito.set(clave, {
                clave,
                id,
                nombre,
                tamano,
                precio,
                imagen,
                cantidad: 1
            });
        }

        actualizarCarrito();
        animarContador();

        tarjeta.classList.remove("softy-producto-agregado");

        void tarjeta.offsetWidth;

        tarjeta.classList.add("softy-producto-agregado");

        setTimeout(() => {
            tarjeta.classList.remove("softy-producto-agregado");
        }, 800);

        if (precio === null) {
            notificar(
                `${nombre} se añadió al carrito. Su precio está por definir.`
            );
        } else {
            notificar(`${nombre} se añadió a tu carrito.`);
        }
    }

    document.addEventListener("click", evento => {
        const botonAgregar = evento.target.closest("[data-agregar]");

        if (!botonAgregar) return;

        const id = botonAgregar.dataset.agregar;
        const tarjeta = obtenerTarjeta(id);

        if (!tarjeta) {
            notificar("No pudimos encontrar ese producto.", "error");
            return;
        }

        agregarProducto(tarjeta);
    });


    listaCarrito?.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-carrito-accion]");

        if (!boton) return;

        const clave = boton.dataset.clave;
        const accion = boton.dataset.carritoAccion;
        const producto = carrito.get(clave);

        if (!producto) return;

        if (accion === "sumar") {
            producto.cantidad++;
        }

        if (accion === "restar") {
            producto.cantidad--;

            if (producto.cantidad <= 0) {
                carrito.delete(clave);
            }
        }

        if (accion === "eliminar") {
            carrito.delete(clave);
            notificar("Producto eliminado del carrito.");
        }

        actualizarCarrito();
        animarContador();
    });


    function crearElemento(tag, clase, texto = "") {
        const elemento = document.createElement(tag);

        if (clase) elemento.className = clase;
        if (texto !== "") elemento.textContent = texto;

        return elemento;
    }

    function crearBotonCarrito(icono, etiqueta, accion, clave, clase) {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = clase;
        boton.dataset.carritoAccion = accion;
        boton.dataset.clave = clave;
        boton.setAttribute("aria-label", etiqueta);
        boton.title = etiqueta;

        const icon = document.createElement("i");

        icon.className = icono;
        icon.setAttribute("aria-hidden", "true");

        boton.appendChild(icon);

        return boton;
    }

    function dibujarProductoCarrito(producto) {
        const fila = crearElemento("li", "item-carrito");

        const superior = crearElemento(
            "div",
            "item-carrito-superior"
        );

        const marcoImagen = crearElemento(
            "div",
            "item-carrito-imagen"
        );

        const imagen = document.createElement("img");

        imagen.src = producto.imagen || "cheesecake.jpg";
        imagen.alt = producto.nombre;
        imagen.loading = "lazy";

        marcoImagen.appendChild(imagen);

        const info = crearElemento("div", "item-carrito-info");

        const nombre = crearElemento("h3", "", producto.nombre);

        const tamano = crearElemento(
            "p",
            "",
            etiquetaTamano(producto.tamano)
        );

        const precioUnidad = producto.precio === null
            ? "Precio por definir"
            : `${dinero(producto.precio)} por unidad`;

        const precio = crearElemento(
            "p",
            "item-carrito-precio",
            precioUnidad
        );

        const cantidadTexto = crearElemento(
            "p",
            "",
            `Cantidad: ${producto.cantidad}`
        );

        info.append(nombre, tamano, precio, cantidadTexto);
        superior.append(marcoImagen, info);

        const inferior = crearElemento(
            "div",
            "item-carrito-inferior"
        );

        const controles = crearElemento(
            "div",
            "controles-cantidad-carrito"
        );

        const restar = crearBotonCarrito(
            "fa-solid fa-minus",
            `Restar una unidad de ${producto.nombre}`,
            "restar",
            producto.clave,
            "boton-cantidad-carrito"
        );

        const cantidad = crearElemento(
            "span",
            "cantidad-carrito",
            String(producto.cantidad)
        );

        const sumar = crearBotonCarrito(
            "fa-solid fa-plus",
            `Añadir una unidad de ${producto.nombre}`,
            "sumar",
            producto.clave,
            "boton-cantidad-carrito"
        );

        const eliminar = crearBotonCarrito(
            "fa-solid fa-trash",
            `Eliminar ${producto.nombre} del carrito`,
            "eliminar",
            producto.clave,
            "boton-eliminar-carrito"
        );

        controles.append(restar, cantidad, sumar);
        inferior.append(controles, eliminar);

        fila.append(superior, inferior);

        return fila;
    }


    function actualizarCarrito() {
        if (!listaCarrito) return;

        /*
          Actualiza los precios a partir del HTML.
          No conserva un precio antiguo si modificas el catálogo.
        */
        carrito.forEach(producto => {
            const tarjeta = obtenerTarjeta(producto.id);

            if (tarjeta) {
                producto.precio = obtenerPrecio(
                    tarjeta,
                    producto.tamano
                );

                producto.nombre = obtenerNombre(tarjeta);
                producto.imagen = obtenerImagen(tarjeta);
            }
        });

        listaCarrito.replaceChildren();

        let unidades = 0;
        let total = 0;
        let todosTienenPrecio = true;

        carrito.forEach(producto => {
            unidades += producto.cantidad;

            if (producto.precio === null) {
                todosTienenPrecio = false;
            } else {
                total += producto.precio * producto.cantidad;
            }

            listaCarrito.appendChild(
                dibujarProductoCarrito(producto)
            );
        });

        if (contadorCarrito) {
            contadorCarrito.textContent = String(unidades);

            contadorCarrito.setAttribute(
                "aria-label",
                `Cantidad total de unidades: ${unidades}`
            );
        }

        if (subtotalProductos) {
            subtotalProductos.textContent = String(unidades);
        }

        if (mensajeCarritoVacio) {
            mensajeCarritoVacio.hidden = unidades !== 0;
        }

        listaCarrito.hidden = unidades === 0;

        if (totalCarrito) {
            totalCarrito.textContent =
                unidades === 0 || !todosTienenPrecio
                    ? "Por definir"
                    : dinero(total);
        }

        if (notaTotal) {
            if (unidades === 0) {
                notaTotal.textContent =
                    "Añade tus cheesecakes favoritos para preparar tu pedido.";
            } else if (!todosTienenPrecio) {
                notaTotal.textContent =
                    "Hay precios pendientes. El pedido podrá prepararse cuando todos estén definidos.";
            } else {
                notaTotal.textContent =
                    "Revisa las cantidades y prepara tu pedido por WhatsApp.";
            }
        }

        if (botonFinalizar) {
            botonFinalizar.disabled =
                unidades === 0 || !todosTienenPrecio;
        }

        /*
          PUNTO CLAVE:
          Cada actualización guarda automáticamente el estado actual.
          Esto incluye añadir, eliminar, sumar y restar cantidades.
        */
        guardarCarrito();
    }

    function animarContador() {
        [contadorCarrito, botonCarrito].forEach(elemento => {
            if (!elemento) return;

            elemento.classList.remove("softy-pulso");

            void elemento.offsetWidth;

            elemento.classList.add("softy-pulso");

            setTimeout(() => {
                elemento.classList.remove("softy-pulso");
            }, 550);
        });
    }


    botonFinalizar?.addEventListener("click", () => {
        if (carrito.size === 0) {
            notificar("Tu carrito está vacío.", "error");
            return;
        }

        const lista = [...carrito.values()];

        const faltanPrecios = lista.some(
            producto => producto.precio === null
        );

        if (faltanPrecios) {
            notificar(
                "Primero deben definirse todos los precios.",
                "error"
            );
            return;
        }

        const total = lista.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );

        const lineas = [
            "*Hola, Softy Cakes. Quiero preparar este pedido:*",
            ""
        ];

        lista.forEach(producto => {
            lineas.push(
                `• ${producto.nombre}`,
                `  Presentación: ${etiquetaTamano(producto.tamano)}`,
                `  Cantidad: ${producto.cantidad}`,
                `  Precio: ${dinero(producto.precio * producto.cantidad)}`,
                ""
            );
        });

        lineas.push(
            `*Total: ${dinero(total)}*`,
            "",
            "Por favor, confirmen la disponibilidad y los detalles de entrega."
        );

        const enlaceWhatsApp = $(
            '.redes-sociales-tienda a[aria-label*="WhatsApp"]'
        );

        const coincidencia = enlaceWhatsApp?.href.match(
            /wa\.me\/(\d+)/
        );

        if (!coincidencia) {
            notificar(
                "Revisa el enlace de WhatsApp en el HTML.",
                "error"
            );
            return;
        }

        const numero = coincidencia[1];

        const url = `https://wa.me/${numero}?text=${
            encodeURIComponent(lineas.join("\n"))
        }`;

        window.open(url, "_blank", "noopener,noreferrer");
    });


    document.addEventListener("keydown", evento => {
        if (evento.key !== "Escape") return;

        if (panelCarrito && !panelCarrito.hidden) {
            cerrarCarrito();
            return;
        }

        if (seccionBusqueda && !seccionBusqueda.hidden) {
            cerrarBusqueda();
            botonBusqueda?.focus();
        }
    });

  //EFECTOS LUMINOSOS

    document.addEventListener("click", evento => {
        const elemento = evento.target.closest(
            ".boton-icono-tienda, " +
            ".boton-agregar-carrito, " +
            ".boton-tienda, " +
            ".boton-contacto-tienda, " +
            ".boton-seguir-comprando, " +
            ".boton-cerrar-carrito, " +
            ".enlace-social-tienda"
        );

        if (!elemento) return;

        const anterior = elemento.querySelector(".softy-ripple");
        anterior?.remove();

        const rectangulo = elemento.getBoundingClientRect();
        const onda = document.createElement("span");

        onda.className = "softy-ripple";

        onda.style.left = `${evento.clientX - rectangulo.left}px`;
        onda.style.top = `${evento.clientY - rectangulo.top}px`;

        elemento.appendChild(onda);

        setTimeout(() => onda.remove(), 750);
    });



    // APARICIÓN ANIMADA DE SECCIONES

    const elementosRevelables = [
        ...$$(".beneficio-tienda"),
        ...$$(".encabezado-catalogo-tienda"),
        ...$$(".mensaje-final-tienda")
    ];

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add("softy-visible");
                    observador.unobserve(entrada.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        elementosRevelables.forEach((elemento, indice) => {
            elemento.classList.add("softy-revelar");

            elemento.style.transitionDelay =
                `${(indice % 3) * 100}ms`;

            observador.observe(elemento);
        });

    } else {
        elementosRevelables.forEach(elemento => {
            elemento.classList.add("softy-visible");
        });
    }


    // INICIALIZACIÓN
    

    botonBusqueda?.setAttribute("aria-expanded", "false");
    botonCarrito?.setAttribute("aria-expanded", "false");

    panelCarrito?.setAttribute("aria-hidden", "true");

    if (panelCarrito) panelCarrito.hidden = true;
    if (fondoCarrito) fondoCarrito.hidden = true;

    /*
      El primer render recupera el carrito guardado,
      actualiza las cantidades y recalcula los importes.
    */
    actualizarCarrito();

});



(() => {
    function iniciarVideoPublicitario() {
        const contenedor = document.querySelector(
            ".contenedor-video-tienda"
        );

        const videoOriginal = contenedor?.querySelector(
            ".video-portada-tienda"
        );

        if (!contenedor || !videoOriginal) return;

        if (contenedor.querySelector(".boton-ampliar-video")) return;

        videoOriginal.controls = true;

        const estilos = document.createElement("style");
        estilos.id = "estilos-video-principal";

        estilos.textContent = `
            .boton-ampliar-video {
                position: absolute;
                z-index: 10;
                right: 16px;
                bottom: 16px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 9px;
                padding: 12px 18px;
                color: #fff;
                font: 700 .85rem "Segoe UI", sans-serif;
                background: linear-gradient(125deg,#d98d9d,#a94f65,#d98d9d);
                background-size: 200% 200%;
                border: 1px solid rgba(255,255,255,.8);
                border-radius: 999px;
                box-shadow:
                    0 0 12px rgba(240,151,174,.65),
                    0 0 28px rgba(240,151,174,.35),
                    0 8px 22px rgba(73,48,45,.25);
                cursor: pointer;
                transition: transform .3s ease, box-shadow .3s ease;
                animation: brilloBotonVideo 4s ease infinite;
            }

            .boton-ampliar-video:hover {
                transform: translateY(-3px) scale(1.035);
                box-shadow:
                    0 0 16px rgba(255,255,255,.8),
                    0 0 35px rgba(240,151,174,.8),
                    0 10px 26px rgba(73,48,45,.3);
            }

            .fondo-video-principal {
                position: fixed;
                z-index: 99999;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(35,20,27,.88);
                backdrop-filter: blur(13px);
                -webkit-backdrop-filter: blur(13px);
                animation: aparecerVideoPrincipal .3s ease both;
            }

            .fondo-video-principal[hidden] {
                display: none !important;
            }

            .ventana-video-principal {
                position: relative;
                width: min(1000px, 100%);
                padding: 12px;
                border: 1px solid rgba(255,225,235,.8);
                border-radius: 25px;
                background: linear-gradient(135deg,#f8dfe4,#a94f65,#f3bdcc);
                box-shadow:
                    0 0 18px rgba(240,151,174,.65),
                    0 0 48px rgba(240,151,174,.38),
                    0 0 100px rgba(240,151,174,.16),
                    0 30px 90px rgba(0,0,0,.4);
                animation: entradaVideoPrincipal .4s cubic-bezier(.2,.75,.25,1) both;
            }

            .video-ampliado-principal {
                display: block;
                width: 100%;
                max-height: 78vh;
                aspect-ratio: 16 / 9;
                object-fit: contain;
                background: #171116;
                border: 1px solid rgba(255,255,255,.45);
                border-radius: 17px;
            }

            .cerrar-video-principal {
                position: absolute;
                z-index: 2;
                top: -18px;
                right: -15px;
                display: grid;
                place-items: center;
                width: 43px;
                height: 43px;
                padding: 0;
                color: #fff;
                font: 400 29px/1 "Segoe UI", sans-serif;
                border: 1px solid rgba(255,255,255,.9);
                border-radius: 50%;
                background: linear-gradient(135deg,#e7a4b0,#a94f65);
                box-shadow:
                    0 0 15px rgba(240,151,174,.65),
                    0 5px 18px rgba(0,0,0,.25);
                cursor: pointer;
                transition: transform .3s ease, box-shadow .3s ease;
            }

            .cerrar-video-principal:hover {
                transform: rotate(90deg) scale(1.08);
                box-shadow:
                    0 0 25px rgba(255,255,255,.7),
                    0 0 35px rgba(240,151,174,.75);
            }

            @keyframes brilloBotonVideo {
                0%,100% {
                    background-position: 0% 50%;
                    box-shadow:
                        0 0 12px rgba(240,151,174,.55),
                        0 0 26px rgba(240,151,174,.25);
                }
                50% {
                    background-position: 100% 50%;
                    box-shadow:
                        0 0 18px rgba(255,255,255,.4),
                        0 0 34px rgba(240,151,174,.65);
                }
            }

            @keyframes aparecerVideoPrincipal {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes entradaVideoPrincipal {
                from {
                    opacity: 0;
                    transform: translateY(18px) scale(.96);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 600px) {
                .boton-ampliar-video {
                    right: 10px;
                    bottom: 10px;
                    gap: 7px;
                    padding: 10px 13px;
                    font-size: .74rem;
                }

                .fondo-video-principal {
                    padding: 17px;
                }

                .ventana-video-principal {
                    padding: 7px;
                    border-radius: 17px;
                }

                .video-ampliado-principal {
                    max-height: 72vh;
                    border-radius: 11px;
                }

                .cerrar-video-principal {
                    top: -14px;
                    right: -9px;
                    width: 36px;
                    height: 36px;
                    font-size: 25px;
                }
            }
        `;

        document.head.appendChild(estilos);

        const botonAbrir = document.createElement("button");
        botonAbrir.type = "button";
        botonAbrir.className = "boton-ampliar-video";
        botonAbrir.setAttribute("aria-haspopup", "dialog");
        botonAbrir.setAttribute("aria-expanded", "false");
        botonAbrir.setAttribute(
            "aria-label",
            "Ver video publicitario ampliado"
        );

        botonAbrir.innerHTML = `
            <i class="fa-solid fa-play" aria-hidden="true"></i>
            Ver anuncio completo
            <i class="fa-solid fa-expand" aria-hidden="true"></i>
        `;

        contenedor.appendChild(botonAbrir);

        const fondo = document.createElement("div");
        fondo.className = "fondo-video-principal";
        fondo.hidden = true;
        fondo.setAttribute("role", "dialog");
        fondo.setAttribute("aria-modal", "true");
        fondo.setAttribute(
            "aria-label",
            "Video publicitario de Softy Cakes"
        );
        fondo.setAttribute("aria-hidden", "true");

        const ventana = document.createElement("div");
        ventana.className = "ventana-video-principal";

        const botonCerrar = document.createElement("button");
        botonCerrar.type = "button";
        botonCerrar.className = "cerrar-video-principal";
        botonCerrar.setAttribute("aria-label", "Cerrar video");
        botonCerrar.innerHTML = "&times;";

        ventana.appendChild(botonCerrar);
        fondo.appendChild(ventana);
        document.body.appendChild(fondo);

        let videoAmpliado = null;
        let desplazamientoAnterior = "";
        let elementoEnfocadoAnterior = null;

        function abrirVideo() {
            if (!fondo.hidden) return;

            elementoEnfocadoAnterior = document.activeElement;

            videoAmpliado = videoOriginal.cloneNode(true);
            videoAmpliado.removeAttribute("id");
            videoAmpliado.className = "video-ampliado-principal";
            videoAmpliado.controls = true;
            videoAmpliado.autoplay = true;
            videoAmpliado.loop = false;
            videoAmpliado.playsInline = true;

            videoOriginal.pause();

            ventana.insertBefore(videoAmpliado, botonCerrar);

            desplazamientoAnterior = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            fondo.hidden = false;
            fondo.setAttribute("aria-hidden", "false");
            botonAbrir.setAttribute("aria-expanded", "true");

            videoAmpliado.load();

            const reproduccion = videoAmpliado.play();

            if (reproduccion && typeof reproduccion.catch === "function") {
                reproduccion.catch(() => {
                    // Si el navegador bloquea la reproducción automática,
                    // el visitante podrá iniciarla con los controles.
                });
            }

            botonCerrar.focus();
        }

        function cerrarVideo() {
            if (fondo.hidden) return;

            if (videoAmpliado) {
                videoAmpliado.pause();
                videoAmpliado.remove();
                videoAmpliado = null;
            }

            fondo.hidden = true;
            fondo.setAttribute("aria-hidden", "true");

            document.body.style.overflow = desplazamientoAnterior;
            botonAbrir.setAttribute("aria-expanded", "false");

            if (elementoEnfocadoAnterior?.isConnected) {
                elementoEnfocadoAnterior.focus();
            } else {
                botonAbrir.focus();
            }
        }

        botonAbrir.addEventListener("click", abrirVideo);
        botonCerrar.addEventListener("click", cerrarVideo);

        fondo.addEventListener("click", evento => {
            if (evento.target === fondo) {
                cerrarVideo();
            }
        });

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape" && !fondo.hidden) {
                cerrarVideo();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarVideoPublicitario,
            { once: true }
        );
    } else {
        iniciarVideoPublicitario();
    }
})();