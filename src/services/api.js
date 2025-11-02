// src/services/api.js
import axios from 'axios';

// 1. Configura a URL base da nossa API Spring Boot
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // A URL base do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

/* * FUNÇÕES PARA O 'ConfiguracaoController'
 */
export const getProdutos = () => {
  return apiClient.get('/config/produtos');
};

export const getTanquesPorProduto = (produtoId) => {
  return apiClient.get(`/config/tanques?produtoId=${produtoId}`);
};

export const getBicosPorTanque = (tanqueId) => {
  return apiClient.get(`/config/bicos?tanqueId=${tanqueId}`);
};


/* * FUNÇÕES PARA O 'LmcController'
 */
export const salvarFolhaLMC = (lmcData) => {
  return apiClient.post('/lmc', lmcData);
};

export const getRelatorio = (dataInicio, dataFim) => {
  return apiClient.get(`/lmc/relatorio?inicio=${dataInicio}&fim=${dataFim}`);
};

export default apiClient;