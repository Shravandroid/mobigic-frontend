import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_MOBIGIC_BACKEND_LINK, // Update with your Node.js server port
});

export default api;
