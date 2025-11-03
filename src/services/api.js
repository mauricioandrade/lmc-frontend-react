import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição');
    } else if (error.response) {
      console.error('Erro do servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    }
    return Promise.reject(error);
  },
);

export const getProdutos = () => {
  return apiClient.get('/config/produtos');
};

export const getTanquesPorProduto = (produtoId) => {
  return apiClient.get(`/config/tanques?produtoId=${produtoId}`);
};

export const getBicosPorTanque = (tanqueId) => {
  return apiClient.get(`/config/bicos?tanqueId=${tanqueId}`);
};

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

export const adicionarMedicao = (medicaoData) => {
  return apiClient.post('/lmc/medicoes', medicaoData);
};

export const atualizarMedicao = (id, medicaoData) => {
  return apiClient.put(`/lmc/medicoes/${id}`, medicaoData);
};

export const deletarMedicao = (id) => {
  return apiClient.delete(`/lmc/medicoes/${id}`);
};

export const adicionarVenda = (vendaData) => {
  return apiClient.post('/lmc/vendas', vendaData);
};

export const atualizarVenda = (id, vendaData) => {
  return apiClient.put(`/lmc/vendas/${id}`, vendaData);
};

export const deletarVenda = (id) => {
  return apiClient.delete(`/lmc/vendas/${id}`);
};

export const adicionarCompra = (compraData) => {
  return apiClient.post('/lmc/compras', compraData);
};

export const atualizarCompra = (id, compraData) => {
  return apiClient.put(`/lmc/compras/${id}`, compraData);
};

export const deletarCompra = (id) => {
  return apiClient.delete(`/lmc/compras/${id}`);
};

export default apiClient;
