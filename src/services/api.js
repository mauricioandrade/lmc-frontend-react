import axios from 'axios';

// Configure a URL base da sua API
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // A base URL continua /api
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// ============== EMPRESAS (SEÇÃO ATUALIZADA COM /config) ==============
/**
 * Busca todas as empresas.
 */
export const getTodasEmpresas = () => {
  // CORRIGIDO: Adicionado /config/
  return apiClient.get('/config/empresas');
};

/**
 * Salva (Cria ou Atualiza) uma empresa.
 */
export const salvarEmpresa = (empresaData) => {
  if (empresaData.id) {
    // CORRIGIDO: Adicionado /config/
    return apiClient.put(`/config/empresas/${empresaData.id}`, empresaData);
  } else {
    // CORRIGIDO: Adicionado /config/
    return apiClient.post('/config/empresas', empresaData);
  }
};

/**
 * Deleta uma empresa.
 */
export const deletarEmpresa = (id) => {
  // CORRIGIDO: Adicionado /config/
  return apiClient.delete(`/config/empresas/${id}`);
};
// --- FIM DA SEÇÃO EMPRESAS ---


// ============== CONFIGURAÇÃO (ConfiguracaoController) ==============
// (Estas já estavam corretas)
export const getProdutos = () => {
  return apiClient.get('/config/produtos');
};

export const getProdutoById = (id) => {
  return apiClient.get(`/config/produtos/${id}`);
};

export const salvarProduto = (produtoData) => {
  if (produtoData.id) {
    return apiClient.put(`/config/produtos/${produtoData.id}`, produtoData);
  } else {
    return apiClient.post('/config/produtos', produtoData);
}
};

export const deletarProduto = (id) => {
  return apiClient.delete(`/config/produtos/${id}`);
};

// --- FUNÇÕES DE TANQUE ---
export const getTanquesPorProduto = (produtoId) => {
  return apiClient.get(`/config/tanques?produtoId=${produtoId}`);
};

export const getTodosTanques = () => {
  return apiClient.get('/config/tanques/all');
};

export const salvarTanque = (tanqueData) => {
  if (tanqueData.id) {
    return apiClient.put(`/config/tanques/${tanqueData.id}`, tanqueData);
  } else {
    return apiClient.post('/config/tanques', tanqueData);
  }
};

export const deletarTanque = (id) => {
  return apiClient.delete(`/config/tanques/${id}`);
};

// --- NOVAS FUNÇÕES DE BICO ---
export const getBicosPorTanque = (tanqueId) => {
  return apiClient.get(`/config/bicos?tanqueId=${tanqueId}`);
};

export const getTodosBicos = () => {
  return apiClient.get('/config/bicos/all');
};

export const salvarBico = (bicoData) => {
  if (bicoData.id) {
    return apiClient.put(`/config/bicos/${bicoData.id}`, bicoData);
  } else {
    return apiClient.post('/config/bicos', bicoData);
  }
};

export const deletarBico = (id) => {
  return apiClient.delete(`/config/bicos/${id}`);
};
// --- FIM DAS FUNÇÕES DE BICO ---


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

export const atualizarObservacoes = (folhaId, observacoesTexto) => {
  const data = { observacoes: observacoesTexto };
  return apiClient.put(`/lmc/folha/${folhaId}/observacoes`, data);
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


export const adicionarVenda = (folhaId, vendaData) => {
  return apiClient.post(`/lmc/folhas/${folhaId}/vendas`, vendaData); 
};

export const atualizarVenda = (id, vendaData) => {
  return apiClient.put(`/lmc/vendas/${id}`, vendaData);
};

export const deletarVenda = (id) => {
  return apiClient.delete(`/lmc/vendas/${id}`);
};


export const adicionarCompra = (folhaId, compraData) => {
  return apiClient.post(`/lmc/folhas/${folhaId}/compras`, compraData); 
};

export const atualizarCompra = (id, compraData) => {
  return apiClient.put(`/lmc/compras/${id}`, compraData);
};

export const deletarCompra = (id) => {
  return apiClient.delete(`/lmc/compras/${id}`);
};

export default apiClient;