// ---------- Mapa de Iconos Por Juego ----------

var IconosPorJuego = {
    "Pac-Man":            "ti-circle-dotted",
    "Super Mario Bros 3": "ti-stars",
    "Kirby's Adventure":  "ti-wind",
    "Crash Bandicoot":    "ti-tornado",
    "PepsiMan":           "ti-run",
    "Metal Slug X":       "ti-tank"
};


// --- Devuelve La Clase Tabler Para Un Juego ---

function ObtenerClaseIcono(NombreJuego) {
    return IconosPorJuego[NombreJuego] || "ti-device-gamepad-2";
}


// ---------- Generar El HTML Del <i> -----------

function ObtenerHtmlIcono(NombreJuego) {
    
    var Clase = ObtenerClaseIcono(NombreJuego);
    
    return '<i class="ti '+ Clase + '" aria-hidden="true"></i>';

}


// ------ Juegos Disponibles Del Emulador -------

var ListaDeJuegos = [
    { ID: 23, Nombre: "Super Mario Bros 3", Consola: "nes", Genero: "Plataforma", Año: "1990" },
    { ID: 24, Nombre: "Kirby's Adventure",  Consola: "nes", Genero: "Plataforma", Año: "1993" },
    { ID: 25, Nombre: "Pac-Man",            Consola: "nes", Genero: "Arcade",     Año: "1984" },
    { ID: 21, Nombre: "PepsiMan",           Consola: "ps1", Genero: "Acción",     Año: "1999" },
    { ID: 20, Nombre: "Crash Bandicoot",    Consola: "ps1", Genero: "Plataforma", Año: "1996" },
    { ID: 22, Nombre: "Metal Slug X",       Consola: "ps1", Genero: "Shooter",    Año: "1999" }
];

var FiltroActivo       = "nes";
var JuegoSeleccionado  = null;
var NucleoSeleccionado = "nes";
var EtiquetasConsolas  = { nes: "NES",         ps1: "PS1" };

var ClaseEtiqueta      = { nes: "EtiquetaNes", ps1: "EtiquetaPs1" };
var MapaNucleo         = { nes: "nes",         ps1: "psx" };
var CarpetaRoms        = { nes: "NintendoNes", ps1: "PlayStation1" };
var ExtensionesRom     = { nes: ".nes",        ps1: ".bin" };

var RutasBios          = { ps1: "./bios/scph1001.bin" };
var UrlCdn             = "https://cdn.emulatorjs.org/stable/data/";

(function PrecargarRecursos() {
    
    var RecursosPrecarga = [
        { rel: "prefetch",   href: UrlCdn + "loader.js" },
        { rel: "prefetch",   href: UrlCdn + "emulator.min.js" },
        { rel: "preconnect", href: "https://cdn.emulatorjs.org" }
    ];

    RecursosPrecarga.forEach(function (Recurso) {
        
        var Enlace = document.createElement("link");

        Enlace.rel  = Recurso.rel;
        Enlace.href = Recurso.href;

        if(Recurso.rel === "preconnect") Enlace.crossOrigin = "anonymous";

        document.head.appendChild(Enlace);

    });
})();


// - Actualizar Cabecera Con Los Tabler Iconos --

function ActualizarEstadoCabecera(NombreJuego, TextoEstado) {

    var EnvoltorioIcono = document.getElementById("EnvoltorioIconoEstado");
    var Icono           = document.getElementById("IconoEstado");

    if (NombreJuego) {

        var Clase                     = ObtenerClaseIcono(NombreJuego);
        Icono.className               = "ti " + Clase;
        EnvoltorioIcono.style.display = "inline-flex";

    } else {
        
        EnvoltorioIcono.style.display = "none";
        Icono.className               = "";
    }

    document.getElementById("TextoEstado").textContent = TextoEstado;

}


// ------- Renderizar La Lista De Juegos --------

