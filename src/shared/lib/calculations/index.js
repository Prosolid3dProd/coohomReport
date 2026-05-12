export const formatNumber = (value, coefficient = 1) => {
  if (!value || isNaN(value)) return 0;
  return parseFloat(value) * parseFloat(coefficient);
};

export const calcularSumaTotal = (cabinets, coeficiente) =>
  cabinets.reduce((sum, item) => sum + item.total * coeficiente, 0);

export const calcularTotalZocalo = (zocalos = [], coefficient = 1) =>
  zocalos.reduce((acc, { precio = 0 }) => acc + formatNumber(precio, coefficient), 0);

export const calcularTotalDescuentos = (data, importeTotal) => {
  const { discountCabinets = 0 } = data;
  return discountCabinets > 0 ? formatNumber(importeTotal * (discountCabinets / 100)) : 0;
};

export const calcularTotalIva = (importeTotal = 0, ivaPorcentaje = 21) =>
  formatNumber((importeTotal * parseFloat(ivaPorcentaje)) / 100);

export const calcularTotalConDescuentoEIVA = (
  productos = [],
  zocalos = [],
  totalDescuentos = 0,
  ivaPorcentaje = 21,
  coefficient = 1
) => {
  const sumaTotal = calcularSumaTotal(productos, coefficient);
  const totalZocalo = calcularTotalZocalo(zocalos, coefficient);
  const importeTotal = sumaTotal + totalZocalo;
  const totalConDescuento = importeTotal - totalDescuentos;
  const ivaCalculado = calcularTotalIva(totalConDescuento, ivaPorcentaje);
  const totalFinal = totalConDescuento + ivaCalculado;
  return { importeTotal, descuentoAplicado: totalDescuentos, totalConDescuento, ivaCalculado, totalFinal };
};
