const getPrecio = (key) => JSON.parse(localStorage.getItem(`Mostrar_Precios_${key}`));
const getTotales = (key) => JSON.parse(localStorage.getItem(`Mostrar_Totales_${key}`));

const setPrecio = (key, value) => {
  localStorage.setItem(`Mostrar_Precios_${key}`, JSON.stringify(value));
  return value;
};

const setTotales = (key, value) => {
  localStorage.setItem(`Mostrar_Totales_${key}`, JSON.stringify(value));
  return value;
};

const existePrecio = (value) => value !== null ? value : true;
const existeTotales = (value) => value !== null ? value : true;

const getLocalToken = () => JSON.parse(localStorage.getItem("token"));
const setLocalToken = (token) => localStorage.setItem("token", JSON.stringify(token));

export {
  getPrecio,
  setPrecio,
  getTotales,
  setTotales,
  existePrecio,
  existeTotales,
  getLocalToken,
  setLocalToken,
};
