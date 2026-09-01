import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api/proxy",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
