import { solaImages } from "../../../data/solaImages";

const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMV97UpeAbbPPiPpJz8iFsmgeusjg_pVfTscc75Hm18KTA6np6O7Tro2YAaooQDdqq_zk&usqp=CAU";

export const grayscaleFilter = (color) => {
  const r = Math.floor(0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
  return { r, g: r, b: r };
};

export const convertirFecha = (fecha) => {
  try {
    const partes = fecha.split(" ");
    const fechaPartes = partes[0].split("-");
    const anio = fechaPartes[0];
    const mes = fechaPartes[1];
    const dia = fechaPartes[2];
    if (anio !== undefined && mes !== undefined && dia !== undefined) {
      return `${dia}/${mes}/${anio}`;
    }
  } catch {
    return fecha;
  }
};

export const loadImage = (serial) => {
  const found = solaImages.find((item) => item.serial === serial);
  return found?.link || FALLBACK_IMAGE;
};

export const verificarVariable = (material) => {
  if (typeof material === "string") return material;
  if (typeof material === "object" && material !== null) {
    if (material.materialCabinet !== null) return material.materialCabinet;
  }
};
