import { CONFIG } from "../config";

export const filterByType = (cabinets, typeCode) =>
  cabinets.filter((item) => item.tipo === typeCode);

export const groupCabinetsByType = (cabinets = []) => ({
  bajos: filterByType(cabinets, CONFIG.MODELNAME.BAJOS.CODE),
  murales: filterByType(cabinets, CONFIG.MODELNAME.MURALES.CODE),
  altos: filterByType(cabinets, CONFIG.MODELNAME.ALTOS.CODE),
  regletas: filterByType(cabinets, CONFIG.MODELNAME.REGLETAS.CODE),
  costados: filterByType(cabinets, CONFIG.MODELNAME.COSTADOS.CODE),
  decorativos: filterByType(cabinets, CONFIG.MODELNAME.DECORATIVOS.CODE),
  complementos: filterByType(cabinets, CONFIG.MODELNAME.COMPLEMENTOS.CODE),
  accesorios: filterByType(cabinets, CONFIG.MODELNAME.ACCESORIOS.CODE),
});
