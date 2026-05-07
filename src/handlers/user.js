import apiClient, { handleApiError, API_TOKEN } from "./axiosInstance";

export const createUser = async (params) => {
  try {
    const { data } = await apiClient.post("/createUserCoohom", { ...params, token: API_TOKEN });
    return data;
  } catch (error) {
    return handleApiError(error, "crear usuario");
  }
};

export const resetPassword = async (params) => {
  try {
    const { data } = await apiClient.post("/resetPasswordUserCoohom", { ...params, token: API_TOKEN });
    return data;
  } catch (error) {
    return handleApiError(error, "restablecer contraseña");
  }
};

export const deleteUser = async (params) => {
  try {
    const { data } = await apiClient.post("/deleteUserCoohom", { ...params, token: API_TOKEN });
    return data;
  } catch (error) {
    return handleApiError(error, "eliminar usuario");
  }
};

export const getUsers = async (params) => {
  try {
    const { data } = await apiClient.post("/reportCoohomUserLists", { ...params, token: API_TOKEN });
    return data.data;
  } catch (error) {
    return handleApiError(error, "obtener usuarios");
  }
};

export const updateUser = async (params) => {
  try {
    const { data } = await apiClient.post("/editUserCoohom", { ...params, token: API_TOKEN });
    return data;
  } catch (error) {
    return handleApiError(error, "editar usuario");
  }
};

export const login = async (params) => {
  try {
    const { data } = await apiClient.post("/signinReporthom", { ...params, token: API_TOKEN });
    return data;
  } catch (error) {
    return { ok: false, message: error?.response?.data?.message || "Error de conexión" };
  }
};