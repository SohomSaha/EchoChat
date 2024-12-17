import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://echochat-adna.onrender.com/api",
  withCredentials: true,
});