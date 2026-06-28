// ---------- Mapa de Iconos Por Juego ----------

var IconosPorJuego = {
    "Pac-Mac":            "ti-circle-dotted",
    "Super Mario Bros 3": "ti-start",
    "Kirby's Adventures": "ti-wind",
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

var ClaseEtiqueta      = { nes: "EtiquetaNes", ps1: "EtiquetaPa1" };
var MapaNucleo         = { nes: "nes",         ps1: "psx" };
var CarpetaRoms        = { nes: "NindendoNes", ps1: "PlayStation1" };
var ExtensionesRom     = { nes: ".nes",        ps1: ".bin" };

var RutasBios          = { ps1: "./bios/scph1001.bin" };
var UrlCdn             = "https://cdn.emulatorjs.org/stable/data/";

(function PrecargarRecursos() {
    
    var RecursosPrecarga = [
        { rel: "prefetch",   href: UrlCdn + "loader.js" },
        { rel: "prefetch",   href: UrlCdn + "emulator.min.js" },
        { rel: "preconnect", href: UrlCdn + "https://cdn.emulatorjs.org" }
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

})

RenderizarJuegos();