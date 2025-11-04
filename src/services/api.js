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

// Interceptor (seu código está ótimo)
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    // ... (seu código de log de erro)
    return Promise.reject(error);
  }
);

// ============== CONFIGURAÇÃO (ConfiguracaoController) ==============
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


// ============== MEDIÇÕES ==============
export const adicionarMedicao = (folhaId, medicaoData) => {
  return apiClient.post(`/lmc/folhas/${folhaId}/medicoes`, medicaoData); 
};

export const atualizarMedicao = (id, medicaoData) => {
  return apiClient.put(`/lmc/medicoes/${id}`, medicaoData);
};

export const deletarMedicao = (id) => {
  return apiClient.delete(`/lmc/medicoes/${id}`);
};

// ============== VENDAS ==============
export const adicionarVenda = (folhaId, vendaData) => {
  return apiClient.post(`/lmc/folhas/${folhaId}/vendas`, vendaData); 
};

export const atualizarVenda = (id, vendaData) => {
  return apiClient.put(`/lmc/vendas/${id}`, vendaData);
};

export const deletarVenda = (id) => {
  return apiClient.delete(`/lmc/vendas/${id}`);
};

// ============== COMPRAS ==============
export const adicionarCompra = (folhaId, compraData) => {
  return apiClient.post(`/lmc/folhas/${folhaId}/compras`, compraData); 
};

export const atualizarCompra = (id, compraData) => {
  return apiClient.put(`/lmc/compras/${id}`, compraData);
};

export const deletarCompra = (id) => {
  return apiClient.delete(`/lmc/compras/${id}`);
};

// --- NOVO MÉTODO ADICIONADO ---
export const atualizarObservacoes = (folhaId, observacoesTexto) => {
  // Envia no formato que o Controller espera: {"observacoes": "texto..."}
  const data = { observacoes: observacoesTexto };
  return apiClient.put(`/lmc/folha/${folhaId}/observacoes`, data);
};
// --- FIM DA MUDANÇA ---

export default apiClient;