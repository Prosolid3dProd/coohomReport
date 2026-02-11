import api from "./api";
import { CONFIG } from "../data/constants";

// Removed local axios instance and interceptors - now using api.js

export const createUser = async (params) => {
  try {
    const data = await api.post("/createUserCoohom", params);
    return data;
  } catch (error) {
    return error;
  }
};

export const resetPassword = async (params) => {
  try {
    const data = await api.post("/resetPasswordUserCoohom", params);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteUser = async (params) => {
  try {
    const data = await api.post(`${CONFIG.API.BACKEND_URL}/deleteUserCoohom`, params);
    return data; // Changed from data.data
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUsers = async (params) => {
  try {
    // Backend requires specific API KEY, not JWT
    const data = await api.post("/reportCoohomUserLists", {
      ...params,
      token: CONFIG.API.TOKEN
    });
    return data;
  } catch (error) {
    // API interceptor handles logging
    return false;
  }
};

export const updateUser = async (params) => {
  try {
    const data = await api.post(`${CONFIG.API.BACKEND_URL}/editUserCoohom`, params);
    return data; // Changed from data.data
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const login = async (params) => {
  try {
    const data = await api.post("/signinReporthom", params);
    if (data.ok && data.user) {
      localStorage.setItem(
        "campaign",
        data.user.role === "admin" ? CONFIG.ROLE.ADMIN : CONFIG.ROLE.CLIENT
      );
    }
    return data;
  } catch (error) {
    return false;
  }
};