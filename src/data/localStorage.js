/** 
 * @type {string} 
 * 
 * Nombres Items LocalStorage
*/
const userData = 'userData'

const getUserData = () => JSON.parse(localStorage.getItem(userData))

/**
 *
 *
 * @param {object[]} data
 */
const setUserData = (data) => JSON.parse(localStorage.setItem(userData, data))

/**
 *
 *@returns {number} --> sección reporte en la que se encuentra
 */
const getTabActual = () => JSON.parse(localStorage.getItem('tabActual'))
/**
 *
 *
 * @param {number} tab --> tab activa (Report)
 */
const setTabActual = (tab) => localStorage.setItem('tabActual', JSON.stringify(tab))

/**
 *
 *
 * @param {string} presupuesto
 * @returns {boolean}
 */
const getPrecio = (presupuesto) => JSON.parse(localStorage.getItem(`Mostrar_Precios_${presupuesto.toUpperCase()}`))
const getTotales = (presupuesto) => JSON.parse(localStorage.getItem(`Mostrar_Totales_${presupuesto.toUpperCase()}`))

/**
 *
 *
 * @param {string} presupuesto
 * @param {boolean} toggle
 * @return {boolean}
 */
const setPrecio = (presupuesto, toggle) => {
    localStorage.setItem(`Mostrar_Precios_${presupuesto.toUpperCase()}`, JSON.stringify(toggle))
    return getPrecio(presupuesto)
}

const setTotales = (presupuesto, toggle) => {
    localStorage.setItem(`Mostrar_Totales_${presupuesto.toUpperCase()}`, JSON.stringify(toggle))
    return getTotales(presupuesto)
}

/**
 *
 *
 * @param {boolean | null} mostrarPrecio
 * @returns {boolean}
 */
const existePrecio = (mostrarPrecio) => mostrarPrecio !== null ? mostrarPrecio : true
const existeTotales = (mostrarTotales) => mostrarTotales !== null ? mostrarTotales : true

const getLocalToken = () => JSON.parse(localStorage.getItem('token'))

const setLocalToken = (token) => localStorage.setItem('token', JSON.stringify(token))

export {
    getUserData,
    setUserData,
    getTabActual,
    setTabActual,
    getPrecio,
    setPrecio,
    getTotales,
    setTotales,
    existePrecio,
    existeTotales,
    getLocalToken,
    setLocalToken
}

