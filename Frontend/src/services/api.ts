import axios from "axios";

const api = axios.create({
  baseURL: "https://online-examination-portal-1-52p1.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;