import axios from 'axios'

// Use the Laragon project host. Replace port if your backend runs on a specific port.
const API_BASE_URL = "http://gulayan-server-student-group4.test/api";

export const api = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true, // set to false kung hindi gagamit ng cookies
   headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
   },
   timeout: 20000
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization =  `Bearer ${token}`
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = data?.message ?? error?.message ?? "Error encountered.";

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
    return Promise.reject({ ...error, message, status });
  }
)

