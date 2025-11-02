import React, { useState, useEffect } from 'react';
import { getRelatorio } from '../services/api'; // Importa a função da nossa API

function Relatorio() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false); // Inicia como false
  const [error, setError] = useState(null);

  // --- ALTERAÇÃO 1: ESTADO PARA AS DATAS ---
  // Define a data final padrão como "hoje"
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  // Define a data inicial padrão como o primeiro dia do mês atual
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  
  // --- ALTERAÇÃO 2: FUNÇÃO DE BUSCA ---
  // Criamos uma função separada para 'buscar'
  const handleBuscarRelatorio = () => {
    setLoading(true);
    setError(null);
    setRelatorios([]); // Limpa os resultados antigos

    getRelatorio(dataInicio, dataFim)
      .then(response => {
        setRelatorios(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar relatório:", err);
        setError("Não foi possível carregar o relatório.");
        setLoading(false);
      });
  };

  // --- ALTERAÇÃO 3: useEffect ---
  // Agora o useEffect busca os dados do mês atual assim que a página carrega
  useEffect(() => {
    handleBuscarRelatorio();
  }, []); // Roda apenas uma vez no carregamento inicial

  // Helper para formatar a data
  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Função para o <form> (chama a busca e previne o reload da página)
  const handleSubmit = (e) => {
    e.preventDefault();
    handleBuscarRelatorio();
  };

  // O 'return' principal agora inclui o formulário de filtro
  return (
    <div className="card bg-dark text-white shadow-sm">
      <div className="card-body">
        
        {/* --- ALTERAÇÃO 4: FORMULÁRIO DE FILTRO DE DATA --- */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="dataInicio" className="form-label text-white-50">Data Início</label>
              <input 
                type="date" 
                className="form-control"
                id="dataInicio"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="dataFim" className="form-label text-white-50">Data Fim</label>
              <input 
                type="date" 
                className="form-control"
                id="dataFim"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex">
              <button 
                type="submit" 
                className="btn btn-primary w-100 me-2"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              <a 
                href={`http://localhost:8080/api/lmc/relatorio/pdf?inicio=${dataInicio}&fim=${dataFim}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light w-100"
              >
                Exportar PDF
              </a>
            </div>
          </div>
        </form>

        {/* --- Fim da Alteração --- */}

        {/* Mensagens de erro e loading */}
        {loading && (
          <div className="text-center text-white mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Carregando relatórios...</p>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* --- Tabela de Resultados (só aparece se não estiver carregando) --- */}
        {!loading && (
          <>
            <h5 className="card-title mb-3">Relatório de Movimentações</h5>
            {relatorios.length === 0 ? (
              <p className="card-text">Nenhum registro encontrado no período.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Data</th>
                      <th scope="col">Produto</th>
                      <th scope="col">Est. Abertura</th>
                      <th scope="col">Recebido</th>
                      <th scope="col">Vendas</th>
                      <th scope="col">Est. Escritural</th>
                      <th scope="col">Est. Físico</th>
                      <th scope="col">Perdas/Ganhos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(relatorios) && relatorios.map(folha => (
                      <tr key={folha.id}>
                        <td>{formatarData(folha.data)}</td>
                        <td>{folha.produto?.nome || 'N/A'}</td>
                        <td>{(folha.medicoesTanque || []).reduce((acc, med) => acc + med.estoqueAbertura, 0).toFixed(2)} L</td>
                        <td>{folha.totalRecebido.toFixed(2)} L</td>
                        <td>{folha.totalVendasDia.toFixed(2)} L</td>
                        <td>{folha.estoqueEscritural.toFixed(2)} L</td>
                        <td>{folha.estoqueFechamento.toFixed(2)} L</td>
                        <td className={folha.perdasGanhos < 0 ? 'text-danger' : 'text-success'}>
                          {folha.perdasGanhos.toFixed(2)} L
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Relatorio;