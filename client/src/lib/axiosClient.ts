import axios from "axios";

const baseURL = "/api/v1";

const config = {
  baseURL,
  withCredentials: true,
};

const axiosClient = axios.create(config);

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       queryClient.clear();
//       toast.error("Session expired. Please log in again.");
//     }
//     return Promise.reject(error);
//   },
// );

export default axiosClient;
