const formatNumber = (x, coefficient = 1) => {
  if (!x) return 0;
  // Multiplicar y redondear el resultado por el coeficiente
  const result = parseFloat(x) * parseFloat(coefficient);

  // Devolver el valor redondeado a un número entero
  return Math.round(result);
};

const calcularSumaTotal = (productos, coefficient = 1) =>
  productos.reduce((acumulador, { total }) => acumulador + total * coefficient, 0);

const calcularTotalZocalo = (zocalos, coefficient = 1) =>
  zocalos.reduce((total, { precio = 0 }) => total + precio * coefficient, 0);

const calcularTotalDescuentos = (
  { discountCabinets, discountCabinetsPorcentaje = 0 },
  coefficient = 1
) => {
  return discountCabinets > 0 ? discountCabinetsPorcentaje * coefficient : 0;
};

const calcularTotalIva = (importeTotal, ivaPorcentaje = 21) =>
  (importeTotal * ivaPorcentaje) / 100; // No aplicamos coefficient aquí porque importeTotal ya lo tiene

const calcularTotalConDescuentoEIVA = (
  productos,
  zocalos,
  totalDescuentos,
  ivaPorcentaje,
  coefficient = 1
) => {
  // Aplicamos coefficient a cada elemento individualmente
  const sumaTotal = calcularSumaTotal(productos, coefficient);
  const totalZocalo = calcularTotalZocalo(zocalos, coefficient);

  // Sumamos los valores ya ajustados
  const importeTotal = sumaTotal + totalZocalo;

  // Aplicamos descuentos
  const totalConDescuento = importeTotal - totalDescuentos;

  // Calculamos el IVA sobre el total ya con descuento
  const ivaCalculado = calcularTotalIva(totalConDescuento, ivaPorcentaje);

  // Total final con IVA incluido
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
  formatNumber
};


// const calcularSumaTotal = (productos) => {
//   return productos.reduce((total, producto) => total + producto.priceTotal, 0);
// };

// let totalZocalo = data.infoZocalos.reduce(
//   (total, zocalo) => total + (zocalo.precio ? zocalo.precio : 0),
//   0
// );

// const calcularTotalDescuentos = (data) => {
//   let totalDescuentos = 0;
//   if (data.discountCabinets > 0) {
//     totalDescuentos += parseFloat(data.discountCabinetsPorcentaje) || 0;
//   }
//   return totalDescuentos;
// };

// const calcularTotalIva = (data) => {
//   let ivaCabinetsPorcentaje = parseFloat(data.ivaCabinets) || 21;
//   const totalIva = {
//     ivaCabinetsPorcentaje: ivaCabinetsPorcentaje,
//   };
//   return totalIva;
// };

// const calcularTotalConDescuento = (sumaTotal, totalZocalo, totalDescuentos) => {
//   return parseFloat(sumaTotal + totalZocalo - totalDescuentos).toFixed(2);
// };

// const calcularTotalConDescuentoEIVA = (
//   sumaTotal,
//   totalZocalo,
//   totalDescuentos,
//   totalIva
// ) => {
//   const total = sumaTotal + totalZocalo;
//   const totalConDescuento = total - totalDescuentos;
//   const totalConIva =
//     totalConDescuento * (1 + parseFloat(totalIva.ivaCabinetsPorcentaje) / 100);
//   return parseFloat(totalConIva).toFixed(2);
// };

// const calcularIva = (sumaTotalSinDescuento, totalIva) => {
//   const ivaCabinetsPorcentaje = totalIva.ivaCabinetsPorcentaje || 21;
//   return parseFloat(
//     sumaTotalSinDescuento * (ivaCabinetsPorcentaje / 100)
//   ).toFixed(2);
// };
