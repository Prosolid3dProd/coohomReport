const formatNumber = (x) => {
  if (!x) return 0;
  const result = parseFloat(x);
  return Math.round(result);
};

const calcularSumaTotal = (productos) =>
  productos.reduce((acumulador, { total }) => acumulador + (parseFloat(total) || 0), 0);

const calcularTotalZocalo = (zocalos) =>
  zocalos.reduce((total, { precio = 0 }) => total + (parseFloat(precio) || 0), 0);

const calcularTotalDescuentos = ({ discountCabinets = 0 }) => {
  return parseFloat(discountCabinets) || 0;
};

const calcularTotalIva = (importeTotal, ivaPorcentaje = 21) =>
  (parseFloat(importeTotal) * parseFloat(ivaPorcentaje)) / 100;

const calcularTotalConDescuentoEIVA = (
  productos,
  zocalos,
  totalDescuentos,
  ivaPorcentaje
) => {
  const sumaTotal = calcularSumaTotal(productos);
  const totalZocalo = calcularTotalZocalo(zocalos);
  const importeTotal = sumaTotal + totalZocalo;
  const totalConDescuento = importeTotal - totalDescuentos;
  const ivaCalculado = calcularTotalIva(totalConDescuento, ivaPorcentaje);
  const totalFinal = totalConDescuento + ivaCalculado;

  return {
    importeTotal,
    descuentoAplicado: totalDescuentos,
    totalConDescuento,
    ivaCalculado,
    totalFinal,
  };
};

export {
  calcularTotalIva,
  calcularTotalDescuentos,
  calcularTotalZocalo,
  calcularTotalConDescuentoEIVA,
  calcularSumaTotal,
  formatNumber,
};