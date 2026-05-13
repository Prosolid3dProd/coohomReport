import { useState, useCallback } from "react";
import {
  existePrecio,
  existeTotales,
  existeIvaIncluido,
  getPrecio,
  getTotales,
  getIvaIncluido,
  setPrecio,
  setTotales,
  setIvaIncluido as saveIvaIncluido,
} from "../../../shared/lib/storage";

export const useReportConfig = () => {
  const [precios, setPrecios] = useState({
    C: existePrecio(getPrecio("C")),
    F: existePrecio(getPrecio("F")),
    P: existePrecio(getPrecio("P")),
  });

  const [totales, setTotalesState] = useState({
    Encimeras: existeTotales(getTotales("Encimeras")),
    Equipamiento: existeTotales(getTotales("Equipamiento")),
    Electrodomesticos: existeTotales(getTotales("Electrodomesticos")),
  });

  const [ivaIncluido, setIvaIncluidoState] = useState(() =>
    existeIvaIncluido(getIvaIncluido())
  );

  const handlePrecioChange = useCallback((key) => {
    setPrecios((prev) => {
      const newValue = !prev[key];
      setPrecio(key, newValue);
      return { ...prev, [key]: newValue };
    });
  }, []);

  const handleTotalesChange = useCallback((key) => {
    setTotalesState((prev) => {
      const newValue = !prev[key];
      setTotales(key, newValue);
      return { ...prev, [key]: newValue };
    });
  }, []);

  const handleIvaIncluidoChange = useCallback((value) => {
    const newValue = typeof value === "boolean" ? value : !ivaIncluido;
    saveIvaIncluido(newValue);
    setIvaIncluidoState(newValue);
  }, [ivaIncluido]);

  return {
    precios,
    totales,
    ivaIncluido,
    handlePrecioChange,
    handleTotalesChange,
    handleIvaIncluidoChange,
  };
};
