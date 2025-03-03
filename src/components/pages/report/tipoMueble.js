// import { getCabinets } from "../../content/logic";
//
// /** @type {object.<string[]>} */
// const MUEBLES_TIPOS = Object.freeze({
//   BAJOS: ["B", "M", "S", "C", "R"],
//   ALTOS: ["A"],
// });
//
// /**
//  *
//  *
//  * @param {Array} tipoMueble --> Filtrar según el tipo de Mueble
//  * @return {Array} --> Muebles Filtrados por tips
//  */
// const obtenerMuebles = (tipoMueble) => {
//   /** @type {Array.object} */
//   const muebles = getCabinets();
//   if (!muebles) return [];
//
//   return muebles.filter(({ tipo }) => {
//     if (tipoMueble.includes(tipo)) return tipo;
//   });
// };
//
// /** @type {number[]} */
// const bajos = obtenerMuebles(MUEBLES_TIPOS.BAJOS);
//
// /** @type {number[]} */
// const altos = obtenerMuebles(MUEBLES_TIPOS.ALTOS);
//
// export { bajos, altos };
