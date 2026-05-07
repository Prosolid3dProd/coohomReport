import { useMemo } from "react";
import {
  calcularTotalIva,
  calcularSumaTotal,
  calcularTotalZocalo,
  calcularTotalDescuentos,
  calcularTotalConDescuentoEIVA,
} from "../components/pages/report/operaciones";

export const useReportTotals = (updatedData) => {
  return useMemo(() => {
    if (!updatedData || !updatedData.cabinets) {
      return {
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
    }

    const sumaTotal = calcularSumaTotal(updatedData.cabinets, 1);
    const totalZocalo = calcularTotalZocalo(updatedData.infoZocalos, 1);
    const importeTotalLocal = sumaTotal + totalZocalo;
    const totalDescuentos = calcularTotalDescuentos(updatedData, importeTotalLocal);
    const resultado = calcularTotalConDescuentoEIVA(
      updatedData.cabinets,
      updatedData.infoZocalos,
      totalDescuentos,
      updatedData.ivaCabinets,
      1
    );
    const totalIva = calcularTotalIva(resultado.totalConDescuento, updatedData.ivaCabinets);

    return {
      sumaTotal,
      totalZocalo,
      totalDescuentos,
      totalIva,
      resultadoFinal: resultado,
    };
  }, [updatedData]);
};
