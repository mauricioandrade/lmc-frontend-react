import React, { useState, useEffect } from 'react';
import { getRelatorio } from '../services/api';

function Relatorio() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );

  const handleBuscarRelatorio = () => {
    setLoading(true);
    setError(null);
    setRelatorios([]);

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

  useEffect(() => {
    handleBuscarRelatorio();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBuscarRelatorio();
  };

  return (
    <section className="page-section">
      <div className="page-section__header page-section__header--left">
        <h2 className="page-section__title page-section__title--secondary">Relatório de Movimentações</h2>
        <p className="page-section__subtitle">
          Consulte rapidamente o histórico de entradas e saídas por período e exporte os dados em PDF.
        </p>
      </div>

      <div className="card surface-card">
        <div className="card-body surface-card__body">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="dataInicio" className="form-label">Data Início</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataInicio"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="dataFim" className="form-label">Data Fim</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataFim"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex flex-column flex-md-row gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
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

          {loading && (
            <div className="text-center text-muted mt-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Carregando relatórios...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && (
            <>
              {relatorios.length === 0 ? (
                <p className="card-text text-muted mb-0">Nenhum registro encontrado no período.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-striped table-hover align-middle">
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
    </section>
  );
}

export default Relatorio;