// src/services/api.js
import axios from 'axios';

// Configure a URL base da sua API
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para tratar erros globalmente (opcional)
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição');
    } else if (error.response) {
      console.error('Erro do servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    }
    return Promise.reject(error);
  }
);

// ============== CONFIGURAÇÃO (ConfiguracaoController) ==============
// (Estes estão corretos, pois usam seu próprio controller)
export const getProdutos = () => {
  return apiClient.get('/config/produtos');
};

export const getTanquesPorProduto = (produtoId) => {
  return apiClient.get(`/config/tanques?produtoId=${produtoId}`);
};

export const getBicosPorTanque = (tanqueId) => {
  return apiClient.get(`/config/bicos?tanqueId=${tanqueId}`);
};

// ============== FOLHA LMC (LmcController) ==============
// (Estes estão corretos, pois já usam /lmc)
export const getFolha = (data, produtoId) => {
  return apiClient.get(`/lmc/folha?data=${data}&produtoId=${produtoId}`);
};

export const salvarFolhaLMC = (lmcData) => {
  return apiClient.post('/lmc', lmcData);
};

export const atualizarFolhaLMC = (id, lmcData) => {
  return apiClient.put(`/lmc/${id}`, lmcData);
};

export const deletarFolhaLMC = (id) => {
  return apiClient.delete(`/lmc/${id}`);
};

export const getRelatorio = (dataInicio, dataFim) => {
  return apiClient.get(`/lmc/relatorio?inicio=${dataInicio}&fim=${dataFim}`);
};


// ================== CORREÇÃO AQUI ==================
// Adicionado o prefixo "/lmc" em todas as rotas abaixo

// ============== MEDIÇÕES ==============
export const adicionarMedicao = (medicaoData) => {
  return apiClient.post('/lmc/medicoes', medicaoData); // <-- CORRIGIDO
};

export const atualizarMedicao = (id, medicaoData) => {
  return apiClient.put(`/lmc/medicoes/${id}`, medicaoData); // <-- CORRIGIDO
};

export const deletarMedicao = (id) => {
  return apiClient.delete(`/lmc/medicoes/${id}`); // <-- CORRIGIDO
};

// ============== VENDAS ==============
export const adicionarVenda = (vendaData) => {
  return apiClient.post('/lmc/vendas', vendaData); // <-- CORRIGIDO
};

export const atualizarVenda = (id, vendaData) => {
  return apiClient.put(`/lmc/vendas/${id}`, vendaData); // <-- CORRIGIDO
};

export const deletarVenda = (id) => {
  return apiClient.delete(`/lmc/vendas/${id}`); // <-- CORRIGIDO
};

// ============== COMPRAS ==============
export const adicionarCompra = (compraData) => {
  return apiClient.post('/lmc/compras', compraData); // <-- CORRIGIDO
};

export const atualizarCompra = (id, compraData) => {
  return apiClient.put(`/lmc/compras/${id}`, compraData); // <-- CORRIGIDO
};

export const deletarCompra = (id) => {
  return apiClient.delete(`/lmc/compras/${id}`); // <-- CORRIGIDO
};
// ================== FIM DA CORREÇÃO ==================

export default apiClient;