import apiClient, { handleApiError, API_TOKEN } from "./axiosInstance";
import { parseJson3D } from "../data";

const ENDPOINT = "reportCoohom";

export const createOrder = async (params) => {
  try {
    const { data } = await apiClient.post(`/${ENDPOINT}`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "crear orden");
  }
};

export const createCabinetByUser = async (params) => {
  try {
    const { data } = await apiClient.post(`/reportCoohomCabinetCreate`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "crear gabinete");
  }
};

export const updateOrder = async (params) => {
  try {
    const { data } = await apiClient.put(`/${ENDPOINT}`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "actualizar orden");
  }
};

export const updateProfile = async (params) => {
  try {
    const { data } = await apiClient.put(`/profileUpdate`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "actualizar perfil");
  }
};

export const getOrders = async (params) => {
  try {
    const { data } = await apiClient.post(`/reportsCoohom`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "obtener órdenes");
  }
};

export const getComplements = async (params) => {
  try {
    const { data } = await apiClient.get(`/reportCoohomComplements`, { params });
    return data.data;
  } catch (error) {
    return handleApiError(error, "obtener complementos");
  }
};

export const getComplementsByText = async (params) => {
  try {
    const { data } = await apiClient.post(`/reportCoohomComplementsbyText`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "buscar complementos");
  }
};

export const getOrderById = async (params) => {
  try {
    const { data } = await apiClient.post(`/reporthomById`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "obtener orden por ID");
  }
};

export const getProfile = async (params) => {
  try {
    const { data } = await apiClient.post(`/getProfile`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "obtener perfil");
  }
};

export const CreateOrderDetails = async (params) => {
  try {
    const { data } = await apiClient.post(`/reporthomDetails`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "crear detalles de orden");
  }
};

export const updateOrderDetails = async (params) => {
  try {
    const { data } = await apiClient.put(`/reporthomDetails`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "actualizar detalles de orden");
  }
};

// EXCEPCIÓN: /reporthomUpdateCabinets valida API_TOKEN en body, no Bearer JWT.
export const updateCabinetsOrder = async (params) => {
  try {
    const { data } = await apiClient.post(`/reporthomUpdateCabinets`, {
      ...params,
      token: API_TOKEN,
    });
    return data;
  } catch (error) {
    return handleApiError(error, "actualizar gabinetes");
  }
};

export const archivedOrderDetails = async (params) => {
  try {
    const { data } = await apiClient.put(`/reporthomDetails`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "archivar detalles");
  }
};

export const handleArchivedOrderDetails = async (params) => {
  try {
    const { data } = await apiClient.post(`/reporthomComplementDetailsDelete`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "eliminar detalle de complemento");
  }
};

export const updateCabinet = async (params) => {
  try {
    const { data } = await apiClient.put(`/reportCoohomCabinets`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "actualizar gabinete");
  }
};

export const archivedOrder = async (params) => {
  try {
    const { data } = await apiClient.put(`/archivedReportCoohom`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "archivar orden");
  }
};

export const deleteComplements = async (params) => {
  try {
    const { data } = await apiClient.post(`/eliminarPorCodigo`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "eliminar complemento");
  }
};

export const importLibrary = async (formData) => {
  try {
    await apiClient.post(`/cargarNuevoXlsxSola`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    handleApiError(error, "importar librería");
  }
};

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
      cabinetsArray.push({
        ...item,
        priceTotal,
        priceVariants: totalVariants,
      });
    });

    let discountEncimerasPorcentaje = 0;
    let discountCabinetsPorcentaje = 0;
    let discountElectrodomesticosPorcentaje = 0;
    let discountEquipamientosPorcentaje = 0;

    let ivaEncimerasPorcentaje = 0;
    let ivaCabinetsPorcentaje = 0;
    let ivaElectrodomesticosPorcentaje = 0;
    let ivaEquipamientosPorcentaje = 0;

    if (parseFloat(order.discountEncimeras) > 0) {
      discountEncimerasPorcentaje =
        parseFloat(total) * (parseFloat(order.discountEncimeras) / 100);
    }

    if (parseFloat(order.discountCabinets) > 0) {
      discountCabinetsPorcentaje =
        parseFloat(total) * (parseFloat(order.discountCabinets) / 100);
    }

    if (parseFloat(order.discountElectrodomesticos) > 0) {
      discountElectrodomesticosPorcentaje =
        parseFloat(total) * (parseFloat(order.discountElectrodomesticos) / 100);
    }

    if (parseFloat(order.discountEquipamientos) > 0) {
      discountEquipamientosPorcentaje =
        parseFloat(total) * (parseFloat(order.discountEquipamientos) / 100);
    }

    if (parseFloat(order.ivaEncimeras) > 0) {
      ivaEncimerasPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaEncimeras)) / 100;
    }

    if (parseFloat(order.ivaCabinets) > 0) {
      ivaCabinetsPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaCabinets)) / 100;
    }

    if (parseFloat(order.ivaElectrodomesticos) > 0) {
      ivaElectrodomesticosPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaElectrodomesticos)) / 100;
    }

    if (parseFloat(order.ivaEquipamientos) > 0) {
      ivaEquipamientosPorcentaje =
        (parseFloat(total) * parseFloat(order.ivaEquipamientos)) / 100;
    }

    const iva =
      ivaEncimerasPorcentaje +
      ivaCabinetsPorcentaje +
      ivaElectrodomesticosPorcentaje +
      ivaEquipamientosPorcentaje;

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

export const mergeAndUpdateOrder = async (json, existingOrders) => {
  const newData = await parseJson3D(json);
  const existingIndex = existingOrders.findIndex(
    (item) => item.orderCode === newData.orderCode
  );
  if (existingIndex !== -1) {
    const upData = await createOrder(newData);
    return { type: "update", result: upData.result, index: existingIndex };
  }
  const order = await createOrder(newData);
  return { type: "create", result: order.result };
};