function RenderizarJuegos() {

    var CodigoHtml = "";

    for (var i = 0; i < ListaDeJuegos.length; i++) {

        var Juego = ListaDeJuegos[i];

        if (Juego.Consola !== FiltroActivo) continue;

        var ClaseActivo = JuegoSeleccionado && JuegoSeleccionado.ID === Juego.ID ? " Activo" : "";

        CodigoHtml += '<div class="ElementoJuego' + ClaseActivo + '" onclick="SeleccionarJuego(' + Juego.ID + ')">'
                    + '<div class="IconoJuego">' + ObtenerHtmlIcono(Juego.Nombre) + '</div>'
                    + '<div class="InfoJuego">'
                    +     '<div class="NombreJuego">' + Juego.Nombre + '</div>'
                    +     '<div class="MetaJuego">' + Juego.Genero + ' · ' + Juego.Año + '</div>'
                    + '</div>'
                    + '<span class="EtiquetaJuego ' + (ClaseEtiqueta[Juego.Consola] || '') + '">'
                    +    (EtiquetasConsolas[Juego.Consola] || Juego.Consola)
                    + '</span>'
                   + '</div>';

    }

    document.getElementById("ListaJuego").innerHTML = CodigoHtml;
    RenderizarPanelControles();

}


// -- Panel De Controles Barra Lateral Derecha --

function RenderizarPanelControles() {
    
    var ConsolaActual = FiltroActivo || "nes";
    var CodigoHtml    = "";

    var ControlesPorConsola = {
        nes: {
            "D-Pad": [
                { Etiqueta: "Arriba",     Tecla: "W" },
                { Etiqueta: "Abajo",      Tecla: "S" },
                { Etiqueta: "Izquierda",  Tecla: "A" },
                { Etiqueta: "Derecha",    Tecla: "D" }
            ],
            "Botones": [
                { Etiqueta: "Botón A", Tecla: "K" },
                { Etiqueta: "Botón B", Tecla: "J" }
            ],
            "Sistema": [
                { Etiqueta: "Start", Tecla: "Enter" }
            ]
        },
        ps1: {
            "D-Pad": [
                { Etiqueta: "Arriba",    Tecla: "W" },
                { Etiqueta: "Abajo",     Tecla: "S" },
                { Etiqueta: "Izquierda", Tecla: "A" },
                { Etiqueta: "Derecha",   Tecla: "D" }
            ],
            "Botones": [
                { Etiqueta: "X",         Tecla: "K" },
                { Etiqueta: "Cuadrado",  Tecla: "J" },
                { Etiqueta: "Círculo",   Tecla: "L" }
            ],
            "Sistema": [
                { Etiqueta: "Select", Tecla: "Shift" },
                { Etiqueta: "Start",  Tecla: "Enter" }
            ]
        }
    };

    var ControlesActuales = ControlesPorConsola[ConsolaActual] || ControlesPorConsola.nes;

    for (var NombreGrupo in ControlesActuales) {
        
        CodigoHtml += '<div class="GrupoControl1">'
                    + '<div class="TituloGrupoControl">' + NombreGrupo + '</div>'
                    + '<div class="FilasControl">';

        var ElementosGrupo = ControlesActuales[NombreGrupo];

        for (var j = 0; j < ElementosGrupo.length; j++) {

            var Elemento = ElementosGrupo[j];

            CodigoHtml += '<div class="FilaControl">'
                        + '<span class="AccionControl">' + Elemento.Etiqueta + '</span>'
                        + '<div class="TeclasControl">';

            if (Elemento.Tecla.indexOf("/") > -1) {

                var Partes = Elemento.Tecla.split("/");

                CodigoHtml += '<span class="Tecla">' + Partes[0].trim() + '</span>'
                            + '<span class="SeparadorTecla">/</span>'
                            + '<span class="Tecla">' + Partes[1].trim() + '</span>';

            } else {

                CodigoHtml += '<span class="Tecla">' + Elemento.Tecla + '</span>';

            }

            CodigoHtml += '</div></div>';

        }

        CodigoHtml += '</div></div>';

    }

    document.getElementById("PanelControles").innerHTML = CodigoHtml;

}


