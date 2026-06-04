import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const config = {
  baseURL,
  withCredentials: true,
};

const axiosClient = axios.create(config);

export default axiosClient;
