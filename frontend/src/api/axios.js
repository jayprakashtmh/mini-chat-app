import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token && !config.url.includes("/auth/")) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

// 🔥 GLOBAL RESPONSE HANDLER
api.interceptors.response.use(
  response => response,
  error => {

    if (error.response &&
        (error.response.status === 401 ||
         error.response.status === 403)) {

      localStorage.removeItem("token");
      localStorage.removeItem("username");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;