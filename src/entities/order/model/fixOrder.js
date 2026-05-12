export const fixOrder = (order, tab = 0, role = "client", onSuccess = () => {}) => {
  let total = 0;
  let priceTotal = 0;
  let cabinetsArray = [];
  let coefficient;

  if (role === "admin") {
    if (tab === 0 || tab === 1) {
      coefficient = order?.userId?.coefficient;
    } else if (tab === 2 || tab === 3) {
      coefficient = order?.coefficient;
    }
  } else if (role === "client") {
    if (tab === 0 || tab === 1) {
      coefficient = order?.userId?.coefficient;
    } else if (tab === 2 || tab === 3) {
      coefficient = order?.userId?.coefficientVenta;
    }
  }

  if (order) {
    order.cabinets.forEach((item) => {
      let totalVariants = 0;
      priceTotal = parseFloat(item.total) * parseFloat(coefficient);
      total += priceTotal;

      item.variants?.forEach((variant) => {
        totalVariants += parseFloat(variant.value) * parseFloat(coefficient);
      });
      cabinetsArray.push({ ...item, priceTotal, priceVariants: totalVariants });
    });

    let discountEncimerasPorcentaje = 0;
    let discountCabinetsPorcentaje = 0;
    let discountElectrodomesticosPorcentaje = 0;
    let discountEquipamientosPorcentaje = 0;
    let ivaEncimerasPorcentaje = 0;
    let ivaCabinetsPorcentaje = 0;
    let ivaElectrodomesticosPorcentaje = 0;
    let ivaEquipamientosPorcentaje = 0;

    if (parseFloat(order.discountEncimeras) > 0)
      discountEncimerasPorcentaje = parseFloat(total) * (parseFloat(order.discountEncimeras) / 100);
    if (parseFloat(order.discountCabinets) > 0)
      discountCabinetsPorcentaje = parseFloat(total) * (parseFloat(order.discountCabinets) / 100);
    if (parseFloat(order.discountElectrodomesticos) > 0)
      discountElectrodomesticosPorcentaje = parseFloat(total) * (parseFloat(order.discountElectrodomesticos) / 100);
    if (parseFloat(order.discountEquipamientos) > 0)
      discountEquipamientosPorcentaje = parseFloat(total) * (parseFloat(order.discountEquipamientos) / 100);
    if (parseFloat(order.ivaEncimeras) > 0)
      ivaEncimerasPorcentaje = (parseFloat(total) * parseFloat(order.ivaEncimeras)) / 100;
    if (parseFloat(order.ivaCabinets) > 0)
      ivaCabinetsPorcentaje = (parseFloat(total) * parseFloat(order.ivaCabinets)) / 100;
    if (parseFloat(order.ivaElectrodomesticos) > 0)
      ivaElectrodomesticosPorcentaje = (parseFloat(total) * parseFloat(order.ivaElectrodomesticos)) / 100;
    if (parseFloat(order.ivaEquipamientos) > 0)
      ivaEquipamientosPorcentaje = (parseFloat(total) * parseFloat(order.ivaEquipamientos)) / 100;

    const iva = ivaEncimerasPorcentaje + ivaCabinetsPorcentaje + ivaElectrodomesticosPorcentaje + ivaEquipamientosPorcentaje;

    const orderJson = {
      ...order,
      importe: parseFloat(total),
      iva: parseFloat(iva),
      total:
        parseFloat(total) -
          discountEncimerasPorcentaje -
          discountCabinetsPorcentaje -
          discountElectrodomesticosPorcentaje -
          discountEquipamientosPorcentaje +
          parseFloat(iva) || 0,
      cabinets: cabinetsArray,
      discountEncimerasPorcentaje,
      discountCabinetsPorcentaje,
      discountElectrodomesticosPorcentaje,
      discountEquipamientosPorcentaje,
      ivaEncimerasPorcentaje,
      ivaCabinetsPorcentaje,
      ivaElectrodomesticosPorcentaje,
      ivaEquipamientosPorcentaje,
    };

    onSuccess();
    return orderJson;
  }
};
