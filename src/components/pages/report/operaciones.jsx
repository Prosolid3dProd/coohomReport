const formatNumber = (value, coefficient = 1) => {
  if (!value || isNaN(value)) return 0;
  return parseFloat(value) * parseFloat(coefficient);
};

const calcularSumaTotal = (cabinets, coeficiente) => {
  return cabinets.reduce((sum, item) => sum + (item.total * coeficiente), 0);
};

const calcularTotalZocalo = (zocalos = [], coefficient = 1) =>
  zocalos.reduce((acc, { precio = 0 }) => acc + formatNumber(precio, coefficient), 0);

const calcularTotalDescuentos = (data, importeTotal) => {
  const { discountCabinets = 0 } = data;
  const resultado = discountCabinets > 0 ? formatNumber(importeTotal * (data.discountCabinets / 100)) : 0;
  return resultado;
};

const calcularTotalIva = (importeTotal = 0, ivaPorcentaje = 21) =>
  formatNumber((importeTotal * parseFloat(ivaPorcentaje)) / 100);

const calcularTotalConDescuentoEIVA = (
  productos = [],
  zocalos = [],
  totalDescuentos = 0,
  ivaPorcentaje = 21,
  coefficient = 1
) => {
  // Aplicamos el coeficiente a cada elemento individual antes de sumar
  const sumaTotal = calcularSumaTotal(productos, coefficient);
  const totalZocalo = calcularTotalZocalo(zocalos, coefficient);
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
  formatNumber,
  calcularSumaTotal,
  calcularTotalZocalo,
  calcularTotalDescuentos,
  calcularTotalIva,
  calcularTotalConDescuentoEIVA,
};