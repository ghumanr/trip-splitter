import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("trip-splitter-user");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    config.headers["x-user-id"] = user.id;
  }

  return config;
});

export default api;