import axios, { AxiosError } from "axios";

const apiClient = axios.create({
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

export { AxiosError };
export default apiClient;
