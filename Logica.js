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
                { Etiqueta: "K (Botón A)", Tecla: "K" },
                { Etiqueta: "J (Botón B)", Tecla: "J" }
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
                { Etiqueta: "B (X)",         Tecla: "K" },
                { Etiqueta: "Y (Triángulo)", Tecla: "J" },
                { Etiqueta: "A (Cuadrado)",  Tecla: "L" },
                { Etiqueta: "X (Círculo)",   Tecla: "L" }
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

    var Carpeta   = CarpetaRom[Juego.Consola];
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

    if (!EnvoltorioEmulador) return;

    var FnPantalla = EnvoltorioEmulador.requestFullscreen       ||
                     EnvoltorioEmulador.webkitRequestFullscreen ||
                     EnvoltorioEmulador.mozRequestFullScreen    ||
                     EnvoltorioEmulador.msRequestFullscreen;

    if (FnPantalla) {

        try {

            var Promesa = FnPantalla.call(EnvoltorioEmulador);

            if (Promesa && Promesa.then) Promesa.then(BloquearPaisaje).catch(function () {});

            else setTimeout(BloquearPaisaje, 100);

        } catch (e) {}

    }

}


function BloquearPaisaje() {

    try {

        if (screen.orientation && screen.orientation.lock) {
            
            screen.orientation.lock("landscape").catch(function () {});
        
        }

    } catch (e) {}

}


// ------- Funcion Para Iniciar El Juego --------

function IniciarJuego() {

    if (!JuegoSeleccionado) {
        
        alert("Por favor, selecciona un juego antes de iniciar.");

        return;

    }

    if (EsDispositivoMovil()) SolicitarPantallaCompleta();

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