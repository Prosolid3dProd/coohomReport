import axios from "axios";
import Cookies from "js-cookie";
import { CONFIG } from "../data/constants";

// const backendUrl = "http://localhost:2002";
const backendUrl = "https://octopus-app-dgmcr.ondigitalocean.app";
// const backendUrl = "https://api.simulhome.com/coohomReport"
const token = "Bc8V2Gb8D6KI6pA0Swheudblx1igSyqH";

axios.defaults.baseURL = backendUrl;

axios.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("token") || token;
    config.headers.Authorization = authToken;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createUser = async (params) => {
  try {
    const { data } = await axios.post("/createUserCoohom", {
      ...params,
      token,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error;
  }
};

export const resetPassword = async (params) => {
  try {
    const { data } = await axios.post("/resetPasswordUserCoohom", {
      ...params,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return error;
  }
};

export const deleteUser = async (params) => {
  try {
    const data = await axios.post(
      `${CONFIG.API.BACKEND_URL}/deleteUserCoohom`,
      {
        ...params,
        token,
      }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUsers = async (params) => {
  try {
    const { data } = await axios.post("/reportCoohomUserLists", {
      ...params,
      token,
    });
    return data;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateUser = async (params) => {
  try {
    const data = await axios.post(`${CONFIG.API.BACKEND_URL}/editUserCoohom`, {
      ...params,
      token,
    });
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const login = async (params) => {
  try {
    const { data } = await axios.post("/signinReporthom", { ...params, token });
    if (data.ok && data.user) {
      localStorage.setItem(
        "campaign",
        data.user.role === "admin" ? CONFIG.ROLE.ADMIN : CONFIG.ROLE.CLIENT
      );
    }
    return data;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

const handleAxiosError = (error) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error", error.message);
  }
};