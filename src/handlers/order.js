import api from "./api";
import { CONFIG } from "../data/constants";
import { getEffectiveCoefficient, getRole } from "../utils/roleLogic";
import {
  formatNumber
} from "../utils/operaciones";

// ---- LLAMADAS API ----

export const createOrder = async (params) => {
  try {
    return await api.post(`/${CONFIG.API.ENDPOINT}`, params);
  } catch (error) {
    return false;
  }
};

export const createCabinetByUser = async (params) => {
  try {
    return await api.post("/reportCoohomCabinetCreate", params);
  } catch (error) {
    return false;
  }
};

export const updateOrder = async (params) => {
  try {
    return await api.put(`/${CONFIG.API.ENDPOINT}`, params);
  } catch (error) {
    return false;
  }
};

export const updateProfile = async (params) => {
  try {
    return await api.put("/profileUpdate", params);
  } catch (error) {
    return false;
  }
};

export const getOrders = async (params) => {
  try {
    return await api.post("/reportsCoohom", params);
  } catch (error) {
    return false;
  }
};

export const getComplements = async (params) => {
  try {
    return await api.get("/reportCoohomComplements", params);
  } catch (error) {
    return false;
  }
};

export const getComplementsByText = async (params) => {
  try {
    return await api.post("/reportCoohomComplementsbyText", params);
  } catch (error) {
    return false;
  }
};

export const getOrderById = async (params) => {
  try {
    const response = await api.post("/reporthomById", params);
    // Guardamos en local para persistencia rápida
    localStorage.setItem("order", JSON.stringify(response));
    return response;
  } catch (error) {
    return false;
  }
};

export const getProfile = async (params) => {
  try {
    return await api.post("/getProfile", params);
  } catch (error) {
    return false;
  }
};

export const CreateOrderDetails = async (params) => {
  try {
    return await api.post("/reporthomDetails", params);
  } catch (error) {
    return false;
  }
};

export const updateOrderDetails = async (params) => {
  try {
    return await api.put("/reporthomDetails", params);
  } catch (error) {
    return false;
  }
};

export const updateCabinetsOrder = async (params) => {
  try {
    return await api.post("/reporthomUpdateCabinets", params);
  } catch (error) {
    return false;
  }
};

export const archivedOrderDetails = async (params) => {
  try {
    return await api.put("/reporthomDetails", params);
  } catch (error) {
    return false;
  }
};

export const handleArchivedOrderDetails = async (params) => {
  try {
    return await api.post("/reporthomComplementDetailsDelete", params);
  } catch (error) {
    return false;
  }
};

export const updateCabinet = async (params) => {
  try {
    return await api.put("/reportCoohomCabinets", params);
  } catch (error) {
    return false;
  }
};

export const archivedOrder = async (params) => {
  try {
    return await api.put("/archivedReportCoohom", params);
  } catch (error) {
    return false;
  }
};

export const deleteComplements = async (params) => {
  try {
    return await api.post("/eliminarPorCodigo", params);
  } catch (error) {
    return false;
  }
};

export const importLibrary = async (formData) => {
  try {
    await api.upload("/cargarNuevoXlsxSola", formData);
  } catch (error) {
    console.error("Error al subir archivo:", error);
  }
};

// ---- FUNCIONES LOCALES Y HELPERS ----

export const getLocalOrder = () => {
  try {
    const str = localStorage.getItem("order");
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
};

export const setLocalOrder = async (params) => {
  return new Promise((resolve) => {
    localStorage.setItem("order", JSON.stringify(params));
    resolve(params);
  });
};

// Lógica central para recalcular precios y coeficientes
export const fixOrder = (order, tab = 0, onSuccess = () => { }) => {
  if (!order) return null;

  let total = 0;
  let priceTotal = 0;
  let cabinetsArray = [];

  const role = getRole();
  const coefficient = getEffectiveCoefficient(order, tab, role);

  // Recalcular precios de gabinetes y variantes
  order.cabinets.forEach((item) => {
    let totalVariants = 0;

    priceTotal = formatNumber(item.total, coefficient);
    total += priceTotal;

    item.variants?.forEach((variant) => {
      totalVariants += formatNumber(variant.value, coefficient);
    });
    cabinetsArray.push({
      ...item,
      priceTotal,
      priceVariants: totalVariants,
    });
  });

  // Helper para calcular porcentajes de descuento/IVA
  const calculatePart = (total, percentage) =>
    percentage > 0 ? total * (percentage / 100) : 0;

  const discountEncimerasPorcentaje = calculatePart(total, parseFloat(order.discountEncimeras));
  const discountCabinetsPorcentaje = calculatePart(total, parseFloat(order.discountCabinets));
  const discountElectrodomesticosPorcentaje = calculatePart(total, parseFloat(order.discountElectrodomesticos));
  const discountEquipamientosPorcentaje = calculatePart(total, parseFloat(order.discountEquipamientos));

  const ivaEncimerasPorcentaje = calculatePart(total, parseFloat(order.ivaEncimeras));
  const ivaCabinetsPorcentaje = calculatePart(total, parseFloat(order.ivaCabinets));
  const ivaElectrodomesticosPorcentaje = calculatePart(total, parseFloat(order.ivaElectrodomesticos));
  const ivaEquipamientosPorcentaje = calculatePart(total, parseFloat(order.ivaEquipamientos));

  const iva = ivaEncimerasPorcentaje + ivaCabinetsPorcentaje + ivaElectrodomesticosPorcentaje + ivaEquipamientosPorcentaje;
  const totalDiscounts = discountEncimerasPorcentaje + discountCabinetsPorcentaje + discountElectrodomesticosPorcentaje + discountEquipamientosPorcentaje;

  const orderJson = {
    ...order,
    importe: parseFloat(total),
    iva: parseFloat(iva),
    total: parseFloat(total) - totalDiscounts + parseFloat(iva) || 0,
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

  setLocalOrder(orderJson);
  onSuccess();
  return orderJson;
};
