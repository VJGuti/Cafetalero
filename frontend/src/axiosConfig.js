// src/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Base URL del backend
});

// Middleware para agregar el token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtiene el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;