import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://echo-chat-8z4f.onrender.com/api",
  withCredentials: true,
});