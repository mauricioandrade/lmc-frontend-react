import React, { useState, useEffect, useCallback } from 'react';
import { getRelatorio } from '../services/api';

function Relatorio() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
  );

  const handleBuscarRelatorio = useCallback(() => {
    setLoading(true);
    setError(null);
    setRelatorios([]);

    getRelatorio(dataInicio, dataFim)
      .then((response) => {
        setRelatorios(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar relatório:', err);
        setError('Não foi possível carregar o relatório.');
        setLoading(false);
      });
  }, [dataInicio, dataFim]);

  useEffect(() => {
    handleBuscarRelatorio();
  }, [handleBuscarRelatorio]);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBuscarRelatorio();
  };

  return (
    <div className="card bg-dark text-white shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="dataInicio" className="form-label text-white-50">
                Data Início
              </label>
              <input
                type="date"
                className="form-control"
                id="dataInicio"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="dataFim" className="form-label text-white-50">
                Data Fim
              </label>
              <input
                type="date"
                className="form-control"
                id="dataFim"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex">
              <button type="submit" className="btn btn-primary w-100 me-2" disabled={loading}>
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

        {loading && (
          <div className="text-center text-white mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Carregando relatórios...</p>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

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
                    {Array.isArray(relatorios) &&
                      relatorios.map((folha) => (
                        <tr key={folha.id}>
                          <td>{formatarData(folha.data)}</td>
                          <td>{folha.produto?.nome || 'N/A'}</td>
                          <td>
                            {(folha.medicoesTanque || [])
                              .reduce((acc, med) => acc + med.estoqueAbertura, 0)
                              .toFixed(2)}{' '}
                            L
                          </td>
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
