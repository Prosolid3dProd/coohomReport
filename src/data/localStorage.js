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
const getPrecio = (key) => JSON.parse(localStorage.getItem(`Mostrar_Precios_${key}`));
const getTotales = (key) => JSON.parse(localStorage.getItem(`Mostrar_Totales_${key}`));

/**
 *
 *
 * @param {string} presupuesto
 * @param {boolean} toggle
 * @return {boolean}
 */
const setPrecio = (key, value) => {
    localStorage.setItem(`Mostrar_Precios_${key}`, JSON.stringify(value));
    return value;
  };

  const setTotales = (key, value) => {
    localStorage.setItem(`Mostrar_Totales_${key}`, JSON.stringify(value));
    return value;
  };

/**
 *
 *
 * @param {boolean | null} mostrarPrecio
 * @returns {boolean}
 */
const existePrecio = (value) => value !== null ? value : true;
const existeTotales = (value) => value !== null ? value : true;

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