// ------ Seleccionar Un Juego De La Lista ------

function SeleccionarJuego(IdJuego) {

    for (var i = 0; i < ListaDeJuegos.length; i++) {

        if (ListaDeJuegos[i].ID === IdJuego) {
            
            JuegoSeleccionado = ListaDeJuegos[i];
            
            break;

        }

    }

    RenderizarJuegos();
    ActualizarEstadoCabecera(JuegoSeleccionado.Nombre, JuegoSeleccionado.Nombre);

    NucleoSeleccionado = MapaNucleo[JuegoSeleccionado.Consola] || JuegoSeleccionado.Consola;
    document.getElementById("BotonIniciar").disabled = false;

}


// --------- Construir La URL De La Rom ---------

function ConstruirUrlRom(Juego) {

    var Carpeta   = CarpetaRoms[Juego.Consola];
    var Extension = ExtensionesRom[Juego.Consola];

    return new URL("./" + Carpeta + "/" + encodeURIComponent(Juego.Nombre) + Extension, window.location.href).href;

}

function ConstruirUrlBios(NombreConsola) {

    if (!RutasBios[NombreConsola]) return null;
    
    return new URL(RutasBios[NombreConsola], window.location.href).href;

}


// ---- Verificar Si La Pantalla Es De Movil ----

function EsDispositivoMovil() {
    return window.matchMedia("(max-width:900px)").matches;
}


// ---- Solicitar Pantalla Completa En Movil ----

function SolicitarPantallaCompleta() {

    var EnvoltorioEmulador = document.querySelector(".EnvoltorioEmulador");

    if (!EnvoltorioEmulador) return Promise.resolve();

    var FnPantalla = EnvoltorioEmulador.requestFullscreen       ||
                     EnvoltorioEmulador.webkitRequestFullscreen ||
                     EnvoltorioEmulador.mozRequestFullScreen    ||
                     EnvoltorioEmulador.msRequestFullscreen;

    if (!FnPantalla) return Promise.resolve();

    return new Promise(function (Resolver) {

        function TerminarYResolver() {
            BloquearPaisaje();
            /* Pequeño respiro extra para que el layout de fullscreen
               termine de estabilizarse antes de montar el emulador */
            setTimeout(Resolver, 120);
        }

        try {

            var Promesa = FnPantalla.call(EnvoltorioEmulador);

            if (Promesa && Promesa.then) {
                Promesa.then(TerminarYResolver).catch(TerminarYResolver);
            } else {
                setTimeout(TerminarYResolver, 100);
            }

        } catch (e) {
            Resolver();
        }

    });

}


function BloquearPaisaje() {

    try {

        if (screen.orientation && screen.orientation.lock) {
            
            screen.orientation.lock("landscape").catch(function () {});
        
        }

    } catch (e) {}

}


// ------- Funcion Para Iniciar El Juego --------

function IniciarRom() {

    if (!JuegoSeleccionado) {
        
        alert("Por favor, selecciona un juego antes de iniciar.");

        return;

    }

    document.getElementById("PantallaInicio").classList.add("Oculta");

    var PantallaCargaEl = document.getElementById("PantallaCarga");

    PantallaCargaEl.classList.add("Visible");
    
    document.getElementById("TituloCarga").textContent = JuegoSeleccionado.Nombre.toUpperCase();
    document.getElementById("BarraCarga").style.width = "0%";

    var UrlRom       = ConstruirUrlRom(JuegoSeleccionado);
    var UrlBios      = ConstruirUrlBios(JuegoSeleccionado.Consola);
    var NucleoActual = NucleoSeleccionado;
    var NombreActual = JuegoSeleccionado.Nombre;

    /* En movil, esperamos a que el fullscreen realmente termine
       ANTES de montar el emulador, para que el gamepad virtual
       se calcule con las dimensiones correctas desde el inicio */
    var EsperaPantallaCompleta = EsDispositivoMovil()
        ? SolicitarPantallaCompleta()
        : Promise.resolve();

    EsperaPantallaCompleta.then(function () {

        setTimeout(function () {
            document.getElementById("BarraCarga").style.width = "80%";
        }, 100);

        requestAnimationFrame(function () {
            document.getElementById("BarraCarga").style.width = "100%";

            setTimeout(function () {
                PantallaCargaEl.classList.remove("Visible");
                MontarIframeNuevo(NucleoActual, UrlRom, NombreActual, UrlBios, EsDispositivoMovil());
            }, 200);

        });

    });
    
}


