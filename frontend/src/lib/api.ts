import axios from "axios";

export const authapi = axios.create({
  baseURL: "http://localhost:3000/api/auth", // backend URL
  timeout: 5000, // 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const urlapi = axios.create({
  baseURL: "http://localhost:3000/api/url", // backend URL
  timeout: 5000, // 5 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
