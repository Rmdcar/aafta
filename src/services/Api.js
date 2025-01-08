import axios from "axios";

export const urlApi = 'https://localhost:3000/';

const Api = axios.create({
  baseURL: 'https://localhost:3000/',
  headers:{
  'Content-Type': 'application/json'
  }
});

export default Api;