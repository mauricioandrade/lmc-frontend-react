import httpClient from './httpClient';

const createConfigResource = (resource) => {
  const basePath = `/config/${resource}`;
  return {
    getAll: () => httpClient.get(basePath),
    getById: (id) => httpClient.get(`${basePath}/${id}`),
    save: (data) =>
      data.id
        ? httpClient.put(`${basePath}/${data.id}`, data)
        : httpClient.post(basePath, data),
    remove: (id) => httpClient.delete(`${basePath}/${id}`),
  };
};

const empresasResource = createConfigResource('empresas');
const produtosResource = createConfigResource('produtos');
const tanquesResource = createConfigResource('tanques');
const bicosResource = createConfigResource('bicos');

export const getTodasEmpresas = () => empresasResource.getAll();
export const salvarEmpresa = (empresaData) => empresasResource.save(empresaData);
export const deletarEmpresa = (id) => empresasResource.remove(id);

export const getProdutos = () => produtosResource.getAll();
export const getProdutoById = (id) => produtosResource.getById(id);
export const salvarProduto = (produtoData) => produtosResource.save(produtoData);
export const deletarProduto = (id) => produtosResource.remove(id);

export const getTanquesPorProduto = (produtoId) =>
  httpClient.get('/config/tanques', { params: { produtoId } });
export const getTodosTanques = () => httpClient.get('/config/tanques/all');
export const salvarTanque = (tanqueData) => tanquesResource.save(tanqueData);
export const deletarTanque = (id) => tanquesResource.remove(id);

export const getBicosPorTanque = (tanqueId) =>
  httpClient.get('/config/bicos', { params: { tanqueId } });
export const getTodosBicos = () => httpClient.get('/config/bicos/all');
export const salvarBico = (bicoData) => bicosResource.save(bicoData);
export const deletarBico = (id) => bicosResource.remove(id);

export const getFolha = (data, produtoId) =>
  httpClient.get('/lmc/folha', { params: { data, produtoId } });
export const salvarFolhaLMC = (lmcData) => httpClient.post('/lmc', lmcData);
export const atualizarFolhaLMC = (id, lmcData) => httpClient.put(`/lmc/${id}`, lmcData);
export const deletarFolhaLMC = (id) => httpClient.delete(`/lmc/${id}`);
export const getRelatorio = (dataInicio, dataFim) =>
  httpClient.get('/lmc/relatorio', { params: { inicio: dataInicio, fim: dataFim } });
export const atualizarObservacoes = (folhaId, observacoesTexto) =>
  httpClient.put(`/lmc/folha/${folhaId}/observacoes`, { observacoes: observacoesTexto });

export const adicionarMedicao = (folhaId, medicaoData) =>
  httpClient.post(`/lmc/folhas/${folhaId}/medicoes`, medicaoData);
export const atualizarMedicao = (id, medicaoData) => httpClient.put(`/lmc/medicoes/${id}`, medicaoData);
export const deletarMedicao = (id) => httpClient.delete(`/lmc/medicoes/${id}`);

export const adicionarVenda = (folhaId, vendaData) =>
  httpClient.post(`/lmc/folhas/${folhaId}/vendas`, vendaData);
export const atualizarVenda = (id, vendaData) => httpClient.put(`/lmc/vendas/${id}`, vendaData);
export const deletarVenda = (id) => httpClient.delete(`/lmc/vendas/${id}`);

export const adicionarCompra = (folhaId, compraData) =>
  httpClient.post(`/lmc/folhas/${folhaId}/compras`, compraData);
export const atualizarCompra = (id, compraData) => httpClient.put(`/lmc/compras/${id}`, compraData);
export const deletarCompra = (id) => httpClient.delete(`/lmc/compras/${id}`);

export default httpClient;
