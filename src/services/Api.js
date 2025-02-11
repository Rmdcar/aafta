import axios from "axios";

export const urlApi = 'https://aafta-backend.vercel.app/';

const Api = axios.create({
  baseURL: urlApi,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token no cabeçalho de todas as requisições
Api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // Recupera o token do sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;