// ---- Montar El Nuevo Iframe Del Emulador -----

function MontarIframeNuevo(Nucleo, UrlJuego, NombreJuego, UrlBios, EsMovil) {

    var IdJuego = NombreJuego.replace(/[^a-zA-Z0-9]/g, "_");
    var Cdn     = UrlCdn;

    if ("caches" in window) {

        caches.open("retrovault-roms").then(function (Cache) {

            Cache.add(UrlJuego).catch(function () {});

        });
    
    }

    if ("requestIdleCallback" in window) {

        requestIdleCallback(function () {

            [Cdn + "emulator.min.js", Cdn + "gamepad.js"].forEach(function (Url) {

                var Img = new Image();

                Img.src = Url;

            });

        });

    }

    var RutasEjs = JSON.stringify({
        "loader.js":        Cdn + "loader.js",
        "emulator.min.js":  Cdn + "emulator.min.js",
        "emulator.js":      Cdn + "emulator.js",
        "emulator.min.css": Cdn + "emulator.min.css",
        "emulator.css":     Cdn + "emulator.css",
        "nipplejs.js":      Cdn + "nipplejs.js",
        "shaders.js":       Cdn + "shaders.js",
        "storage.js":       Cdn + "storage.js",
        "gamepad.js":       Cdn + "gamepad.js",
        "GameManager.js":   Cdn + "GameManager.js",
        "socket.io.min.js": Cdn + "socket.io.min.js",
        "compression.js":   Cdn + "compression.js"  
    });

    var ControlesPredeterminados = JSON.stringify({
        0: {
            0:  { value: "k",     value2: "BUTTON_2" },
            1:  { value: "j",     value2: "BUTTON_4" },
            2:  { value: "shift", value2: "SELECT" },
            3:  { value: "enter", value2: "START" },
            4:  { value: "w",     value2: "DPAD_UP" },
            5:  { value: "s",     value2: "DPAD_DOWN" },
            6:  { value: "a",     value2: "DPAD_LEFT" },
            7:  { value: "d",     value2: "DPAD_RIGHT" },
            8:  { value: "l",     value2: "BUTTON_1" },
            9:  { value: "l",     value2: "BUTTON_3" },
            10: { value: "q",     value2: "LEFT_TOP_SHOULDER" },
            11: { value: "",      value2: "RIGHT_TOP_SHOULDER" },
            12: { value: "",      value2: "LEFT_BOTTOM_SHOULDER" },
            13: { value: "",      value2: "RIGHT_BOTTOM_SHOULDER" },
            14: { value: "",      value2: "LEFT_STICK" },
            15: { value: "",      value2: "RIGHT_STICK" },
            24: { value: "1" }, 25: { value: "2" }, 26: { value: "3" },
            27: { value: "add" }, 28: { value: "space" }, 29: { value: "subtract" }
        },
        1: {}, 2: {}, 3: {}
    });

    var PartesBios = UrlBios ? "window.EJS_biosUrl=" + JSON.stringify(UrlBios) + ";" : "";
    var PartesModoNavegador = EsMovil ? "window.EJS_browserMode='mobile';" : "";

    var ContenidoHtml = [
        '<!DOCTYPE html><html><head><meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',
        '<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:100%;height:100%;background:#000;overflow:hidden}#juego{width:100%;height:100%;image-rendering:pixelated;image-rendering:-moz-crisp-edges;image-rendering:crisp-edges;}</style>',
        '</head><body><div id="juego"></div>',
        '<scr' + 'ipt>',
        'if(typeof requestAnimationFrame!=="undefined"){var UltimoTiempo=0;var LimiteVsync=1000/60;(function Cuadro(Tiempo){if(Tiempo-UltimoTiempo>=LimiteVsync){UltimoTiempo=Tiempo;}requestAnimationFrame(Cuadro);})();}',
        'window.EJS_player="#juego";',
        'window.EJS_core='         + JSON.stringify(Nucleo)      + ';',
        'window.EJS_gameUrl='      + JSON.stringify(UrlJuego)    + ';',
        'window.EJS_GameName='     + JSON.stringify(NombreJuego) + ';',
        'window.EJS_gameID='       + JSON.stringify(IdJuego)     + ';',
        'window.EJS_pathtodata='   + JSON.stringify(Cdn)         + ';',
        'window.EJS_paths='        + RutasEjs                    + ';',
        'window.EJS_startOnLoaded=true;',
        'window.EJS_color="#00ffcc";',
        'window.EJS_backgroundColor="#000000";',
        'window.EJS_fastForwardSpeed=2;',
        'window.EJS_throttle=60;',
        'window.EJS_enableLogging=false;',
        'window.EJS_VSync=false;',
        'window.EJS_audioBufferSize=2048;',
        'window.EJS_frameskip=-1;',
        'window.EJS_cheats=[];',
        'document.addEventListener("visibilitychange",function(){if(document.hidden){console.log("Pausado");}else{console.log("Reanudado");}});',
        PartesBios,
        PartesModoNavegador,
        'window.EJS_defaultControls=' + ControlesPredeterminados + ';',
        '</scr' + 'ipt>',
        '<scr' + 'ipt src="' + Cdn + 'loader.js"></scr' + 'ipt>',
        '</body></html>'
    ].join("\n");

    var BlobContenido = new Blob([ContenidoHtml], { type: "text/html" });
    var UrlBlob       = URL.createObjectURL(BlobContenido);
    var IframeNuevo   = document.createElement("iframe");
    IframeNuevo.id    = "IframeEmulador";
    IframeNuevo.setAttribute("allow", "fullscreen *; autoplay *");
    IframeNuevo.className = "Activo";
    IframeNuevo.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:none;background:#000;z-index:1;";
    IframeNuevo.onload = function () { URL.revokeObjectURL(UrlBlob); };
    IframeNuevo.src    = UrlBlob;
    document.getElementById("IframeEmulador").replaceWith(IframeNuevo);
}


