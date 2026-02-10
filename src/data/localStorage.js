import Cookies from 'js-cookie';

/** 
 * @type {string} 
 * LocalStorage key for user data
 */
const userData = 'userData';

/**
 * Safely parse JSON from localStorage with fallback
 * @param {string} key - LocalStorage key
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely stringify and save to localStorage
 * @param {string} key - LocalStorage key
 * @param {*} value - Value to save
 * @returns {boolean} Success status
 */
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Get price visibility setting for a specific type
 * @param {string} key - Price type key (C, F, P)
 * @returns {boolean} Price visibility state
 */
const getPrecio = (key) => safeGetItem(`Mostrar_Precios_${key}`, true);

/**
 * Set price visibility setting for a specific type
 * @param {string} key - Price type key (C, F, P)
 * @param {boolean} value - New visibility state
 * @returns {boolean} The value that was set
 */
const setPrecio = (key, value) => {
  safeSetItem(`Mostrar_Precios_${key}`, value);
  return value;
};

/**
 * Get totals visibility setting for a specific category
 * @param {string} key - Category key (Encimeras, Equipamiento, Electrodomesticos)
 * @returns {boolean} Totals visibility state
 */
const getTotales = (key) => safeGetItem(`Mostrar_Totales_${key}`, true);

/**
 * Set totals visibility setting for a specific category
 * @param {string} key - Category key
 * @param {boolean} value - New visibility state
 * @returns {boolean} The value that was set
 */
const setTotales = (key, value) => {
  safeSetItem(`Mostrar_Totales_${key}`, value);
  return value;
};

/**
 * Get authentication token from Cookies
 * @returns {string|null} Token or null
 */
const getLocalToken = () => {
  return Cookies.get('token') || null;
};

/**
 * Save authentication token to Cookies
 * @param {string} token - Authentication token
 * @returns {void}
 */
const setLocalToken = (token) => {
  if (!token) {
    Cookies.remove('token');
    return;
  }
  // Set secure cookie (behaves like httpOnly on client side)
  Cookies.set('token', token, {
    secure: true,
    sameSite: 'Strict',
    expires: 7 // 7 days
  });
};

export {
  getPrecio,
  setPrecio,
  getTotales,
  setTotales,
  getLocalToken,
  setLocalToken
};
