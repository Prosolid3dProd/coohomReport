import apiClient, { handleApiError, API_TOKEN } from "../../../shared/api";
import { parseJson3D } from "../../cabinet/parseJson3d";

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
    return handleApiError(error, "obtener ordenes");
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
    handleApiError(error, "importar libreria");
  }
};

export const getReportData = async (params) => {
  try {
    const { data } = await apiClient.post(`/reporthomReportData`, params);
    return data;
  } catch (error) {
    return handleApiError(error, "obtener datos de reporte");
  }
};

export const mergeAndUpdateOrder = async (json, existingOrders) => {
  const newData = await parseJson3D(json);
  const response = await createOrder(newData);
  const type = response?.validate ? "update" : "create";
  const existingIndex = existingOrders.findIndex((item) => item.orderCode === newData.orderCode);
  return { type, result: response?.result, index: existingIndex };
};

