import axios from "axios";
import { removeStoredUser, getStoredUser } from "./userStorage";
import router from "./router";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      [401, 419].includes(error.response.status) &&
      getStoredUser()
    ) {
      removeStoredUser();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
