import { useMemo } from "react";
import {
    calcularSumaTotal,
    calcularTotalZocalo,
    calcularTotalDescuentos,
    calcularTotalConDescuentoEIVA,
    calcularTotalIva,
} from "../utils/operaciones";
import { CONFIG } from "../data/constants";
import { getEffectiveCoefficient } from "../utils/roleLogic";

export const useReportCalculations = (data, tabActivo) => {
    const updatedData = useMemo(() => {
        if (!data || !data.cabinets) return data;

        // Use centralized logic for coefficient
        const coefficient = getEffectiveCoefficient(data, tabActivo);

        // Optimized shallow copy instead of expensive full deep clone
        const newData = {
            ...data,
            cabinets: data.cabinets.map((item) => ({
                ...item,
                total: String(item.customcode) === "3333" ? item.total : item.total * coefficient,
            }))
        };

        return newData;
    }, [data, tabActivo]);

    // Centralized cabinet filtering - eliminates redundant filtering in PDF components
    const filteredCabinets = useMemo(() => {
        if (!updatedData?.cabinets) {
            return {
                decorativos: [],
                altos: [],
                bajos: [],
                complementos: [],
                murales: [],
                regletas: [],
                costados: [],
                accesorios: [],
            };
        }

        return {
            decorativos: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.DECORATIVOS.CODE
            ),
            altos: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.ALTOS.CODE
            ),
            bajos: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.BAJOS.CODE
            ),
            complementos: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.COMPLEMENTOS.CODE
            ),
            murales: updatedData.cabinets.filter(
                (item) =>
                    item.tipo === CONFIG.MODELNAME.MURALES.CODE ||
                    item.tipo === CONFIG.MODELNAME.SOBREENCIMERAS.CODE
            ),
            regletas: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.REGLETAS.CODE
            ),
            costados: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.COSTADOS.CODE
            ),
            accesorios: updatedData.cabinets.filter(
                (item) => item.tipo === CONFIG.MODELNAME.ACCESORIOS.CODE
            ),
        };
    }, [updatedData]);

    const totales = useMemo(() => {
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
        const totalIva = calcularTotalIva(
            resultado.totalConDescuento,
            updatedData.ivaCabinets
        );

        return {
            sumaTotal,
            totalZocalo,
            totalDescuentos,
            totalIva,
            resultadoFinal: resultado,
        };
    }, [updatedData]);

    return { updatedData, totales, filteredCabinets };
};