// -------------- Detener El Juego --------------

function DetenerJuego() {

    var IframeVacio = document.createElement("iframe");
    IframeVacio.id  = "IframeEmulador";
    IframeVacio.setAttribute("allow", "fullscreen *; autoplay *");
    IframeVacio.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:none;background:#000;z-index:1;display:none;";

    document.getElementById("IframeEmulador").replaceWith(IframeVacio);
    document.getElementById("PantallaInicio").classList.remove("Oculta");

    ActualizarEstadoCabecera(null, "Sistema Online");

    if (document.fullscreenElement) {
        
        var FnSalir = document.exitFullscreen       ||
                      document.webkitExitFullscreen ||
                      document.mozCancelFullScreen  ||
                      document.msExitFullscreen;
        
        if (FnSalir) { 
            
            try { 
                FnSalir.call(document); 
            } catch (e) {} 
       
        }
    }

    try {
        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
    } catch (e) {}
    
}


// ------ Filtros De Pestañas De Consolas -------

document.querySelectorAll(".PestañaConsola").forEach(function (Pestaña) {
    
    Pestaña.addEventListener("click", function() {
        
        document.querySelectorAll(".PestañaConsola").forEach(function (P) {
            P.classList.remove("Activa");
        });

        Pestaña.classList.add("Activa");
        FiltroActivo = Pestaña.dataset.consola;
        RenderizarJuegos();

    });

});

RenderizarJuegos();