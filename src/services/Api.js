import axios from "axios";

export const urlApi = 'https://aafta-backend.vercel.app/';

const Api = axios.create({
  baseURL: 'https://aafta-backend.vercel.app/',
  headers:{
  'Content-Type': 'application/json'
  }
});

export default Api;