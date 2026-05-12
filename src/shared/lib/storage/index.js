export const getPrecio = (key) => JSON.parse(localStorage.getItem(`Mostrar_Precios_${key}`));
export const getTotales = (key) => JSON.parse(localStorage.getItem(`Mostrar_Totales_${key}`));
export const getIvaIncluido = () => JSON.parse(localStorage.getItem("iva_incluido"));

export const setPrecio = (key, value) => {
  localStorage.setItem(`Mostrar_Precios_${key}`, JSON.stringify(value));
  return value;
};

export const setTotales = (key, value) => {
  localStorage.setItem(`Mostrar_Totales_${key}`, JSON.stringify(value));
  return value;
};

export const setIvaIncluido = (value) => {
  localStorage.setItem("iva_incluido", JSON.stringify(value));
  return value;
};

export const existePrecio = (value) => (value !== null ? value : true);
export const existeTotales = (value) => (value !== null ? value : true);
export const existeIvaIncluido = (value) => (value !== null ? value : false);

export const getLocalToken = () => JSON.parse(localStorage.getItem("token"));
export const setLocalToken = (token) => localStorage.setItem("token", JSON.stringify(token));

export const getValue = (text) => JSON.parse(sessionStorage.getItem(`input${text}`));
export const setValue = (text, data) => sessionStorage.setItem(`input${text}`, JSON.stringify(data));
