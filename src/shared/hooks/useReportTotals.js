import { useMemo } from "react";
import {
  calcularTotalIva,
  calcularSumaTotal,
  calcularTotalZocalo,
  calcularTotalDescuentos,
  calcularTotalConDescuentoEIVA,
} from "../lib/calculations";

const EMPTY_TOTALS = {
  sumaTotal: 0,
  totalZocalo: 0,
  totalDescuentos: 0,
  totalIva: 0,
  resultadoFinal: {
    importeTotal: 0,
    descuentoAplicado: 0,
    totalConDescuento: 0,
    ivaCalculado: 0,
    totalFinal: 0,
  },
};

export const useReportTotals = (updatedData, ivaIncluido = false) => {
  return useMemo(() => {
    if (!updatedData || !updatedData.cabinets) return EMPTY_TOTALS;

    const sumaTotal = calcularSumaTotal(updatedData.cabinets, 1);
    const totalZocalo = calcularTotalZocalo(updatedData.infoZocalos, 1);
    const importeTotalLocal = sumaTotal + totalZocalo;
    const totalDescuentos = calcularTotalDescuentos(updatedData, importeTotalLocal);
    const totalConDescuento = importeTotalLocal - totalDescuentos;

    if (ivaIncluido) {
      return {
        sumaTotal,
        totalZocalo,
        totalDescuentos,
        totalIva: 0,
        resultadoFinal: {
          importeTotal: importeTotalLocal,
          descuentoAplicado: totalDescuentos,
          totalConDescuento,
          ivaCalculado: 0,
          totalFinal: totalConDescuento,
        },
      };
    }

    const resultado = calcularTotalConDescuentoEIVA(
      updatedData.cabinets,
      updatedData.infoZocalos,
      totalDescuentos,
      updatedData.ivaCabinets,
      1
    );
    const totalIva = calcularTotalIva(resultado.totalConDescuento, updatedData.ivaCabinets);

    return { sumaTotal, totalZocalo, totalDescuentos, totalIva, resultadoFinal: resultado };
  }, [updatedData, ivaIncluido]);
};
