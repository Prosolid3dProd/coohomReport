/** @type {number} */
const breakPointMD = 768

/**
 *
 *
 * @param {number} width --> Ancho pantalla
 * @param {number} max --> condición cambiar botón (texto a Icon)
 */
const breakpoint = (width, max) => width >= max

/**
 *
 *
 * @param {number} size --> Tamaño de pantalla (Ancho)
 * @param {string} text --> Nombre Botón
 * @param {Component} Icon --> Icono Botón 
 */
const typeOfText = (size, text, Icon) => size ? text : Icon

/**
 *
 *
 * @param {Event} evento
 * @return {string} --> Índice Mueble agregar Variante 
 */
const obtenerMuebleIndex = (evento) => {
    const boton = evento.currentTarget.getAttribute('data-index')
    return boton
}

export {
    breakPointMD,
    breakpoint, obtenerMuebleIndex, typeOfText
}
