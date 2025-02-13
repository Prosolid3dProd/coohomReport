import { getLocalOrder } from "../../../handlers/order";

const data = getLocalOrder();
const formatNumber = (x) => {
  if (!x) return 0;
  // Multiplicar y redondear el resultado
  const result = parseFloat(x) * parseFloat(data.coefficient);

  // Devolver el valor redondeado a un número entero
  return Math.round(result);
};

const calcularSumaTotal = (productos) =>
  productos.reduce((total, { priceTotal }) => total + priceTotal, 0);

const calcularTotalZocalo = (zocalos) =>
  zocalos.reduce((total, { precio = 0 }) => total + precio, 0);

const calcularTotalDescuentos = ({
  discountCabinets,
  discountCabinetsPorcentaje = 0,
}) => (discountCabinets > 0 ? parseFloat(discountCabinetsPorcentaje) : 0);

// Modificado: IVA como porcentaje del total calculado
const calcularTotalIva = (importeTotal, ivaPorcentaje = 21) =>
  (importeTotal * ivaPorcentaje) / 100; // 21% de `importeTotal`

const calcularTotalConDescuento = (sumaTotal, totalZocalo, totalDescuentos) => {
  const totalConDescuento = sumaTotal + totalZocalo - totalDescuentos;
  return { totalConDescuento, descuentoAplicado: totalDescuentos };
};

const calcularIva = (importe, totalIva) => parseFloat(importe * (totalIva / 100));

const calcularTotalConDescuentoEIVA = (
  sumaTotal,
  totalZocalo,
  totalDescuentos,
  ivaPorcentaje
) => {
  const { totalConDescuento, descuentoAplicado } = calcularTotalConDescuento(
    sumaTotal,
    totalZocalo,
    totalDescuentos
  );
  // Modificado: IVA calculado a partir del importe total
  const ivaCalculado = calcularTotalIva(totalConDescuento, ivaPorcentaje);
  const totalFinal = totalConDescuento + ivaCalculado;

  return {
    importeTotal: sumaTotal + totalZocalo,
    descuentoAplicado,
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
