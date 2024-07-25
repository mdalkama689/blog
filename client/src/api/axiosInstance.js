import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1";

const axisoInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axisoInstance;
